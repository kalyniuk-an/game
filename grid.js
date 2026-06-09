import { Tile } from './tile.js';

export class Grid {
  title = [];
  selectedTile = null;
  isGameBlocked = false;

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

    if (this.isGameBlocked) {
      return;
    }

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

    const firstElementPosition = { row: this.selectedTile.row, column: this.selectedTile.column };
    const secondElementPosition = { row, column };

    const event = new CustomEvent('swap', {
      detail: {
        firstElementPosition,
        secondElementPosition,
      },
    });

    this.wrap.dispatchEvent(event);
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

  async swap(firstTilePosition, secondTilePosition, swapStates) {
    this.isGameBlocked = true;

    const firstTile = this.findTileBy(firstTilePosition.row, firstTilePosition.column);
    const secondTile = this.findTileBy(secondTilePosition.row, secondTilePosition.column);
    this.unselectTile();
    const fistTileAnimation = this.moveTileTo(firstTile, secondTilePosition);
    const secondTileAnimation = this.moveTileTo(secondTile, firstTilePosition);
    await Promise.all([fistTileAnimation, secondTileAnimation]);

    if (!swapStates) {
      const fistTileAnimation = this.moveTileTo(firstTile, firstTilePosition);
      const secondTileAnimation = this.moveTileTo(secondTile, secondTilePosition);
      await Promise.all([fistTileAnimation, secondTileAnimation]);
      this.isGameBlocked = false;
      return;
    }

    await this.removeTiles(swapStates[0]);
  }

  async moveTileTo(tile, position) {
    tile.setPositionBy(position.row, position.column);
    await tile.waitForTransitionEnd();
  }

  async removeTiles(grid) {
    const animations = [];

    for (let row = 0; row < grid.length; row++) {
      for (let column = 0; column < grid[0].length; column++) {
        if (grid[row][column] === null) {
          const tile = this.findTileBy(row, column);
          const tileAnimation = tile.remove();
          this.removeTileFromArrayBy(row, column);
          animations.push(tileAnimation);
        }
      }
    }
    await Promise.all(animations);
  }

  removeTileFromArrayBy(row, column) {
    this.tiles = this.title.filter(title => title.row !== row || title.column !== column);
  }
}