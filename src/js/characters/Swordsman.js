import Character from '../Character';

class Swordsman extends Character {
    constructor(level, type='swordsman') {
        super(level)
        this.type = type
        this.attack = 40;
        this.defence = 10;
    }
}