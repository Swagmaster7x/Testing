package com.personal.tilesurge.core

/**
 * The puzzles: clear every tile in the moves allowed. The board does not rise.
 *
 * They were made by the PuzzleMaker tool in the tests, which tries random boards and keeps those
 * whose shortest answer is exactly the number of moves given. Each comes with one answer (cells as
 * `row * 6 + col`, swapped with the cell to the right), which the tests play through in the real game.
 */
object Puzzles {
    val all: List<PuzzleDef> = listOf(
        PuzzleDef(1, 1, listOf("...2..", "...1..", "..12..", "..12.."), listOf(14)),
        PuzzleDef(2, 1, listOf("...1..", "..22..", ".211.."), listOf(15)),
        PuzzleDef(3, 1, listOf("..22..", "1.112."), listOf(0)),
        PuzzleDef(4, 2, listOf("..1...", "..12..", "..21..", ".1211."), listOf(14, 3)),
        PuzzleDef(5, 2, listOf("...1..", "...1..", "...2..", ".121..", ".121.."), listOf(2, 8)),
        PuzzleDef(6, 2, listOf("..1...", "..1...", "..2.22", "..2122"), listOf(2, 8)),
        PuzzleDef(7, 2, listOf("...2..", "..11..", "..11..", "..22..", "..11.."), listOf(7, 8)),
        PuzzleDef(8, 2, listOf("..2...", "..3...", "..122.", "3.131."), listOf(2, 1)),
        PuzzleDef(9, 2, listOf("..22..", "..13..", "..13..", "..213."), listOf(2, 3)),
        PuzzleDef(10, 2, listOf("....3.", "....1.", "....3.", "..213.", "..212."), listOf(21, 2)),
        PuzzleDef(11, 2, listOf(".3....", ".1.3..", ".213..", ".122.."), listOf(0, 2)),
        PuzzleDef(12, 3, listOf("....2.", "...21.", "...13.", ".3.132"), listOf(3, 9, 2)),
        PuzzleDef(13, 3, listOf(".2....", ".3....", ".321..", "1123.."), listOf(19, 8, 1)),
        PuzzleDef(14, 3, listOf("3.1...", "2.2.1.", "3.321."), listOf(9, 12, 0)),
        PuzzleDef(15, 3, listOf(".1133.", "22132."), listOf(3, 2, 4)),
        PuzzleDef(16, 3, listOf(".11...", ".213..", ".3223."), listOf(0, 0, 1)),
        PuzzleDef(17, 3, listOf("....1.", "...22.", "11.31.", "33112."), listOf(8, 9, 2)),
        PuzzleDef(18, 3, listOf("....2.", "....23", "....12", "..2.21", "..2331"), listOf(1, 21, 16)),
        PuzzleDef(19, 3, listOf(".1....", ".23...", "112...", "132...", "311..."), listOf(0, 19, 12)),
        PuzzleDef(20, 3, listOf(".....3", "....33", "...312", "...212", "...331"), listOf(4, 4, 4)),
        PuzzleDef(21, 3, listOf("...212", "...123", "...312", "...232"), listOf(15, 9, 16)),
        PuzzleDef(22, 3, listOf(".4....", ".2.2..", "4411..", "23133."), listOf(19, 1, 2)),
        PuzzleDef(23, 3, listOf(".4....", ".2.3..", ".4.4..", ".322..", ".1311."), listOf(20, 13, 1)),
        PuzzleDef(24, 3, listOf(".4....", ".1.3..", ".2.4..", ".223..", "4113.."), listOf(14, 2, 1)),
        PuzzleDef(25, 4, listOf("..1...", "..3...", "..121.", "..213.", "..1321"), listOf(3, 8, 3, 2)),
        PuzzleDef(26, 4, listOf("21....", "33....", "11....", "311...", "221..."), listOf(1, 0, 12, 0)),
        PuzzleDef(27, 4, listOf(".3....", ".3.2..", ".133..", ".123..", ".321.."), listOf(0, 14, 1, 2)),
        PuzzleDef(28, 4, listOf(".4....", ".42...", ".11.1.", ".2324.", "22323."), listOf(15, 2, 1, 3)),
        PuzzleDef(29, 4, listOf("..4...", "..131.", "..433.", "..2212", "..1411"), listOf(10, 2, 14, 2)),
        PuzzleDef(30, 4, listOf("...4..", "24.1..", "14.2..", "1213..", "3131.."), listOf(0, 14, 3, 1)),
        // The second set, with ice and surge tiles: a..f is a frozen tile of kind 1..6, p..u a surge tile.
        PuzzleDef(31, 1, listOf("...1..", "...b..", ".2.211"), listOf(2)),
        PuzzleDef(32, 1, listOf(".12...", ".a122."), listOf(6)),
        PuzzleDef(33, 1, listOf("...2..", "..21..", "..12..", ".21q.."), listOf(14)),
        PuzzleDef(34, 1, listOf(".2....", ".1....", ".1....", ".21q12"), listOf(1)),
        PuzzleDef(35, 2, listOf("...2..", "..21..", "..12b.", "..21b."), listOf(8, 4)),
        PuzzleDef(36, 2, listOf("..2...", "..2b..", ".b11..", ".122.."), listOf(20, 21)),
        PuzzleDef(37, 2, listOf("..1...", "..a...", "1.b1..", "2.211."), listOf(1, 0)),
        PuzzleDef(38, 2, listOf("..2...", ".a2...", ".113..", ".23c.."), listOf(9, 1)),
        PuzzleDef(39, 2, listOf("..32..", "..b1..", "..12..", ".c31.."), listOf(8, 2)),
        PuzzleDef(40, 3, listOf("...1..", "...a..", ".3.2..", ".c.3..", ".221.."), listOf(13, 3, 2)),
        PuzzleDef(41, 3, listOf("..1...", "..a...", "..b3..", "..12..", "..23.3"), listOf(8, 1, 3)),
        PuzzleDef(42, 3, listOf(".1....", ".33...", ".3bb..", ".112.."), listOf(3, 18, 0)),
        PuzzleDef(43, 3, listOf("...2..", ".2.1..", ".2.3..", ".c31..", ".23p.."), listOf(0, 14, 1)),
        PuzzleDef(44, 3, listOf(".r23..", "3221..", "321a.."), listOf(12, 0, 9)),
        PuzzleDef(45, 3, listOf("...3..", "...2..", "...1..", "..c123", "..2r12"), listOf(2, 1, 3)),
    )

    val COUNT: Int get() = all.size

    fun get(number: Int): PuzzleDef = all[(number - 1).coerceIn(0, all.size - 1)]
}
