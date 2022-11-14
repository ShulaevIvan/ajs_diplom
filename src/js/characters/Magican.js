import Character from '../Character';

class Magician extends Character {
    constructor(level, type='magican') {
        super(level)
        this.type = type
        this.attack = 10;
        this.defence = 40;
    }
}