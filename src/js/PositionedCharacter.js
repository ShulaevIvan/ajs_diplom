import Character from './Character.js';

export default class PositionedCharacter {
  constructor(character, position) {
    if (!(character instanceof Character)) {
      throw new Error(
        'this is core class'
      );
    }

    this.character = character;
    this.position = position;
  }
}