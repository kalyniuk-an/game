import { deepClone } from './utils.js';

export class Game {
  constructor(rowsCount, columnsCount, elementsCount) {
    this.rowsCount = rowsCount;
    this.columnsCount = columnsCount;
    this.elementsCount = elementsCount;

    this.init();
  }

  init() {
    this.score = 0;
    this.matrix = new Array(this.rowsCount).fill().map(() => new Array(this.columnsCount).fill(null));

    for (let row = 0; row < this.rowsCount; row++) {
      for (let column = 0; column < this.columnsCount; column++) {
        do {
          this.matrix[row][column] = this.getRandomValue();
        } while (this.isRow(row, column));
      }
    }
  }

  getRandomValue() {
    return Math.floor(Math.random() * this.elementsCount) + 1;
  }

  isRow(row, column) {
    return this.isVerticalRow(row, column) || this.isHorizontalRow(row, column);
  }

  isVerticalRow(row, column) {
    const absValue = Math.abs(this.matrix[row][column]);
    let elementsInRow = 1;

    let currentRow = row - 1;
    while (currentRow >= 0 && Math.abs(this.matrix[currentRow][column]) === absValue) {
      elementsInRow++;
      currentRow--;
    }

    currentRow = row + 1;
    while (currentRow <= this.rowsCount - 1 && Math.abs(this.matrix[currentRow][column]) === absValue) {
      elementsInRow++;
      currentRow++;
    }
    return elementsInRow >= 3;
  }

  isHorizontalRow(row, column) {
    const absValue = Math.abs(this.matrix[row][column]);
    let elementsInRow = 1;

    let currentColumn = column - 1;
    while (currentColumn >= 0 && Math.abs(this.matrix[row][currentColumn]) === absValue) {
      elementsInRow++;
      currentColumn--;
    }

    currentColumn = column + 1;
    while (currentColumn <= this.columnsCount - 1 && Math.abs(this.matrix[row][currentColumn]) === absValue) {
      elementsInRow++;
      currentColumn++;
    }
    return elementsInRow >= 3;
  }

  swap(firstElement, secondElement) {
    this.swap2Elements(firstElement, secondElement);
    const isRowWithFirstElement = this.isRow(firstElement.row, firstElement.column);
    const isRowWithSecondElement = this.isRow(secondElement.row, secondElement.column);

    if (!isRowWithFirstElement && !isRowWithSecondElement) {
      return null;
    }

    const swapState = [];
    let removeElements = 0;

    do {
      removeElements = this.removeAllRows();
      // console.log(this.matrix);
      if (removeElements > 0) {
        this.score += removeElements;
        swapState.push(deepClone(this.matrix));
        this.dropElements();
        // console.log(swapState[0]);
        // console.log(this.matrix);
        this.fillBlanks();
        swapState.push(deepClone(this.matrix));
        // console.log(swapState);
      }
    } while (removeElements > 0)
    
    return swapState;
  }

  swap2Elements(firstElement, secondElement) {
    const temp = this.matrix[firstElement.row][firstElement.column];
    this.matrix[firstElement.row][firstElement.column] = this.matrix[secondElement.row][secondElement.column];
    this.matrix[secondElement.row][secondElement.column] = temp;
  }

  removeAllRows() {
    
    for (let row = 0; row < this.rowsCount; row++) {
      for (let column = 0; column < this.columnsCount; column++) {
        this.markElementsToRemoveFor(row, column);
      }
    }
    this.removeMarkedElements();
    return this.calculateRemovedElements();
  }

  markElementsToRemoveFor(row, column) {
    if (this.isRow(row, column)) {
      this.matrix[row][column] = -1*Math.abs(this.matrix[row][column]);
    }
  }

  removeMarkedElements() {
    for (let row = 0; row < this.rowsCount; row++) {
      for (let column = 0; column < this.columnsCount; column++) {
        if (this.matrix[row][column] < 0) {
          this.matrix[row][column] = null;
        }
      }
    }
  }

  calculateRemovedElements() {
    let removedElements = 0;
    for (let row = 0; row < this.rowsCount; row++) {
      for (let column = 0; column < this.columnsCount; column++) {
        if (this.matrix[row][column] === null) {
          removedElements++;
        }
      }
    } 
    return removedElements;
  }

  dropElements() {
    for (let column = 0; column < this.columnsCount; column++) {
      this.dropElementsInColumn(column);
    }
  }

  dropElementsInColumn(column) {
    let emptyIndex;

    for (let row = this.rowsCount - 1; row >= 0; row--) {
      if (this.matrix[row][column] === null) {
        emptyIndex = row;
        break;
      }
    }

    if (emptyIndex === undefined) {
      return;
    }

    for (let row = emptyIndex - 1; row >= 0; row--) {
      if (this.matrix[row][column] !== null) {
        this.matrix[emptyIndex][column] = this.matrix[row][column];
        this.matrix[row][column] = null;
        emptyIndex--;
      }
    }
  }

  fillBlanks() {
    for (let row = 0; row < this.rowsCount; row++) {
      for (let column = 0; column < this.columnsCount; column++) {
        if (this.matrix[row][column] === null) {
          this.matrix[row][column] = this.getRandomValue();
        }
      }
    }
  }
}