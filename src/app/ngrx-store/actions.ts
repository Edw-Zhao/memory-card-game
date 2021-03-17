import { createAction, props } from '@ngrx/store';

export const startGame = createAction(
  '[Game Settings] Apply Settings and Start Game',
  props<{
    difficulty: string;
    cards: Array<any>;
    hints: number;
    attempts: number;
  }>()
);

export const hideCards = createAction('[Game Action] Hide Cards');


export const selectCard = createAction(
  '[Game Action] Select Card',
  props<{ cardPairB: number }>()
);

export const getHint = createAction('[Game Action] Get Hint');

export const gameResult = createAction('[Game Action] Times Up');

//props<{ text: string }>()
