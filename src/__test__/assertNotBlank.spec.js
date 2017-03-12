import chai, {expect} from 'chai';
import sinonChai from 'sinon-chai';
import * as t from '../types';

import {assert, notNull, notBlank, notEmpty} from '../assert';

chai.use(sinonChai);

describe('notBlank', () => {
  it('return true for "hello"', () => {
    expect(notBlank('hello')).to.be.true;
  });
  it('return true for "  hello"', () => {
    expect(notBlank('hello')).to.be.true;
  });
  it('return true for "hello  "', () => {
    expect(notBlank('hello')).to.be.true;
  });
  it('return true for "  hello  "', () => {
    expect(notBlank('hello')).to.be.true;
  });
  it('return false for ""', () => {
    expect(notBlank('')).to.be.false;
  });
  it('return false for " "', () => {
    expect(notBlank(' ')).to.be.false;
  });
  it('return false for "\\t "', () => {
    expect(notBlank('\t ')).to.be.false;
  });
  it('return false for "\\n"', () => {
    expect(notBlank('\n')).to.be.false;
  });
  it('return false for null', () => {
    expect(notBlank(null)).to.be.false;
  });
  it('return false for number', () => {
    expect(notBlank(123)).to.be.false;
  });
});
