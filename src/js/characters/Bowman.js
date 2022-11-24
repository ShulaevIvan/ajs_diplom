/* eslint-disable no-unused-expressions */
/* eslint no-unused-expressions: "error" */
import Character from '../Character';

export default class Bowman extends Character {
  constructor(level) {
    super(level);
    this.type = 'bowman',
    this.attack = 35,
    this.defence = 15,
    this.player = 'player',
    this.stepsRadius = 2,
    this.attackRadius = 2;
  }
}
