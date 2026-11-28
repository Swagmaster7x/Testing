/**
 * The Kibitz practice card: an original card in the format of the yearly American cards, written
 * for this app. Every hand on it is our own; it is not a copy of any National Mah Jongg League
 * card, whose hands change every year and are sold by the League. Players who own a real card can
 * type it in (Tools, "Your American card").
 */
export const PRACTICE_CARD = `title: Kibitz practice card 2026
# An original card for practice. Suits are a, b and c: three different suits.
# "shift": the numbers may move up or down together. X: exposures allowed. C: concealed.

## The year
2026a 2026b 2026c FF = 50 C
FFF 22a 000 222b 666c = 30 X
NNNN 2026a SSSS 66b = 30 X

## Evens
FFF 2222a 44b 666c 88a = 25 X
2468a 2468b 444c 66c F = 40 C
4444a 4444b DDDD 88c = 30 X

## Odds
111a 3333a 55b 7777a 9a = 30 X
13579a 13579b FFFF = 40 C
FF 555a 555b 555c 999a = 30 X

## Like numbers
1111a 1111b 111c FFF = 25 X shift
FF 11a 111b 1111c DDD = 30 X shift

## Runs
111a 222a 3333a 4444a = 25 X shift
11a 222b 3333c 444a FF = 30 X shift
FFF 12345a 6666b 77b = 35 X shift

## Threes, sixes and nines
333a 666a 9999a 33b 66b = 30 X
369a 369b 3333c 666c F = 35 X

## Quints
11111a 2222b 33333c = 40 X shift
FFFFF NNNN 55555a = 45 X

## Winds and dragons
NNNN SSSS 777a 777b = 30 X
F NEWS DDD DDDb DDDc = 35 X
EEEE WWWW 00 RRRR = 30 X

## Pairs
FF 11a 22a 33a 44b 55b 66c = 50 C shift
NN EE WW SS 2026a 77b = 50 C
FF 2468a 2468b 88c 44c = 50 C
`;
