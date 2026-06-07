import { Tile } from './tile.js';

export class Grid {
  title = [];
  selectedTile = null;

  constructor(wrap, matrix) {
    this.wrap = wrap;
    this.createTitles(matrix);
  }

  createTitles(matrix) {
    for (let row = 0; row < matrix.length; row++) {
      for (let column = 0; column < matrix[row].length; column++) {
        this.createTitle(row, column, matrix[row][column]);
      }
    }
  }

  createTitle(row, column, value) {
    const title = new Tile(this.wrap, row, column, value, this.handleTileClick);
    this.title.push(title);
  }

  handleTileClick = (row, column) => {
    // console.log(row, column);
    if (!this.selectedTile) {
      this.selectTile(row, column);
      return;
    }

    const isSelectedNeighbors = this.isSelectedTileNeighborsWith(row, column);
    if (!isSelectedNeighbors) {
      // console.log("swap");
      this.unselectTile();
      this.selectTile(row, column);
    }
  }

  selectTile(row, column) {
    this.selectedTile = this.findTileBy(row, column);
    this.selectedTile.select();
  }

  unselectTile() {
    this.selectedTile.unselect();
    this.selectedTile = null;
  }

  findTileBy(row, column) {
    return this.title.find(title => title.row === row && title.column === column);
  }

  isSelectedTileNeighborsWith(row, column) {
    const isColomnNeighbors = this.selectedTile.column === column && Math.abs(this.selectedTile.row - row) === 1;
    const isRowNeighbors = this.selectedTile.row === row && Math.abs(this.selectedTile.column - column) === 1;
    return isColomnNeighbors || isRowNeighbors;
  }
}