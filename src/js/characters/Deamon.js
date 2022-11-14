import Character from '../Character';

class Deamon extends Character {
    constructor(level, type='deamon') {
        super(level)
        this.type = type
        this.attack = 10;
        this.defence = 10;
    }
}