import chai, {expect} from 'chai';
import sinonChai from 'sinon-chai';
import * as t from '../types';

import {assert} from '../assert';

chai.use(sinonChai);

describe('Main assert', () => {
  it('notBlank return true for "hello"', () => {
    expect(assert('hello', t.KEYWORD_NOT_BLANK)).to.be.true;
  });
  it('notBlank return false for " "', () => {
    expect(assert(' ', t.KEYWORD_NOT_BLANK)).to.be.false;
  });
  it('notBlank return false for null', () => {
    expect(assert(null, t.KEYWORD_NOT_BLANK)).to.be.false;
  });
  it('notBlank return true for null with nullable', () => {
    expect(assert(null, t.KEYWORD_NOT_BLANK, null, null, true)).to.be.true;
  });
});
