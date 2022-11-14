import Character from '../Character';

class Vampire extends Character {
    constructor(level, type='vampire') {
        super(level)
        this.type = type
        this.attack = 25;
        this.defence = 25;
    }
}