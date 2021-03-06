import chai, {assert, expect, should} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
import {add} from '../example/foomodule';

describe('Tesing calc method "add"', () => {

  let sandbox;

  beforeEach(() => {
    sandbox= sinon.sandbox.create();
    sandbox.stub(console, 'error');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should calculate 1 + 2', () => {
    expect(add(1, 2)).to.be.equal(3);
  });

  it('should log error for both arguments', () => {
    add();
    expect(console.error).to.have.been.calledWith('Expression is null: arg1');
    expect(console.error).to.have.been.calledWith('Expression is null: arg2');
  });

  it('should log error for the 2nd argument', () => {
    add(1);
    expect(console.error).to.have.been.calledWith('Expression is null: arg2');
  });
});
