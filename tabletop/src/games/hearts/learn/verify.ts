/** The checks behind the Hearts lesson linter: positions hold all 52 cards and the player to move can play. */
import { basicVerifier } from '../../classic/verify';
import type { HeartsAction, HeartsState } from '../rules';
import { checkConservation, hearts } from '../rules';

export const heartsVerifier = basicVerifier<HeartsState, HeartsAction>({ def: hearts, conserve: checkConservation });
