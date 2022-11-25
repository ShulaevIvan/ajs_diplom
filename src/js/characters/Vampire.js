/* eslint-disable */
import Character from '../Character';

export default class Vampire extends Character {
  constructor(level) {
    super(level);
    this.type = 'vampire',
    this.attack = 25,
    this.defence = 25,
    this.player = 'ai',
    this.stepsRadius = 2,
    this.attackRadius = 2;
  }
}
