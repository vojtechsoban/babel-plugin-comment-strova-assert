import chai, {expect} from 'chai';
import sinonChai from 'sinon-chai';
import {notNull} from '../assert';

chai.use(sinonChai);

describe('notNull', () => {
  it('return false for null', () => {
    expect(notNull(null)).to.be.false;
  });
  
  it('return true for "hello"', () => {
    expect(notNull('hello')).to.be.true;
  });
  
  it('return true for empty string', () => {
    expect(notNull('')).to.be.true;
  });
  
  it('return true for whitespace string', () => {
    expect(notNull(' ')).to.be.true;
  });
  
  it('return true for 0', () => {
    expect(notNull(' ')).to.be.true;
  });
  
  it('return true for false', () => {
    expect(notNull(false)).to.be.true;
  });
  
  it('return true for true', () => {
    expect(notNull(true)).to.be.true;
  });
  
  it('return true for 0', () => {
    expect(notNull(0)).to.be.true;
  });
  
  it('return true for 0.0', () => {
    expect(notNull(0.0)).to.be.true;
  });
  
  it('return true for -0', () => {
    expect(notNull(-0)).to.be.true;
  });
});
