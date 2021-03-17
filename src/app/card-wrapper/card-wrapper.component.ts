import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import {
  startGame,
  selectCard,
  getHint,
  gameResult,
  hideCards,
} from '../ngrx-store/actions';
import { FormGroup, FormBuilder } from '@angular/forms';
import { unshuffleddeck } from './deckarray';

@Component({
  selector: 'app-card-wrapper',
  templateUrl: './card-wrapper.component.html',
  styleUrls: ['./card-wrapper.component.sass'],
})
export class CardWrapperComponent implements OnInit {
  settingsForm: FormGroup;
  difficulty$: Observable<string>;
  cards$: Observable<[]>;
  hints$: Observable<number>;
  triesLeft$: Observable<number>;
  appliedSettings$: Observable<boolean>;
  correctCards$: Observable<Array<any>>;
  activeCard$: Observable<number>;
  showCards$: Observable<boolean>;
  hintsArray$: Observable<Array<number>>;
  gameState$: Observable<string>;
  incorrectPair$: Observable<Array<number>>;
  cardTimer: any;
  gameTimer: any;

  constructor(private store: Store<any>, public formBuilder: FormBuilder) {
    this.difficulty$ = store.pipe(
      select((store) => store.gameSettings.difficulty)
    );
    this.cards$ = store.pipe(select((store) => store.gameSettings.cards));
    this.hints$ = store.pipe(select((store) => store.gameSettings.hints));
    this.appliedSettings$ = store.pipe(
      select((store) => store.gameSettings.appliedSettings)
    );
    this.correctCards$ = store.pipe(
      select((store) => store.gameSettings.correctCards)
    );
    this.triesLeft$ = store.pipe(
      select((store) => store.gameSettings.attempts)
    );
    this.activeCard$ = store.pipe(
      select((store) => store.gameSettings.cardPairA)
    );
    this.showCards$ = store.pipe(
      select((store) => store.gameSettings.showCards)
    );
    this.hintsArray$ = store.pipe(
      select((store) => store.gameSettings.hintsArray)
    );
    this.incorrectPair$ = store.pipe(
      select((store) => store.gameSettings.incorrectPair)
    );
    this.gameState$ = store.pipe(select((store) => store.gameSettings.result));

    this.settingsForm = this.formBuilder.group({
      difficulty: ['Normal'],
      number_cards: [12],
      hints: [3],
      attempts: [5],
    });
  }

  consolelog() {
    console.log(
      document.getElementsByClassName('container-fluid')[0].clientHeight
    );
  }

  //Fisher-Yates shuffle.
  shuffle(array: Array<any>) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  difficultyScale = (mode) => {
    if (mode === 'Easy') {
      return 1.25;
    } else if (mode === 'Normal') {
      return 1;
    } else if (mode === 'Hard') {
      return 0.75;
    }
  };

  revealTime(cards, mode) {
    return cards * 0.5 * this.difficultyScale(mode) + 2;
  }

  gameTime(cards, mode) {
    return (
      cards * 2 * this.difficultyScale(mode) +
      this.revealTime(cards, mode) +
      7.5
    );
  }

  applySettings() {
    clearTimeout(this.cardTimer);
    clearTimeout(this.gameTimer);

    let shuffled = this.shuffle(unshuffleddeck);

    let deck = [];

    for (let i = 0; i < this.settingsForm.value.number_cards / 2; i++) {
      deck.push(shuffled[i]);
      deck.push(shuffled[i]);
    }

    let shuffleddeck = this.shuffle(deck);
    console.log(shuffleddeck);

    this.store.dispatch(
      startGame({
        difficulty: this.settingsForm.value.difficulty,
        cards: shuffleddeck,
        hints: this.settingsForm.value.hints,
        attempts: this.settingsForm.value.attempts,
      })
    );

    this.cardTimer = setTimeout(
      () => this.store.dispatch(hideCards()),
      this.revealTime(
        this.settingsForm.value.number_cards,
        this.settingsForm.value.difficulty
      ) * 1000
    );
    this.gameTimer = setTimeout(
      () => this.store.dispatch(gameResult()),
      this.gameTime(
        this.settingsForm.value.number_cards,
        this.settingsForm.value.difficulty
      ) * 1000
    );

    console.log(
      this.revealTime(
        this.settingsForm.value.number_cards,
        this.settingsForm.value.difficulty
      ),
      this.gameTime(
        this.settingsForm.value.number_cards,
        this.settingsForm.value.difficulty
      )
    );

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  cardImage(card: string) {
    return 'url(../../assets/' + card + '.png)';
  }

  hiddenCard() {
    return 'url(../../assets/hiddencard.jpg)';
  }

  selectCard(index: number) {
    this.store.dispatch(
      selectCard({
        cardPairB: index,
      })
    );
  }

  getHint() {
    this.store.dispatch(getHint());
  }

  ngOnInit(): void {}
}
