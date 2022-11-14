import Character from '../Character';

class Undead extends Character {
    constructor(level, type='undead') {
        super(level)
        this.type = type
        this.attack = 40;
        this.defence = 10;
    }
}