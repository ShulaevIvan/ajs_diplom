export default class Character {
  constructor(level, attack, defence, player, stepsRadius, attackRadius) {
    this.level = level; 
    this.attack = attack; 
    this.defence = defence;
    this.health = 100;
    this.player = player;
    this.stepsRadius = stepsRadius; 
    this.attackRadius = attackRadius;

    // TODO: throw error if user use "new Character()"
    if (new.target.name === 'Character') {
      throw new Error('err ....');
    }
  }
}
