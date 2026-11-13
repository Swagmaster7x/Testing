package com.personal.tilesurge.ui

import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.RectF
import android.view.MotionEvent
import com.personal.tilesurge.core.Difficulty
import com.personal.tilesurge.core.EventType
import com.personal.tilesurge.core.Game
import com.personal.tilesurge.core.Phase
import com.personal.tilesurge.core.Puzzles
import com.personal.tilesurge.core.Speed
import com.personal.tilesurge.core.Stages
import java.util.Locale
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.floor
import kotlin.math.pow
import kotlin.math.sin
import kotlin.random.Random

/** Remembers the text made for a number, so a readout that has not changed is not formatted again every frame. */
private class Memo(private val make: (Int) -> String) {
    private var key = Int.MIN_VALUE
    private var text = ""
    fun of(n: Int): String {
        if (n != key) {
            key = n
            text = make(n)
        }
        return text
    }
}

object Format {
    /** Frames as minutes and seconds: 1:07. */
    fun clock(frames: Int): String = String.format(Locale.US, "%d:%02d", frames / 3600, frames / 60 % 60)

    /** Frames as minutes, seconds and tenths: 1:07.4. */
    fun clockTenths(frames: Int): String =
        String.format(Locale.US, "%d:%02d.%d", frames / 3600, frames / 60 % 60, frames % 60 / 6)

    fun number(n: Int): String = String.format(Locale.US, "%,d", n)
}

/** The game itself: the well, the readouts above it, the raise button below it, and the pause and result panels. */
class PlayScene(app: App, val setup: Setup, private val fixedSeed: Long? = null, resumed: Game? = null) : Scene(app) {

    var game: Game = resumed ?: newGame()
        private set

    /** The lesson being taught, if this is one. */
    private val lesson: Lesson? = (setup as? Setup.Lesson)?.let { Lessons.all[it.number - 1] }

    /** Frames since the lesson's goal was met (0 = not yet), swaps made so far, and frames the board has sat still since. */
    private var lessonDone = 0
    private var lessonSwaps = 0
    private var lessonIdle = 0

    /** Frames of screen shake left after a big clear. */
    private var shake = 0
    val board = BoardRenderer(ui, app.art)

    private enum class Panel { NONE, PAUSED, RESULT }

    private var panel = Panel.NONE
    private var clock = 0
    private var endFrames = 0
    private var newBest = false

    /** The record to beat, as it stood when this round began: a score in Infinite, frames in Stage Clear (0 = none). */
    private var bestAtStart = recordToBeat()

    // ---- layout
    private var wide = false
    val raiseRect = RectF()
    private val cards = Array(3) { RectF() }
    private val panelRect = RectF()

    // ---- touch
    private var boardFinger = -1
    private var raiseFinger = -1
    private var fingerX = 0f
    private var fingerY = 0f

    /** A finger was put down on the well during READY; it picks up whatever is under it at GO. */
    private var waitingForGo = false

    /** Where on the tile the finger took hold, sideways from its middle. The tile keeps that grip as it is dragged. */
    private var gripOffset = 0f

    /** The finger has lifted but the tile is still on its way to where it was dropped. */
    private var lettingGo = false
    private var lettingGoFrames = 0

    // ---- effects
    private class Spark(var x: Float, var y: Float, var vx: Float, var vy: Float, var life: Int, val span: Int, val color: Int, val size: Float)
    private class Popup(val x: Float, val y: Float, val text: String, val face: Int, val ink: Int) {
        var age = 0
    }

    private val sparks = ArrayList<Spark>()
    private val popups = ArrayList<Popup>()
    private var banner = ""
    private var bannerAge = BANNER_FRAMES
    private var goAge = GO_FRAMES
    private val random = Random(7)

    // ---- readout text
    private val scoreText = Memo { Format.number(it) }
    private val bestText = Memo { "BEST " + Format.number(it) }
    private val timeText = Memo { Format.clock(it * 60) }
    private val bestTimeText = Memo { "BEST " + Format.clock(it) }
    private val levelText = Memo { it.toString() }
    private val countText = Memo { it.toString() }
    private val stageText = Memo { it.toString() }

    // ---- buttons
    internal val pauseButton = Button("", ButtonStyle.PLAIN) { pause() }.apply { icon = Icon.PAUSE }
    internal val resumeButton = Button("RESUME", ButtonStyle.PRIMARY) { resume() }
    internal val restartButton = Button("RESTART") { restart() }
    internal val quitButton = Button("QUIT") { quit() }
    internal val nextButton = Button("NEXT STAGE", ButtonStyle.PRIMARY) { nextStage() }
    internal val againButton = Button("PLAY AGAIN") { if (setup is Setup.Lesson) app.go(HowToScene(app)) else restart() }
    internal val menuButton = Button("MENU") { quit() }

    init {
        buttons += listOf(pauseButton, resumeButton, restartButton, quitButton, nextButton, againButton, menuButton)
        // a game picked up again waits on its pause panel until the player is ready
        showPanel(if (resumed != null) Panel.PAUSED else Panel.NONE)
    }

    private fun newGame(): Game {
        val seed = fixedSeed ?: (System.nanoTime() xor (System.currentTimeMillis() shl 20))
        return when (val s = setup) {
            is Setup.Infinite -> Game.infinite(s.difficulty, s.startLevel, seed)
            is Setup.Stage -> Game.stage(Stages.get(s.number), seed)
            is Setup.Timed -> Game.timed(s.difficulty, s.startLevel, seed)
            is Setup.Daily -> Game.timed(Setup.DAILY_DIFFICULTY, Setup.DAILY_LEVEL, Setup.dailySeed(s.day))
            is Setup.Puzzle -> Game.puzzle(Puzzles.get(s.number))
            is Setup.Lesson -> Lessons.all[s.number - 1].let { Game.fixed(it.rows, 0, it.raise, s.number.toLong()) }
        }
    }

    private fun recordToBeat(): Int = when (val s = setup) {
        is Setup.Infinite -> app.prefs.bestScore(s.difficulty)
        is Setup.Stage -> app.prefs.bestStageFrames(s.number)
        is Setup.Timed -> app.prefs.bestTimed(s.difficulty)
        is Setup.Daily -> app.prefs.dailyBest(s.day)
        is Setup.Puzzle, is Setup.Lesson -> 0
    }

    /** Keeps the score if it is a record for whatever is being played. */
    private fun recordScore() {
        when (val s = setup) {
            is Setup.Infinite -> newBest = app.prefs.recordScore(s.difficulty, game.score)
            is Setup.Timed -> newBest = app.prefs.recordTimed(s.difficulty, game.score)
            is Setup.Daily -> newBest = app.prefs.recordDaily(s.day, Days.yesterday(), game.score)
            else -> Unit
        }
    }

    /** The screen stays awake while a game is running, and may sleep on the pause and result panels. */
    override val keepScreenOn: Boolean
        get() = panel == Panel.NONE && (game.phase == Phase.PLAYING || game.phase == Phase.COUNTDOWN)

    val isPaused: Boolean get() = panel == Panel.PAUSED
    val showsResult: Boolean get() = panel == Panel.RESULT

    // ------------------------------------------------------------ layout

    override fun layout() {
        wide = safe.width() > safe.height() * 0.95f
        if (wide) layoutWide() else layoutTall()
        layoutPanel()
    }

    /** A phone held upright: readouts on top, the well in the middle, the raise button underneath. */
    private fun layoutTall() {
        val l = colLeft + 12f * u
        val r = colRight - 12f * u
        val hudTop = safe.top + 10f * u
        val hudH = 56f * u
        val gap = 8f * u
        val pauseW = 46f * u
        pauseButton.set(r - pauseW, hudTop, r, hudTop + hudH)
        val cardsW = r - l - pauseW - gap * 3
        val w0 = cardsW * 0.42f
        val w1 = cardsW * 0.27f
        cards[0].set(l, hudTop, l + w0, hudTop + hudH)
        cards[1].set(cards[0].right + gap, hudTop, cards[0].right + gap + w1, hudTop + hudH)
        cards[2].set(cards[1].right + gap, hudTop, r - pauseW - gap, hudTop + hudH)

        val raiseH = 60f * u
        val raiseBottom = safe.bottom - 22f * u
        val areaTop = hudTop + hudH + 24f * u
        val areaBottom = raiseBottom - raiseH - 16f * u
        val cell = floor(minOf((r - l - 8f * u) / Game.COLS, (areaBottom - areaTop) / Game.ROWS))
        val bw = cell * Game.COLS
        val bh = cell * Game.ROWS
        val left = floor(safe.centerX() - bw / 2f)
        // sit the well on the raise button, and take up any slack above it
        val top = floor(areaBottom - bh - (areaBottom - areaTop - bh) * 0.35f)
        board.place(left, top, cell)
        val raiseTop = board.bottom + 16f * u
        raiseRect.set(left - 4f * u, raiseTop, left + bw + 4f * u, raiseTop + raiseH)
    }

    /** A tablet or a wide window: readouts to the left of the well, the raise button to the right. */
    private fun layoutWide() {
        val cell = floor(minOf((safe.height() - 28f * u) / Game.ROWS, safe.width() * 0.46f / Game.COLS))
        val bw = cell * Game.COLS
        val left = floor(safe.centerX() - bw / 2f)
        val top = floor(safe.centerY() - cell * Game.ROWS / 2f)
        board.place(left, top, cell)
        val sideW = minOf(150f * u, left - safe.left - 28f * u)
        val sl = left - 16f * u - sideW
        val cardH = 56f * u
        val gap = 8f * u
        pauseButton.set(sl, top, sl + 46f * u, top + cardH)
        for (i in 0 until 3) {
            val t = top + (cardH + gap) * (i + 1)
            cards[i].set(sl, t, sl + sideW, t + cardH)
        }
        val rl = board.right + 16f * u
        raiseRect.set(rl, board.bottom - 110f * u, rl + sideW, board.bottom + 4f * u)
    }

    private fun layoutPanel() {
        val pw = minOf(300f * u, colRight - colLeft - 32f * u)
        val bh = 52f * u
        val gap = 10f * u
        val shown = when (panel) {
            Panel.PAUSED -> listOf(resumeButton, restartButton, quitButton)
            Panel.RESULT -> listOf(nextButton, againButton, menuButton).filter { it.visible }
            Panel.NONE -> emptyList()
        }
        val head = if (panel == Panel.RESULT) 196f * u else 64f * u
        val ph = head + shown.size * (bh + gap) + 14f * u
        val cx = safe.centerX()
        val cy = safe.centerY()
        panelRect.set(cx - pw / 2f, cy - ph / 2f, cx + pw / 2f, cy + ph / 2f)
        var y = panelRect.top + head
        for (b in shown) {
            b.set(panelRect.left + 20f * u, y, panelRect.right - 20f * u, y + bh)
            y += bh + gap
        }
    }

    private fun showPanel(p: Panel) {
        panel = p
        val stage = setup as? Setup.Stage
        val puzzle = setup as? Setup.Puzzle
        val lessons = setup is Setup.Lesson
        resumeButton.visible = p == Panel.PAUSED
        restartButton.visible = p == Panel.PAUSED
        quitButton.visible = p == Panel.PAUSED
        val cleared = game.phase == Phase.STAGE_CLEAR
        val more = (stage != null && stage.number < Stages.COUNT) || (puzzle != null && puzzle.number < Puzzles.COUNT)
        nextButton.visible = p == Panel.RESULT && ((cleared && more) || lessons)
        nextButton.label = when {
            lessons -> "PLAY STAGE 1"
            puzzle != null -> "NEXT PUZZLE"
            else -> "NEXT STAGE"
        }
        againButton.visible = p == Panel.RESULT
        menuButton.visible = p == Panel.RESULT
        // The main action is whatever moves the player on.
        againButton.style = if (nextButton.visible) ButtonStyle.PLAIN else ButtonStyle.PRIMARY
        againButton.label = when {
            lessons -> "READ THE RULES"
            (stage != null || puzzle != null) && !cleared -> "TRY AGAIN"
            else -> "PLAY AGAIN"
        }
        menuButton.label = when {
            stage != null -> "STAGES"
            puzzle != null -> "PUZZLES"
            else -> "MENU"
        }
        quitButton.label = when {
            stage != null -> "QUIT TO STAGES"
            puzzle != null -> "QUIT TO PUZZLES"
            lessons -> "SKIP THE LESSONS"
            else -> "QUIT TO MENU"
        }
        pauseButton.enabled = p == Panel.NONE
        if (width > 0f) layoutPanel()
    }

    // ------------------------------------------------------------ pausing, leaving, starting over

    fun pause() {
        if (panel != Panel.NONE || (game.phase != Phase.PLAYING && game.phase != Phase.COUNTDOWN)) return
        dropFingers()
        showPanel(Panel.PAUSED)
        // Put the game away as it stands, in case the app is closed before the player comes back to it.
        val what = setup.encode()
        if (what != null) app.prefs.saveGame(what, game.save())
    }

    private fun resume() = showPanel(Panel.NONE)

    private fun restart() {
        app.prefs.clearSavedGame()
        game = newGame()
        resetRound()
    }

    private fun nextStage() {
        when (val s = setup) {
            is Setup.Stage -> app.go(PlayScene(app, Setup.Stage(s.number + 1)))
            is Setup.Puzzle -> app.go(PlayScene(app, Setup.Puzzle(s.number + 1)))
            is Setup.Lesson -> app.go(PlayScene(app, Setup.Stage(1)))
            else -> Unit
        }
    }

    private fun quit() {
        app.prefs.clearSavedGame()
        if (setup is Setup.Lesson) app.prefs.lessonsDone = true
        app.go(when (setup) {
            is Setup.Stage -> StageSelectScene(app)
            is Setup.Puzzle -> StageSelectScene(app, puzzles = true)
            is Setup.Infinite -> InfiniteSetupScene(app)
            is Setup.Timed -> InfiniteSetupScene(app, timed = true)
            is Setup.Daily, is Setup.Lesson -> TitleScene(app)
        })
    }

    private fun resetRound() {
        dropFingers()
        sparks.clear()
        popups.clear()
        bannerAge = BANNER_FRAMES
        goAge = GO_FRAMES
        endFrames = 0
        newBest = false
        lessonDone = 0
        lessonSwaps = 0
        lessonIdle = 0
        shake = 0
        bestAtStart = recordToBeat()
        showPanel(Panel.NONE)
    }

    override fun onBack(): Boolean {
        when (panel) {
            Panel.NONE -> if (game.phase == Phase.PLAYING || game.phase == Phase.COUNTDOWN) pause() else quit()
            Panel.PAUSED -> resume()
            Panel.RESULT -> quit()
        }
        return true
    }

    override fun onInterrupted() = pause()

    // ------------------------------------------------------------ touch

    private fun dropFingers() {
        boardFinger = -1
        raiseFinger = -1
        lettingGo = false
        waitingForGo = false
        game.release()
        game.raiseHeld = false
        releaseButtons()
    }

    private fun onBoard(x: Float, y: Float): Boolean =
        x >= board.left - 14f * u && x <= board.right + 14f * u && y >= board.top - 8f * u && y <= board.bottom + 6f * u

    private fun onRaise(x: Float, y: Float, slack: Float): Boolean =
        x >= raiseRect.left - slack && x <= raiseRect.right + slack && y >= raiseRect.top - slack && y <= raiseRect.bottom + slack

    override fun onTouch(e: MotionEvent): Boolean {
        if (panel != Panel.NONE) return touchButtons(e)
        when (e.actionMasked) {
            MotionEvent.ACTION_DOWN, MotionEvent.ACTION_POINTER_DOWN -> {
                val i = e.actionIndex
                val id = e.getPointerId(i)
                val x = e.getX(i)
                val y = e.getY(i)
                when {
                    pauseButton.hit(x, y, 8f * u) -> {
                        app.sound.play(Sfx.TAP)
                        pause()
                    }
                    game.raiseAllowed && onRaise(x, y, 8f * u) -> if (raiseFinger == -1) {
                        raiseFinger = id
                        app.buzz()
                    }
                    // One finger at a time holds a tile. While one is holding, another touch takes over only
                    // if it lands squarely on a tile, so two thumbs can hand over to each other, but a palm
                    // on an empty part of the well, or a thumb that just misses RAISE, knocks nothing loose.
                    onBoard(x, y) -> {
                        val free = boardFinger == -1
                        if (grabAt(x, y, forgiving = free)) {
                            // a new hold; it takes over from any tile that was held or still travelling
                            boardFinger = id
                            fingerX = x
                            fingerY = y
                            lettingGo = false
                            waitingForGo = false
                        } else if (free && game.phase == Phase.COUNTDOWN) {
                            boardFinger = id
                            fingerX = x
                            fingerY = y
                            waitingForGo = true
                        }
                    }
                }
            }
            MotionEvent.ACTION_MOVE -> {
                for (i in 0 until e.pointerCount) {
                    val id = e.getPointerId(i)
                    if (id == boardFinger) {
                        fingerX = e.getX(i)
                        fingerY = e.getY(i)
                    }
                    // sliding well off the raise button lets go of it
                    if (id == raiseFinger && !onRaise(e.getX(i), e.getY(i), 44f * u)) raiseFinger = -1
                }
            }
            MotionEvent.ACTION_UP, MotionEvent.ACTION_POINTER_UP -> {
                val i = e.actionIndex
                val id = e.getPointerId(i)
                if (id == boardFinger) {
                    fingerX = e.getX(i)
                    boardFinger = -1
                    waitingForGo = false
                    if (game.grabbedId != 0) {
                        // Let the tile finish its trip to where the finger left it, then let go.
                        lettingGo = true
                        lettingGoFrames = 30
                    }
                }
                if (id == raiseFinger) raiseFinger = -1
            }
            MotionEvent.ACTION_CANCEL -> dropFingers()
        }
        return true
    }

    /**
     * Picks up the tile under the finger. With [forgiving], a touch that lands just beside or just above
     * a tile picks that tile up too.
     * False if there was nothing there to pick up (and whatever was held before is still held).
     */
    private fun grabAt(x: Float, y: Float, forgiving: Boolean = true): Boolean {
        val colF = (x - board.left) / board.cell
        val rowF = board.rowAt(game, y)
        val col = floor(colF).toInt()
        val row = floor(rowF).toInt()
        if (!game.grab(row, col)) {
            if (!forgiving) return false
            // A tile that cannot be held just now (it is popping, or falling) is not a near miss of its neighbour.
            if (row in 0 until Game.ROWS && col in 0 until Game.COLS && game.grid[row][col].kind != 0) return false
            val fy = rowF - row
            val fx = colF - col
            // just above a tile (the stack keeps moving up under the finger), just below the bottom row, or just beside one
            val found = (fy < 0.40f && game.grab(row - 1, col)) ||
                (row == -1 && fy > 0.55f && game.grab(0, col)) ||
                (fx < 0.30f && game.grab(row, col - 1)) ||
                (fx > 0.70f && game.grab(row, col + 1))
            if (!found) return false
        }
        val at = game.locate(game.grabbedId)
        if (at < 0) return false
        val centre = board.cellLeft(at % Game.COLS) + board.cell / 2f
        gripOffset = (x - centre).coerceIn(-board.cell * 0.75f, board.cell * 0.75f)
        return true
    }

    /** Works out which column the finger is asking for and tells the game. */
    private fun steerHeldTile() {
        val id = game.grabbedId
        if (id == 0) {
            lettingGo = false
            return
        }
        val at = game.locate(id)
        if (at < 0) return
        val col = at % Game.COLS
        val centre = board.cellLeft(col) + board.cell / 2f
        // Where the middle of the tile would be if it followed the finger exactly.
        val wanted = fingerX - gripOffset
        // It has to go a little more than half a cell before the tile steps across, so a tile
        // does not flutter on a boundary and a wobbly press does not move anything.
        val reach = board.cell * 0.56f
        val target = when {
            wanted > centre + reach -> maxOf(col + 1, board.colAt(wanted))
            wanted < centre - reach -> minOf(col - 1, board.colAt(wanted))
            else -> col
        }.coerceIn(0, Game.COLS - 1)
        game.dragTo(target)
        if (lettingGo && (target == col || --lettingGoFrames <= 0)) {
            game.release()
            lettingGo = false
        }
    }

    // ------------------------------------------------------------ the clock

    override fun tick() {
        clock++
        if (panel == Panel.PAUSED) return
        if (panel == Panel.NONE) {
            steerHeldTile()
            game.raiseHeld = raiseFinger != -1
        } else {
            game.raiseHeld = false
        }
        if (game.phase == Phase.COUNTDOWN && game.countdown == Game.COUNTDOWN_FRAMES) app.sound.play(Sfx.READY)
        game.tick()
        tickLesson()
        handleEvents()
        tickEffects()
        when (game.phase) {
            Phase.PLAYING -> {
                // an alarm while the stack is pressed against the top and the clock is running out
                if (game.topOccupied && !game.settling && game.stopFrames == 0 && clock % 26 == 0) app.sound.play(Sfx.WARN)
                // Score Attack: a tick for each of the last ten seconds
                if (game.timeLimit > 0 && game.timeLeft in 1..600 && game.timeLeft % 60 == 0) app.sound.play(Sfx.TAP)
            }
            Phase.GAME_OVER, Phase.STAGE_CLEAR, Phase.TIME_UP -> {
                endFrames++
                if (game.phase == Phase.STAGE_CLEAR && endFrames < 50 && endFrames % 5 == 0) celebrate()
                if (endFrames == RESULT_DELAY && panel == Panel.NONE) showPanel(Panel.RESULT)
            }
            Phase.COUNTDOWN -> Unit
        }
    }

    /** A lesson moves on when its goal is met, and starts over if the player has used up the board without meeting it. */
    private fun tickLesson() {
        val l = lesson ?: return
        if (panel != Panel.NONE) return
        lessonSwaps += game.events.count { it.type == EventType.SWAP }
        if (lessonDone == 0) {
            if (l.done(game, game.events)) {
                lessonDone = 1
                showBanner("NICE!")
                app.sound.play(Sfx.LEVEL)
            } else {
                lessonIdle = if (!l.raise && lessonSwaps > 0 && !game.active) lessonIdle + 1 else 0
                if (lessonIdle > 110) {
                    game = newGame()
                    resetRound()
                    showBanner("TRY THAT AGAIN")
                }
            }
            return
        }
        lessonDone++
        if (lessonDone >= 85 && !game.active) {
            val number = (setup as Setup.Lesson).number
            if (number < Lessons.COUNT) {
                app.go(PlayScene(app, Setup.Lesson(number + 1)))
            } else {
                app.prefs.lessonsDone = true
                dropFingers()
                showPanel(Panel.RESULT)
            }
        }
    }

    private fun handleEvents() {
        if (game.events.isEmpty()) return
        var landed = false
        val cell = board.cell
        for (e in game.events) {
            when (e.type) {
                EventType.GO -> {
                    goAge = 0
                    app.sound.play(Sfx.GO)
                    // a finger that was already resting on a tile takes hold of it now
                    if (waitingForGo) {
                        waitingForGo = false
                        if (boardFinger != -1 && !grabAt(fingerX, fingerY)) boardFinger = -1
                    }
                }
                EventType.SWAP -> {
                    app.sound.play(Sfx.SWAP, volume = 0.8f)
                    app.buzz()
                    if (!app.prefs.hintSeen) app.prefs.hintSeen = true
                }
                EventType.LAND -> landed = true
                EventType.MATCH -> {
                    val x = (board.cellLeft(e.col) + cell / 2f).coerceIn(board.left + 52f * u, board.right - 52f * u)
                    var y = board.cellTop(game, e.row) + cell * 0.2f
                    if (e.b >= 2) {
                        popups += Popup(x, y, "×${e.b} CHAIN", Palette.TEAL, 0xFF06272A.toInt())
                        y -= 30f * u
                        app.sound.play(Sfx.CHAIN, rate = 2f.pow((e.b - 2).coerceAtMost(6) * 2f / 12f))
                        app.buzz(strong = true)
                    } else if (e.a >= 4) {
                        app.sound.play(Sfx.COMBO)
                    } else {
                        app.sound.play(Sfx.MATCH, volume = 0.7f)
                    }
                    if (e.a >= 4) popups += Popup(x, y, "${e.a} COMBO", Palette.ACCENT, Palette.TEXT_DARK)
                    // a big clear is felt as well as seen
                    if (e.b >= 2 || e.a >= 5) shake = 10 + 2 * minOf(e.b, 5)
                }
                EventType.POP -> {
                    burst(board.cellLeft(e.col) + cell / 2f, board.cellTop(game, e.row) + cell / 2f, TileArt.LIGHT[e.kind], 7)
                    // each pop a note higher than the last, and higher again with every chain step
                    val steps = ((e.a - 1) * 2 + (e.b - 1) * 3).coerceAtMost(12)
                    app.sound.play(Sfx.POP, rate = 2f.pow(steps / 12f), volume = 0.9f)
                }
                EventType.ROW -> if (e.a == 1) app.sound.play(Sfx.ROW, volume = 0.6f)
                EventType.LEVEL_UP -> {
                    showBanner("SPEED UP!")
                    app.sound.play(Sfx.LEVEL)
                }
                EventType.CHAIN_END -> Unit
                EventType.LINE_SHOWN -> {
                    showBanner("CLEAR EVERYTHING ABOVE THE LINE")
                    app.sound.play(Sfx.LINE)
                }
                EventType.GAME_OVER -> {
                    app.sound.play(Sfx.OVER)
                    app.buzz(strong = true)
                    dropFingers()
                    app.prefs.clearSavedGame()
                    recordScore()
                }
                EventType.TIME_UP -> {
                    app.sound.play(Sfx.CLEAR)
                    app.buzz(strong = true)
                    dropFingers()
                    app.prefs.clearSavedGame()
                    recordScore()
                }
                EventType.STAGE_CLEAR -> {
                    app.sound.play(Sfx.CLEAR)
                    app.buzz(strong = true)
                    dropFingers()
                    app.prefs.clearSavedGame()
                    val s = setup
                    if (s is Setup.Stage) newBest = app.prefs.recordStage(s.number, game.frames)
                    if (s is Setup.Puzzle) app.prefs.recordPuzzle(s.number)
                }
            }
        }
        if (landed) app.sound.play(Sfx.LAND, volume = 0.7f)
        game.events.clear()
    }

    private fun showBanner(text: String) {
        banner = text
        bannerAge = 0
    }

    private fun burst(x: Float, y: Float, color: Int, count: Int) {
        if (sparks.size > 220) return
        for (i in 0 until count) {
            val a = random.nextFloat() * 2f * PI.toFloat()
            val speed = (1.4f + random.nextFloat() * 2.6f) * u
            val span = 16 + random.nextInt(14)
            sparks += Spark(x, y, cos(a) * speed, sin(a) * speed - 1.2f * u, span, span, color, (3f + random.nextFloat() * 3.5f) * u)
        }
    }

    private fun celebrate() {
        val x = board.left + random.nextFloat() * board.width
        val y = board.top + board.height * (0.15f + random.nextFloat() * 0.5f)
        burst(x, y, TileArt.LIGHT[1 + random.nextInt(TileArt.KINDS)], 12)
    }

    private fun tickEffects() {
        var i = sparks.size - 1
        while (i >= 0) {
            val s = sparks[i]
            s.x += s.vx
            s.y += s.vy
            s.vy += 0.16f * u
            if (--s.life <= 0) sparks.removeAt(i)
            i--
        }
        i = popups.size - 1
        while (i >= 0) {
            if (++popups[i].age >= POPUP_FRAMES) popups.removeAt(i)
            i--
        }
        if (bannerAge < BANNER_FRAMES) bannerAge++
        if (goAge < GO_FRAMES) goAge++
        if (shake > 0) shake--
    }

    // ------------------------------------------------------------ drawing

    override fun draw(c: Canvas) {
        ui.background(c, width, height)
        drawReadouts(c)

        val alarm = when {
            game.phase != Phase.PLAYING -> 0f
            game.topOccupied -> 0.55f + 0.45f * sin(clock * 0.38f)
            game.stackHeight() >= Game.DANGER_HEIGHT -> 0.22f + 0.22f * sin(clock * 0.2f)
            else -> 0f
        }
        val grey = if (game.phase == Phase.GAME_OVER) minOf(Game.ROWS, endFrames / 3) else 0
        c.save()
        if (shake > 0) c.translate(sin(clock * 1.9f) * shake * 0.45f * u, cos(clock * 2.3f) * shake * 0.35f * u)
        board.draw(c, game, clock, grey, alarm)
        drawMeter(c)
        drawEffects(c)
        c.restore()
        drawRaise(c)
        pauseButton.draw(c, ui)
        drawCallouts(c)
        if (panel != Panel.NONE) drawPanel(c)
    }

    private fun drawReadouts(c: Canvas) {
        when (val s = setup) {
            is Setup.Infinite -> {
                readout(c, cards[0], "SCORE", scoreText.of(game.score), bestText.of(maxOf(bestAtStart, game.score)))
                readout(c, cards[1], "TIME", timeText.of(game.seconds), null)
                speedReadout(c)
            }
            is Setup.Timed, is Setup.Daily -> {
                readout(c, cards[0], "SCORE", scoreText.of(game.score), bestText.of(maxOf(bestAtStart, game.score)))
                // whole seconds still to go, so it reads 0:01 until the very end
                readout(c, cards[1], "TIME LEFT", timeText.of((game.timeLeft + 59) / 60), null)
                speedReadout(c)
            }
            is Setup.Stage -> {
                readout(c, cards[0], "STAGE", stageText.of(s.number), if (bestAtStart > 0) bestTimeText.of(bestAtStart) else null)
                readout(c, cards[1], "TIME", timeText.of(game.seconds), null)
                if (game.lineRow < 0) {
                    readout(c, cards[2], "LINE IN", countText.of(game.linesToGo), null)
                } else {
                    readout(c, cards[2], "TO CLEAR", countText.of(tilesAboveLine()), null)
                }
            }
            is Setup.Puzzle -> {
                readout(c, cards[0], "PUZZLE", stageText.of(s.number), null)
                readout(c, cards[1], "MOVES", levelText.of(game.movesLeft), null)
                readout(c, cards[2], "TILES", countText.of(game.tileCount()), null)
            }
            is Setup.Lesson -> {
                // one wide card with what to do
                val l = cards[0].left
                val r = cards[2].right
                val t = cards[0].top
                val b = cards[0].bottom
                ui.card(c, l, t, r, b, 12f * u)
                val text = lesson?.text ?: ""
                ui.text(c, "LESSON ${s.number} OF ${Lessons.COUNT}", (l + r) / 2f, t + 12f * u, 9.5f * u, Palette.ACCENT, face = ui.semi)
                ui.paragraph(c, text, (l + r) / 2f, t + 28f * u, r - l - 16f * u, 11.5f * u, Palette.TEXT)
            }
        }
    }

    private fun speedReadout(c: Canvas) {
        readout(c, cards[2], "SPEED", levelText.of(game.level), null)
        // how close the next speed-up is
        if (game.level < Speed.MAX_LEVEL) {
            val r = cards[2]
            val p = game.levelProgress.toFloat() / Speed.tilesToNextLevel(game.level)
            val l = r.left + 10f * u
            val w = r.width() - 20f * u
            ui.roundRect(c, l, r.bottom - 9f * u, l + w, r.bottom - 5f * u, 2f * u, Palette.PANEL_DARK)
            if (p > 0f) ui.roundRect(c, l, r.bottom - 9f * u, l + w * p, r.bottom - 5f * u, 2f * u, Palette.TEAL)
        }
    }

    private fun tilesAboveLine(): Int {
        var n = 0
        for (r in maxOf(0, game.lineRow) until Game.ROWS) for (col in 0 until Game.COLS) if (game.grid[r][col].kind != 0) n++
        return n
    }

    private fun readout(c: Canvas, r: RectF, label: String, value: String, note: String?) {
        ui.card(c, r.left, r.top, r.right, r.bottom, 12f * u)
        val pad = 10f * u
        if (note == null) {
            ui.text(c, label, r.centerX(), r.top + 15f * u, 10.5f * u, Palette.TEXT_DIM, face = ui.semi)
        } else {
            ui.text(c, label, r.left + pad, r.top + 15f * u, 10.5f * u, Palette.TEXT_DIM, Paint.Align.LEFT, ui.semi)
            val size = ui.fitSize(note, 9.5f * u, r.width() - pad * 2.6f - ui.textWidth(label, 10.5f * u, ui.semi), ui.semi)
            ui.text(c, note, r.right - pad, r.top + 15f * u, size, Palette.ACCENT, Paint.Align.RIGHT, ui.semi)
        }
        val size = ui.fitSize(value, 24f * u, r.width() - pad * 1.6f)
        ui.text(c, value, r.centerX(), r.top + 36f * u, size, Palette.TEXT)
    }

    /** The strip above the well: red while time is running out at the top, teal while the stack is held still. */
    private fun drawMeter(c: Canvas) {
        if (game.phase != Phase.PLAYING) return
        val y = board.top - 15f * u
        val h = 5f * u
        when {
            game.topOccupied -> {
                ui.roundRect(c, board.left, y, board.right, y + h, h / 2f, Palette.PANEL_DARK)
                val w = board.width * game.graceFraction
                if (w > h) ui.roundRect(c, board.left, y, board.left + w, y + h, h / 2f, Palette.DANGER)
            }
            game.stopFrames > 0 -> {
                ui.roundRect(c, board.left, y, board.right, y + h, h / 2f, Palette.PANEL_DARK)
                val w = board.width * minOf(1f, game.stopFrames / 240f)
                if (w > h) ui.roundRect(c, board.left, y, board.left + w, y + h, h / 2f, Palette.TEAL)
            }
        }
    }

    private fun drawEffects(c: Canvas) {
        ui.fill.shader = null
        for (s in sparks) {
            val k = s.life.toFloat() / s.span
            ui.fill.color = Palette.withAlpha(s.color, k)
            val half = s.size * (0.4f + 0.6f * k) / 2f
            ui.rect.set(s.x - half, s.y - half, s.x + half, s.y + half)
            c.drawRoundRect(ui.rect, half * 0.5f, half * 0.5f, ui.fill)
        }
        for (p in popups) {
            val t = p.age.toFloat() / POPUP_FRAMES
            // pop in, drift up, fade out at the end
            val scale = if (p.age < 6) 0.6f + 0.5f * (p.age / 6f) else if (p.age < 10) 1.1f - 0.1f * ((p.age - 6) / 4f) else 1f
            val alpha = if (t > 0.75f) (1f - t) / 0.25f else 1f
            val y = p.y - 34f * u * (1f - (1f - t) * (1f - t))
            val size = 15f * u * scale
            val w = ui.textWidth(p.text, size) + 20f * u * scale
            val h = 26f * u * scale
            ui.roundRect(c, p.x - w / 2f, y - h / 2f + 2f * u, p.x + w / 2f, y + h / 2f + 2f * u, h / 2f, Palette.withAlpha(0xFF000000.toInt(), 0.35f * alpha))
            ui.roundRect(c, p.x - w / 2f, y - h / 2f, p.x + w / 2f, y + h / 2f, h / 2f, Palette.withAlpha(p.face, alpha))
            ui.text(c, p.text, p.x, y, size, Palette.withAlpha(p.ink, alpha))
        }
    }

    private fun drawRaise(c: Canvas) {
        if (!game.raiseAllowed) {
            // no raise button here; a puzzle says what is wanted instead
            val s = setup
            if (s is Setup.Puzzle) {
                val moves = Puzzles.get(s.number).moves
                ui.text(c, "Clear every tile in " + (if (moves == 1) "one move" else "$moves moves"),
                    raiseRect.centerX(), raiseRect.centerY() - 8f * u, 15f * u, Palette.TEXT, face = ui.semi)
                ui.text(c, "each cell a tile slides is a move", raiseRect.centerX(), raiseRect.centerY() + 14f * u,
                    11.5f * u, Palette.TEXT_DIM, face = ui.semi)
            }
            return
        }
        val r = raiseRect
        val held = raiseFinger != -1 && panel == Panel.NONE
        val blocked = game.phase != Phase.PLAYING || game.topOccupied
        val alpha = if (blocked) 0.45f else 1f
        val lip = 5f * u
        val down = if (held) lip else 0f
        val radius = minOf(18f * u, r.height() * 0.3f)
        ui.roundRect(c, r.left, r.top + lip, r.right, r.bottom, radius, Palette.withAlpha(Palette.ACCENT_DARK, alpha))
        val face = if (held) Palette.ACCENT_LIGHT else Palette.ACCENT
        ui.roundRect(c, r.left, r.top + down, r.right, r.bottom - lip + down, radius, Palette.withAlpha(face, alpha))
        val cy = r.top + down + (r.height() - lip) / 2f
        val ink = Palette.withAlpha(Palette.TEXT_DARK, alpha)
        val small = r.width() < 200f * u
        val labelSize = if (small) 17f * u else 21f * u
        ui.text(c, "RAISE", r.centerX(), cy - 7f * u, labelSize, ink)
        ui.text(c, "hold to bring rows up faster", r.centerX(), cy + 13f * u,
            ui.fitSize("hold to bring rows up faster", 10.5f * u, r.width() - 24f * u, ui.semi),
            Palette.withAlpha(Palette.TEXT_DARK, alpha * 0.7f), face = ui.semi)
        // chevrons either side; they run upwards while the button is held
        if (!small) {
            val shift = if (held && !blocked) -((clock % 12) / 12f) * 7f * u else 0f
            for (side in intArrayOf(-1, 1)) {
                val x = r.centerX() + side * (r.width() * 0.5f - 34f * u)
                ui.icon(c, Icon.UP, x, cy - 5f * u + shift, 20f * u, ink)
                ui.icon(c, Icon.UP, x, cy + 6f * u + shift, 20f * u, Palette.withAlpha(Palette.TEXT_DARK, alpha * 0.45f))
            }
        }
    }

    /** READY and GO, the banners, and the first-game hint. */
    private fun drawCallouts(c: Canvas) {
        val cx = board.left + board.width / 2f
        val cy = board.top + board.height * 0.42f
        if (game.phase == Phase.COUNTDOWN) {
            ui.outlinedText(c, "READY", cx, cy, 40f * u, Palette.TEXT, Palette.PANEL_DARK, 8f * u)
        } else if (goAge < GO_FRAMES) {
            val t = goAge.toFloat() / GO_FRAMES
            val a = if (t > 0.6f) (1f - t) / 0.4f else 1f
            ui.outlinedText(c, "GO!", cx, cy, (46f + 14f * t) * u, Palette.withAlpha(Palette.ACCENT, a), Palette.withAlpha(Palette.PANEL_DARK, a), 8f * u)
        }
        if (bannerAge < BANNER_FRAMES) {
            val t = bannerAge.toFloat() / BANNER_FRAMES
            val a = if (t < 0.08f) t / 0.08f else if (t > 0.8f) (1f - t) / 0.2f else 1f
            val y = board.top + 34f * u
            val size = ui.fitSize(banner, 16f * u, board.width - 36f * u)
            val w = ui.textWidth(banner, size) + 28f * u
            ui.roundRect(c, cx - w / 2f, y - 17f * u, cx + w / 2f, y + 17f * u, 17f * u, Palette.withAlpha(Palette.PANEL_DARK, 0.92f * a))
            ui.roundRectLine(c, cx - w / 2f, y - 17f * u, cx + w / 2f, y + 17f * u, 17f * u, Palette.withAlpha(Palette.ACCENT, a), 1.5f * u)
            ui.text(c, banner, cx, y, size, Palette.withAlpha(Palette.ACCENT_LIGHT, a))
        }
        val l = lesson
        if (l != null && lessonDone == 0 && panel == Panel.NONE && boardFinger == -1 && raiseFinger == -1 && !game.active) {
            // a ghost of a finger shows the move, over and over
            val t = (clock % 100) / 100f
            if (l.raise) {
                val pulse = 0.5f + 0.5f * sin(clock * 0.12f)
                fingertip(c, raiseRect.right - 34f * u, raiseRect.centerY() - 2f * u, 0.5f + 0.5f * pulse)
            } else if (game.grid[l.fromRow][l.fromCol].kind != 0) {
                val from = board.cellLeft(l.fromCol) + board.cell * 0.6f
                val to = board.cellLeft(l.toCol) + board.cell * 0.6f
                val k = ((t - 0.25f) / 0.4f).coerceIn(0f, 1f)
                val fade = if (t < 0.12f) t / 0.12f else if (t > 0.85f) (1f - t) / 0.15f else 1f
                fingertip(c, from + (to - from) * k, board.cellTop(game, l.fromRow) + board.cell * 0.66f, fade)
            }
        }
        if (game.phase == Phase.PLAYING && !app.prefs.hintSeen && panel == Panel.NONE && l == null) {
            val text = "Slide a tile sideways to swap it"
            val y = board.top + board.height * 0.24f
            val size = ui.fitSize(text, 14f * u, board.width - 36f * u, ui.semi)
            val w = ui.textWidth(text, size, ui.semi) + 28f * u
            val bob = 3f * u * sin(clock * 0.1f)
            ui.roundRect(c, cx - w / 2f, y - 16f * u + bob, cx + w / 2f, y + 16f * u + bob, 16f * u, Palette.withAlpha(Palette.PANEL_DARK, 0.92f))
            ui.roundRectLine(c, cx - w / 2f, y - 16f * u + bob, cx + w / 2f, y + 16f * u + bob, 16f * u, Palette.TEAL, 1.5f * u)
            ui.text(c, text, cx, y + bob, size, Palette.TEXT, face = ui.semi)
        }
    }

    private fun fingertip(c: Canvas, x: Float, y: Float, alpha: Float) {
        ui.fill.shader = null
        ui.fill.color = Palette.withAlpha(0x66FFFFFF, alpha)
        c.drawCircle(x, y, 14f * u, ui.fill)
        ui.line.pathEffect = null
        ui.line.color = Palette.withAlpha(0xE6FFFFFF.toInt(), alpha)
        ui.line.strokeWidth = 2.4f * u
        c.drawCircle(x, y, 14f * u, ui.line)
    }

    private fun drawPanel(c: Canvas) {
        ui.fill.shader = null
        ui.fill.color = Palette.SHADE
        c.drawRect(0f, 0f, width, height, ui.fill)
        val r = panelRect
        ui.card(c, r.left, r.top, r.right, r.bottom, 20f * u)
        val cx = r.centerX()
        if (panel == Panel.PAUSED) {
            ui.text(c, "PAUSED", cx, r.top + 34f * u, 26f * u, Palette.TEXT)
        } else {
            drawResult(c, r, cx)
        }
        for (b in buttons) if (b !== pauseButton) b.draw(c, ui)
    }

    private fun drawResult(c: Canvas, r: RectF, cx: Float) {
        val s = setup
        val cleared = game.phase == Phase.STAGE_CLEAR
        var title: String
        var bigLabel: String
        var big: String
        var bestLine: String
        var highlight = false
        var stars = -1
        var labels = arrayOf("SCORE", "BEST COMBO", "BEST CHAIN")
        var values = arrayOf(Format.number(game.score), game.maxCombo.toString(), "×" + game.maxChain)
        when (s) {
            is Setup.Infinite -> {
                title = "GAME OVER"
                bigLabel = "SCORE"
                big = Format.number(game.score)
                bestLine = if (newBest) "NEW BEST!" else "BEST " + Format.number(app.prefs.bestScore(s.difficulty))
                highlight = newBest
                labels = arrayOf("TIME", "SPEED", "BEST CHAIN")
                values = arrayOf(Format.clock(game.frames), game.level.toString(), "×" + game.maxChain)
            }
            is Setup.Timed -> {
                title = if (game.phase == Phase.TIME_UP) "TIME UP!" else "GAME OVER"
                bigLabel = "SCORE"
                big = Format.number(game.score)
                bestLine = if (newBest) "NEW BEST!" else "BEST " + Format.number(app.prefs.bestTimed(s.difficulty))
                highlight = newBest
                labels = arrayOf("TILES", "SPEED", "BEST CHAIN")
                values = arrayOf(game.tilesCleared.toString(), game.level.toString(), "×" + game.maxChain)
            }
            is Setup.Daily -> {
                title = if (game.phase == Phase.TIME_UP) "TIME UP!" else "GAME OVER"
                bigLabel = "TODAY'S CHALLENGE"
                big = Format.number(game.score)
                bestLine = if (newBest) "YOUR BEST TODAY!" else "YOUR BEST TODAY " + Format.number(app.prefs.dailyBest(s.day))
                highlight = newBest
                val streak = app.prefs.dailyStreak(Days.today(), Days.yesterday())
                labels = arrayOf("TILES", "DAYS RUNNING", "BEST CHAIN")
                values = arrayOf(game.tilesCleared.toString(), streak.toString(), "×" + game.maxChain)
            }
            is Setup.Stage -> {
                val best = app.prefs.bestStageFrames(s.number)
                if (cleared) {
                    title = "STAGE ${s.number} CLEAR!"
                    bigLabel = ""
                    stars = Stages.get(s.number).stars(game.frames)
                    big = Format.clockTenths(game.frames)
                    bestLine = if (newBest) "NEW BEST TIME!" else "BEST " + Format.clockTenths(best)
                    highlight = newBest
                } else {
                    title = "STAGE ${s.number}"
                    bigLabel = "THE STACK REACHED THE TOP"
                    big = Format.clock(game.frames)
                    bestLine = if (best > 0) "BEST " + Format.clockTenths(best) else "NOT CLEARED YET"
                }
            }
            is Setup.Puzzle -> {
                val def = Puzzles.get(s.number)
                if (cleared) {
                    title = "PUZZLE ${s.number} SOLVED!"
                    bigLabel = "MOVES USED"
                    big = (def.moves - game.movesLeft).toString()
                    bestLine = if (s.number < Puzzles.COUNT) "ON TO THE NEXT" else "THAT WAS THE LAST ONE"
                } else {
                    title = "PUZZLE ${s.number}"
                    bigLabel = "OUT OF MOVES"
                    big = game.tileCount().toString()
                    bestLine = "TILES LEFT"
                }
                labels = arrayOf("MOVES", "TILES", "BEST CHAIN")
                values = arrayOf(def.moves.toString(), def.rows.sumOf { row -> row.count { it != '.' } }.toString(), "×" + game.maxChain)
            }
            is Setup.Lesson -> {
                ui.text(c, "YOU'RE READY!", cx, r.top + 34f * u, 26f * u, Palette.GOOD)
                ui.paragraph(c, "Slide, match, chain, raise: that is the whole game.\nStage Clear is a good place to start. In each stage a line comes up from below; clear every tile above it.",
                    cx, r.top + 70f * u, r.width() - 36f * u, 13f * u, Palette.TEXT)
                return
            }
        }
        val titleColor = if (cleared) Palette.GOOD else Palette.TEXT
        ui.text(c, title, cx, r.top + 34f * u, ui.fitSize(title, 26f * u, r.width() - 32f * u), titleColor)
        if (stars >= 0) {
            for (i in 0 until 3) {
                ui.icon(c, Icon.STAR, cx + (i - 1) * 26f * u, r.top + 65f * u, 22f * u, if (i < stars) Palette.ACCENT else Palette.PANEL_LIGHT)
            }
        } else {
            ui.text(c, bigLabel, cx, r.top + 66f * u, ui.fitSize(bigLabel, 11f * u, r.width() - 32f * u, ui.semi), Palette.TEXT_DIM, face = ui.semi)
        }
        ui.text(c, big, cx, r.top + 96f * u, ui.fitSize(big, 40f * u, r.width() - 40f * u), Palette.TEXT)
        ui.text(c, bestLine, cx, r.top + 128f * u, ui.fitSize(bestLine, 13f * u, r.width() - 32f * u, ui.semi),
            if (highlight) Palette.ACCENT else Palette.TEXT_DIM, face = ui.semi)

        // three small figures along the bottom of the summary
        val colW = (r.width() - 32f * u) / 3f
        for (i in 0 until 3) {
            val x = r.left + 16f * u + colW * (i + 0.5f)
            ui.text(c, labels[i], x, r.top + 154f * u, ui.fitSize(labels[i], 9.5f * u, colW - 6f * u, ui.semi), Palette.TEXT_DIM, face = ui.semi)
            ui.text(c, values[i], x, r.top + 172f * u, ui.fitSize(values[i], 16f * u, colW - 6f * u), Palette.TEXT)
        }
    }

    private companion object {
        const val RESULT_DELAY = 75
        const val POPUP_FRAMES = 64
        const val BANNER_FRAMES = 150
        const val GO_FRAMES = 40
    }
}
