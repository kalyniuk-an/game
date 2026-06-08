import { Game } from './game.js';
import { Grid } from './grid.js';

export class MatchThree {
  wrap = document.querySelector('.wrap');

  constructor(rowsCount, columnsCount, titlesCount) {
    this.game = new Game(rowsCount, columnsCount, titlesCount);
    // console.log(this.game.matrix);
    this.grid = new Grid(this.wrap, this.game.matrix);
    this.wrap.addEventListener('swap', evenrt => {
      // console.log(evenrt.detail);
      const firstElementPosition = evenrt.detail.firstElementPosition;
      const secondElementPosition = evenrt.detail.secondElementPosition;

      this.swap(firstElementPosition, secondElementPosition);
    });
  }

  async swap(firstElementPosition, secondElementPosition) {
    const swapStates = this.game.swap(firstElementPosition, secondElementPosition);
    // console.log(swapStates);
    await this.grid.swap(firstElementPosition, secondElementPosition, swapStates);
  }

}