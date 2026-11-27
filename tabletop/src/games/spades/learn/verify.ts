/** The checks behind the Spades lesson linter: positions hold all 52 cards and the player to move can act. */
import { basicVerifier } from '../../classic/verify';
import type { SpadesAction, SpadesState } from '../rules';
import { checkConservation, spades } from '../rules';

export const spadesVerifier = basicVerifier<SpadesState, SpadesAction>({ def: spades, conserve: checkConservation });
