import chai, {assert, expect, should} from 'chai';
import sinonChai from 'sinon-chai';
import Scanner, {Char} from '../scanner';

chai.use(sinonChai);

let scanner, H, e, l1, l2, o;

const scannerCalToBe = (call, expected) => {
  if (expected !== null) {
    expect(call.apply(scanner)).to.be.deep.equal(expected);
  } else {
    expect(call.apply(scanner)).to.be.null;
  }
};

const scannerTestCallToBe = (call, what, expected) => {
  expect(call.apply(scanner, [what])).to.be.equal(expected);
};

const nextToBe = (expected) => {
  scannerCalToBe(scanner.next, expected);
};

const prevToBe = (expected) => {
  scannerCalToBe(scanner.prev, expected);
};

const testNext = (what, expected) => {
  scannerTestCallToBe(scanner.next, what, expected);
};

const testPrev = (what, expected) => {
  scannerTestCallToBe(scanner.prev, what, expected);
};

describe('Scanner should', () => {

  beforeEach(() => {
    scanner = new Scanner('Hello');
    H = new Char('H', 0);
    e = new Char('e', 1);
    l1 = new Char('l', 2);
    l2 = new Char('l', 3);
    o = new Char('o', 4);
  });

  it('scan simple Hello', () => {
    nextToBe(H);
    nextToBe(e);
    nextToBe(l1);
    nextToBe(l2);
    nextToBe(o);
    nextToBe(null);
  });

  it('handle correctly traversal backward at the begnning', () => {
    prevToBe(null);
    prevToBe(null);
    prevToBe(null);
    testPrev('X', false);
    prevToBe(null);
    nextToBe(H);
  });

  it('handle correctly traversal forward at the end', () => {
    scanner.next(); // H
    scanner.next(); // e
    scanner.next(); // l
    scanner.next(); // l
    nextToBe(o);
    nextToBe(null);
    testNext('x', false);
    nextToBe(null);
    prevToBe(o);
  });

  it('test characters at the beginning', () => {
    testPrev('H', false);
    testNext('H', true);
    testNext('H', true);
    testPrev('x', false);
    testNext('x', false);
  });

  it('test characters at the end', () => {
    scanner.next(); // H
    scanner.next(); // e
    scanner.next(); // l
    scanner.next(); // l
    nextToBe(o);
    nextToBe(null);

    testPrev('x', false);
    testPrev('o', true);
    testPrev('o', true);
    testPrev('x', false);
    testNext('x', false);
    testNext('o', false);
  });

  it('traverse forward and back', () => {
    nextToBe(H);
    nextToBe(e);
    nextToBe(l1);
    nextToBe(l2);
    nextToBe(o);
    nextToBe(null);
    prevToBe(o);
    prevToBe(l2);
    prevToBe(l1);
    prevToBe(e);
    prevToBe(H);
    prevToBe(null);
    nextToBe(H);
    nextToBe(e);
    nextToBe(l1);
    nextToBe(l2);
    nextToBe(o);
    nextToBe(null);
    prevToBe(o);
    prevToBe(l2);
    prevToBe(l1);
    prevToBe(e);
    prevToBe(H);
    prevToBe(null);
  });

  it('test characters without afecting actual position.', () => {
    nextToBe(H);
    nextToBe(e);
    nextToBe(l1);
    testNext('l', true);
    testNext('x', false);
    testNext('l', true);
    testPrev('l', true);
    testNext('l', true);
    testNext('x', false);
    testNext('l', true);
    nextToBe(l2);
    nextToBe(o);
    nextToBe(null);
  });
});
