/* eslint-disable no-restricted-syntax */
export default class Team {
  constructor() {
    this.members = new Set();
  }

  addChar(characterObj) {
    const check = this.members.has(characterObj);
    if (check) {
      throw new Error('This type character is exists');
    }
    this.members.add(characterObj);
  }

  addAllChars(...args) {
    args.map((item) => {
      if (!this.members.has(item)) {
        return this.members.add(item);
      }
    });
  }

  removeChar(char) {
    this.members.delete(char);
  }

  toArray() {
    return [...this.members];
  }

  *[Symbol.iterator]() {
    for (const char of this.members) {
      yield char;
    }
  }
}