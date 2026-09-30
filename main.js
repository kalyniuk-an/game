import { MatchThree } from './match-three.js';
const s = document.querySelector(".start");
const c = document.querySelector(".c");
console.log(s);
function startGame() {
  // const c = Number(form.elements.c.value);
  new MatchThree(10, 10, 8);
}

startGame();
