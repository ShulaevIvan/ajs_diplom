import Character from '../Character';

export default class Deamon extends Character {
    constructor(level, type='daemon') {
        super(level)
        this.type = type
        this.attack = 10;
        this.defence = 10;
    }
}