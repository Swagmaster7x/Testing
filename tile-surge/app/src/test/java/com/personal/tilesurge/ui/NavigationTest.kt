package com.personal.tilesurge.ui

import com.personal.tilesurge.core.Difficulty
import com.personal.tilesurge.core.Stages
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode

/** Getting around the menus by tapping, and what the game remembers. */
@RunWith(RobolectricTestRunner::class)
@GraphicsMode(GraphicsMode.Mode.NATIVE)
@Config(sdk = [35], qualifiers = "w360dp-h780dp-xhdpi")
class NavigationTest {

    private fun title(): GameView = Shots.view(720, 1560) { TitleScene(it) }

    @Test
    fun `the title leads to both modes and to how to play, and Back returns`() {
        val v = title()
        var t = v.scene as TitleScene
        assertFalse("Back on the title is left to the system", v.back())

        Shots.tap(v, t.stageButton)
        assertTrue(v.scene is StageSelectScene)
        assertTrue(v.back())
        assertTrue(v.scene is TitleScene)

        t = v.scene as TitleScene
        Shots.tap(v, t.infiniteButton)
        assertTrue(v.scene is InfiniteSetupScene)
        Shots.tap(v, (v.scene as InfiniteSetupScene).backButton)
        assertTrue(v.scene is TitleScene)

        t = v.scene as TitleScene
        Shots.tap(v, t.puzzleButton)
        assertTrue(v.scene is StageSelectScene)
        assertTrue(v.back())

        t = v.scene as TitleScene
        Shots.tap(v, t.timedButton)
        assertTrue(v.scene is InfiniteSetupScene)
        Shots.tap(v, (v.scene as InfiniteSetupScene).startButton)
        assertTrue((v.scene as PlayScene).setup is Setup.Timed)
        v.show(TitleScene(v.app))

        t = v.scene as TitleScene
        Shots.tap(v, t.dailyButton)
        assertEquals(Days.today(), ((v.scene as PlayScene).setup as Setup.Daily).day)
        v.show(TitleScene(v.app))

        // HOW TO PLAY is the hands-on lessons
        t = v.scene as TitleScene
        Shots.tap(v, t.howButton)
        assertEquals(1, ((v.scene as PlayScene).setup as Setup.Lesson).number)
    }

    @Test
    fun `a press that slides off a button does not count`() {
        val v = title()
        val t = v.scene as TitleScene
        val r = t.stageButton.rect
        Shots.touch(v, android.view.MotionEvent.ACTION_DOWN, r.centerX(), r.centerY())
        assertTrue(t.stageButton.pressed)
        Shots.touch(v, android.view.MotionEvent.ACTION_MOVE, r.centerX(), r.bottom + 200f)
        assertFalse(t.stageButton.pressed)
        Shots.touch(v, android.view.MotionEvent.ACTION_UP, r.centerX(), r.bottom + 200f)
        assertTrue(v.scene is TitleScene)
    }

    @Test
    fun `the sound and buzz switches are remembered`() {
        val v = title()
        val t = v.scene as TitleScene
        assertTrue(v.app.prefs.sound)
        assertTrue(v.app.prefs.buzz)
        Shots.tap(v, t.soundButton)
        Shots.tap(v, t.buzzButton)
        assertFalse(v.app.prefs.sound)
        assertFalse(v.app.prefs.buzz)
        assertEquals(Icon.SOUND_OFF, t.soundButton.icon)
        assertEquals(Icon.BUZZ_OFF, t.buzzButton.icon)
        // a new view (the app started again) reads the same settings
        val again = title()
        assertFalse(again.app.prefs.sound)
        assertEquals(Icon.SOUND_OFF, (again.scene as TitleScene).soundButton.icon)
        Shots.tap(again, (again.scene as TitleScene).soundButton)
        assertTrue(again.app.prefs.sound)
    }

    @Test
    fun `Infinite setup starts the game that was chosen and remembers the choice`() {
        val v = title()
        v.show(InfiniteSetupScene(v.app))
        var s = v.scene as InfiniteSetupScene
        Shots.tap(v, s.choices[Difficulty.HARD.ordinal])
        assertEquals(Difficulty.HARD, v.app.prefs.difficulty)
        assertEquals(Difficulty.HARD.startLevel, v.app.prefs.startLevel(Difficulty.HARD))
        repeat(3) { Shots.tap(v, s.faster) }
        Shots.tap(v, s.slower)
        assertEquals(Difficulty.HARD.startLevel + 2, v.app.prefs.startLevel(Difficulty.HARD))
        Shots.save(v, "03-infinite-setup-hard")

        Shots.tap(v, s.startButton)
        val play = v.scene as PlayScene
        val setup = play.setup as Setup.Infinite
        assertEquals(Difficulty.HARD, setup.difficulty)
        assertEquals(Difficulty.HARD.startLevel + 2, setup.startLevel)
        assertEquals(6, play.game.kinds)
        assertEquals(Difficulty.HARD.startLevel + 2, play.game.level)

        // back in the setup screen later, the same choices are showing
        v.show(InfiniteSetupScene(v.app))
        s = v.scene as InfiniteSetupScene
        assertEquals(ButtonStyle.SELECTED, s.choices[Difficulty.HARD.ordinal].style)
        assertEquals(ButtonStyle.PLAIN, s.choices[Difficulty.EASY.ordinal].style)
        // each difficulty keeps its own starting speed
        Shots.tap(v, s.choices[Difficulty.EASY.ordinal])
        assertEquals(1, v.app.prefs.startLevel(Difficulty.EASY))
        assertFalse(s.slower.enabled)
    }

    @Test
    fun `the starting speed stops at its limits`() {
        val v = title()
        v.show(InfiniteSetupScene(v.app))
        val s = v.scene as InfiniteSetupScene
        repeat(Prefs.MAX_START_LEVEL + 5) { Shots.tap(v, s.faster) }
        assertEquals(Prefs.MAX_START_LEVEL, v.app.prefs.startLevel(v.app.prefs.difficulty))
        assertFalse(s.faster.enabled)
        repeat(Prefs.MAX_START_LEVEL + 5) { Shots.tap(v, s.slower) }
        assertEquals(1, v.app.prefs.startLevel(v.app.prefs.difficulty))
    }

    @Test
    fun `only stages that are open can be started`() {
        val v = title()
        v.show(StageSelectScene(v.app))
        var s = v.scene as StageSelectScene
        // nothing cleared yet: stage 1 is open, stage 2 is locked
        assertTrue(s.stageButtons[0].enabled)
        assertFalse(s.stageButtons[1].enabled)
        Shots.tap(v, s.stageButtons[1])
        assertTrue(v.scene is StageSelectScene)
        Shots.tap(v, s.stageButtons[0])
        assertEquals(1, ((v.scene as PlayScene).setup as Setup.Stage).number)

        v.app.prefs.recordStage(1, 1800)
        v.app.prefs.recordStage(2, 2400)
        v.show(StageSelectScene(v.app))
        s = v.scene as StageSelectScene
        assertEquals(3, s.stageButtons[0].stars)
        assertEquals("next", s.stageButtons[2].note)
        assertFalse(s.stageButtons[3].enabled)
        Shots.tap(v, s.stageButtons[2])
        assertEquals(3, ((v.scene as PlayScene).setup as Setup.Stage).number)
    }

    @Test
    fun `stage records keep the best time and never lock a stage again`() {
        val v = title()
        val p = v.app.prefs
        assertTrue(p.recordStage(1, 3000))
        assertFalse(p.recordStage(1, 3500))
        assertEquals(3000, p.bestStageFrames(1))
        assertTrue(p.recordStage(1, 2500))
        assertEquals(2500, p.bestStageFrames(1))
        assertTrue(p.recordStage(2, 100))
        assertTrue(p.recordStage(1, 2000))
        assertEquals(2, p.stagesCleared)
        for (n in 3..Stages.COUNT) p.recordStage(n, 1000)
        assertEquals(Stages.COUNT, p.stagesCleared)
        v.show(StageSelectScene(v.app))
        assertTrue((v.scene as StageSelectScene).stageButtons.all { it.enabled })
        v.show(TitleScene(v.app))
        assertEquals("all 30 cleared", (v.scene as TitleScene).stageButton.note)
    }

    @Test
    fun `how to play can be read through to the end and back`() {
        val v = title()
        v.show(HowToScene(v.app))
        val s = v.scene as HowToScene
        assertFalse(s.prevButton.enabled)
        repeat(4) {
            v.step(400) // let each little demo play right through at least once
            Shots.tap(v, s.nextButton)
            assertTrue(v.scene is HowToScene)
        }
        assertEquals("GOT IT", s.nextButton.label)
        Shots.tap(v, s.prevButton)
        assertEquals("NEXT", s.nextButton.label)
        assertTrue(v.back())
        assertTrue(v.back())
        assertTrue(v.back())
        assertTrue(v.scene is HowToScene)
        assertTrue(v.back())
        assertTrue(v.scene is TitleScene)

        v.show(HowToScene(v.app))
        val again = v.scene as HowToScene
        repeat(5) { Shots.tap(v, again.nextButton) }
        assertTrue(v.scene is TitleScene)
    }
}
