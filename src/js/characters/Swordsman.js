/* eslint-disable no-unused-expressions */
/* eslint no-unused-expressions: "error" */
import Character from '../Character';

export default class Swordsman extends Character {
  constructor(level) {
    super(level);
    this.type = 'swordsman',
    this.attack = 50,
    this.defence = 25,
    this.player = 'player',
    this.stepsRadius = 4,
    this.attackRadius = 1;
  }
}
