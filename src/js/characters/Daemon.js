import Character from '../Character';

export default class Daemon extends Character {
  constructor(level) {
    super(level);
    this.type ='daemon',
    this.attack = 100,
    this.defence = 40,
    this.player ='ai',
    this.stepsRadius = 1,
    this.attackRadius = 4
  }
}
