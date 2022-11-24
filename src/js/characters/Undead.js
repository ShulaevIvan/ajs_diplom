import Character from '../Character';

export default class Undead extends Character {
  constructor(level) {
    super(level);
    this.type ='undead',
    this.attack = 50,
    this.defence = 25,
    this.player ='ai',
    this.stepsRadius = 4,
    this.attackRadius = 1
  }
}
