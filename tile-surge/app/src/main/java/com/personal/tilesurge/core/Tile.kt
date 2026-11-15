package com.personal.tilesurge.core

/** What a tile is doing right now. */
enum class TileState {
    /** Sitting still. */
    NORMAL,

    /** Sliding sideways into this cell. An empty cell can be swapping too, while a tile slides out of it. */
    SWAPPING,

    /** Nothing underneath: hanging for a moment before it drops. */
    HOVERING,

    /** Dropping one cell a frame. */
    FALLING,

    /** Just touched down. Behaves like [NORMAL]; the state only drives the bounce. */
    LANDING,

    /** Part of a match: flashing, fixed in place. */
    MATCHED,

    /** Flash over, waiting for its turn to pop. */
    POPPING,

    /** Popped (no longer drawn), holding its cell until the rest of its group has popped. */
    POPPED,
}

/**
 * One cell's contents. Every cell always holds a Tile object; [kind] 0 means the cell is empty.
 * Tiles move between cells by swapping the objects, so [id] follows a tile wherever it goes.
 */
class Tile {
    /** Unique per tile while it is on the board; 0 for an empty cell. */
    var id = 0

    /** 0 = empty, 1..6 = the tile's colour and symbol, [BLOCK] = a blocker. */
    var kind = 0

    /** A surge tile: when it is part of a match, its whole row goes with it. */
    var power = false

    /** Frozen in place: it cannot be slid until a match beside it (or including it) sets it free. */
    var frozen = false
    var state = TileState.NORMAL

    /** Frames left in the current state, for the states that end on their own. */
    var timer = 0

    /** Set on tiles that are falling because a match underneath them cleared. If one matches when it lands, that is a chain. */
    var chaining = false

    /** Position in its match, 1 = first to pop. */
    var comboIndex = 0

    /** How many tiles were matched together with this one. */
    var comboSize = 0

    /** The chain step this tile's match belonged to (1 = not a chain). */
    var chainIndex = 1

    /** +1 if the tile is sliding in from the left, -1 from the right, 0 otherwise. */
    var swapDir = 0

    val isEmpty: Boolean get() = kind == 0

    /** A blocker: it never matches and cannot be slid. A match beside it turns it into ordinary tiles. */
    val isBlock: Boolean get() = kind == BLOCK

    /** At rest and of a kind that can line up with others. */
    val isMatchable: Boolean get() = isResting && kind != BLOCK

    /** Flashing or popping: nothing can move it, and it holds up whatever sits on it. */
    val isClearing: Boolean
        get() = state == TileState.MATCHED || state == TileState.POPPING || state == TileState.POPPED

    /** A real tile at rest: it can be matched and swapped. */
    val isResting: Boolean
        get() = kind != 0 && (state == TileState.NORMAL || state == TileState.LANDING)

    fun clear() {
        id = 0
        kind = 0
        state = TileState.NORMAL
        timer = 0
        chaining = false
        comboIndex = 0
        comboSize = 0
        chainIndex = 1
        swapDir = 0
        power = false
        frozen = false
    }

    companion object {
        const val BLOCK = 7

        /** The kind a character on a written-out board stands for (see Game.setBoard); 0 for a gap or anything else. */
        fun kindOf(ch: Char): Int = when (ch) {
            in '1'..'6' -> ch - '0'
            'B' -> BLOCK
            in 'a'..'f' -> ch - 'a' + 1
            in 'p'..'u' -> ch - 'p' + 1
            else -> 0
        }
    }
}
