export class Char {
  constructor(value, column = -1) {
    this.value = value;
    this.column = column;
  }
}

export default class Scanner {
  constructor(input) {
    this.input = input;
    this.position = -1;
    this.length = input.length;
  }

  next() {
    if (arguments.length === 0) {
      return this.getNext();
    }
    return this.testNext(arguments[0]);
  }

  testNext(characters) {
    if (this.position === this.length - 1) {
      return false;
    }

    const nextCharacter = this.input.charAt(this.position + 1);
    if (nextCharacter === '') return false;
    return characters.indexOf(nextCharacter) > -1;
  }

  getNext() {
    if (this.position === this.length - 1) {
      return null;
    }
    return new Char(this.input.charAt(this.position + 1), ++this.position);
  }

  prev() {
    if (arguments.length === 0) {
      return this._getPrev();
    } else {
      return this._testPrev(arguments[0]);
    }
  }

  _testPrev(characters) {
    if (this.position === -1) {
      return false;
    }

    const prevCharacter = this.input.charAt(this.position);
    if (prevCharacter === '') return false;
    return characters.indexOf(prevCharacter) > -1;
  }

  _getPrev() {

    if (this.position === -1) {
      return null;
    }

    return new Char(this.input.charAt(this.position), this.position--);
  }
}
