import Character from '../Character';

export default class Vampire extends Character {
  constructor(level) {
    super(level);
    this.type ='vampire',
    this.attack = 35,
    this.defence = 15,
    this.player ='ai',
    this.stepsRadius = 2,
    this.attackRadius = 2
  }
}
