import { Game } from './game.js';

export class MatchThree {
  wrap = document.querySelector('.wrap');

  constructor(rowsCount, columnsCount, titlesCount) {
    this.game = new Game(rowsCount, columnsCount, titlesCount);
    console.log(this.game.matrix);
  }
}