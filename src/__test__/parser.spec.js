import chai, {assert, expect, should} from 'chai';
import sinonChai from 'sinon-chai';
import {parse} from '../parser';

chai.use(sinonChai);

describe('Tesing parser', () => {
  it('1st test', () => {
    const input = 'a + 1.5 notEmpty {?string} : Given expression produces an empty string';
    
    const {expression, action, type, message} = parse(input);
    
    expect(expression).to.be.equal('a+1.5');
    expect(action).to.be.equal('notEmpty');
    expect(type).to.be.equal('?string');
    expect(message).to.be.equal('Given expression produces an empty string');
  });
  
  it('2nd test', () => {
    const input = 'variable nullable {string} : Identifier is not null but is not a string';
    
    const {expression, action, type, message} = parse(input);
    
    expect(expression).to.be.equal('variable');
    expect(action).to.be.equal('nullable');
    expect(type).to.be.equal('string');
    expect(message).to.be.equal('Identifier is not null but is not a string');
  });
   
  it('3rd test', () => {
    const input = 'variable notEmpty : Identifier is not null but is not a string';
    
    const {expression, action, type, message} = parse(input);
    
    expect(expression).to.be.equal('variable');
    expect(action).to.be.equal('notEmpty');
    expect(type).to.not.exist;
    expect(message).to.be.equal('Identifier is not null but is not a string');
  });
  
  it('4th test', () => {
    const {expression, action, type, message} = parse('variable notEmpty');
    expect(expression).to.be.equal('variable');
    expect(action).to.be.equal('notEmpty');
    expect(type).to.not.exist;
    expect(message).to.not.exist;
  });
  
  it('the type without an action', () => {
    const {expression, action, type, message} = parse('name {?string} : Name is usually a string.');
    expect(expression).to.be.equal('name');
    expect(action).to.not.exist;
    expect(type).to.be.equal('?string');
    expect(message).to.be.equal('Name is usually a string.');
  });
  
  it('the simpliest assertion without a message.', () => {
    const {expression, action, type, message} = parse('variable');
    expect(expression).to.be.equal('variable');
    expect(action).to.not.exist;
    expect(type).to.not.exist;
    expect(message).to.not.exist;
  });
  
  it('the simpliest assertion with a message.', () => {
    const {expression, action, type, message} = parse('variable : message');
    expect(expression).to.be.equal('variable');
    expect(action).to.not.exist;
    expect(type).to.not.exist;
    expect(message).to.be.equal('message');
  });
});
