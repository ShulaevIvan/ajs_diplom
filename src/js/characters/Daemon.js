/* eslint-disable */
import Character from '../Character';

export default class Daemon extends Character {
  constructor(level) {
    super(level);
    this.type = 'daemon',
    this.attack = 40,
    this.defence = 10,
    this.player = 'ai',
    this.stepsRadius = 1,
    this.attackRadius = 4;
  }
}
