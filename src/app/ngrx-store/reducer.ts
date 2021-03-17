import { createReducer, on, Action } from '@ngrx/store';
import {
  selectCard,
  startGame,
  getHint,
  gameResult,
  hideCards,
} from './actions';

export interface GameSettings {
  difficulty: string;
  cards: Array<any>;
  hints: number;
  attempts: number;
  appliedSettings: boolean;
  showCards: any;
  correctCards: Array<any>;
  cardPairA: number;
  hintsArray: Array<any>;
  incorrectPair: Array<any>;
  result: string;
}

export const initialGameSettings: GameSettings = {
  difficulty: '',
  cards: [0],
  hints: 0,
  attempts: 0,
  appliedSettings: false,
  showCards: false,
  correctCards: [],
  cardPairA: -1,
  hintsArray: [],
  incorrectPair: [],
  result: '',
};

export const _gameSettingsReducer = createReducer(
  initialGameSettings,

  on(startGame, (state, { difficulty, cards, hints, attempts }) => ({
    ...state,
    difficulty: difficulty,
    cards: cards,
    hints: hints,
    attempts: attempts,
    appliedSettings: true,
    showCards: true,
    correctCards: [],
    cardPairA: -1,
    hintsArray: [],
    incorrectPair: [],
    result: 'in progress',
  })),

  on(hideCards, (state) => ({
    ...state,
    showCards: false,
  })),

  on(selectCard, (state, { cardPairB }) => {
    if (state.cardPairA === cardPairB) {
      return { ...state, cardPairA: -1 };
    }

    if (state.cardPairA === -1) {
      return { ...state, cardPairA: cardPairB };
    } else if (
      state.cards[state.cardPairA] === state.cards[cardPairB] &&
      state.correctCards.length === state.cards.length - 2
    ) {
      return {
        ...state,
        result: 'win',
        correctCards: [...state.correctCards, state.cardPairA, cardPairB],
      };
    } else if (state.cards[state.cardPairA] === state.cards[cardPairB]) {
      return {
        ...state,
        cardPairA: -1,
        correctCards: [...state.correctCards, state.cardPairA, cardPairB],
        incorrectPair: [],
      };
    } else if (
      state.cards[state.cardPairA] !== state.cards[cardPairB] &&
      state.attempts === 1
    ) {
      return {
        ...state,
        cardPairA: -1,
        attempts: state.attempts - 1,
        incorrectPair: [],
        result: 'lose',
      };
    } else {
      return {
        ...state,
        cardPairA: -1,
        attempts: state.attempts - 1,
        incorrectPair: [state.cardPairA, cardPairB],
      };
    }
  }),

  on(getHint, (state) => {
    if (state.hints > 0 && state.cards.length > state.hintsArray.length) {
      for (let i = 0; i < state.cards.length; i++) {
        if (
          !state.correctCards.includes(i) &&
          !state.hintsArray.includes(i) &&
          !state.incorrectPair.includes(i)
        ) {
          return {
            ...state,
            hints: state.hints - 1,
            hintsArray: [
              ...state.hintsArray,
              i,
              //state.cards.lastIndexOf(state.cards[i]),
            ],
          };
        }
      }
    } else {
      return { ...state };
    }
  }),
  on(gameResult, (state) => {
    if (state.correctCards.length < state.cards.length) {
      return { ...state, result: 'lose' };
    } else {
      return { ...state };
    }
  })
);

export function gameSettingsReducer(state: GameSettings, action: Action) {
  return _gameSettingsReducer(state, action);
}
