package com.personal.tilesurge.core

enum class EventType {
    /** The opening countdown finished and play has begun. */
    GO,

    /** Two cells were swapped. [GameEvent.row]/[GameEvent.col] is the left cell. */
    SWAP,

    /** A tile touched down. */
    LAND,

    /** A match started flashing. row/col = its top-left tile, a = tiles matched, b = chain step (1 = not a chain). */
    MATCH,

    /** One tile popped. a = its place in the match (1 = first), b = chain step, kind = the tile. */
    POP,

    /** A new row came into play. a = 1 if the player raised it by hand. */
    ROW,

    /** Infinite mode: the speed went up. a = the new level. */
    LEVEL_UP,

    /** A chain of two or more steps has finished. a = its length. */
    CHAIN_END,

    /** Stage Clear: the clear line has come into view. */
    LINE_SHOWN,

    GAME_OVER,
    STAGE_CLEAR,
}

/** Something that happened this frame, for the screen to show and the speaker to play. */
class GameEvent(
    val type: EventType,
    val row: Int = 0,
    val col: Int = 0,
    val a: Int = 0,
    val b: Int = 0,
    val kind: Int = 0,
)
