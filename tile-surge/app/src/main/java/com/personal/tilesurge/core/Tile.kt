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

    /** 0 = empty, 1..6 = the tile's colour and symbol. */
    var kind = 0
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
    }
}
