import chai, {assert, expect, should} from 'chai';
import sinonChai from 'sinon-chai';
import {parse} from '../parser';

chai.use(sinonChai);

const assertParser = (input, expectedExpression, expectedAction, expectedActionArguments = null,
                      expectedType = null, expectedMessage = null, expectedNullable = false) => {
  
  const {expression, action, actionArguments, type, message, nullable} = parse(input);
  
  expect(expression).to.be.equal(expectedExpression);
  expect(actionArguments).to.be.deep.equal(expectedActionArguments);
  
  if (expectedAction) {
    expect(action).to.be.equal(expectedAction);
  } else {
    expect(action).to.be.null;
  }
  
  if (expectedType) {
    expect(type).to.be.equal(expectedType);
  } else {
    expect(type).to.not.exist;
  }
  
  if (expectedMessage) {
    expect(message).to.be.equal(expectedMessage);
  } else {
    expect(message).to.not.exist;
  }
  
  if (expectedNullable) {
    expect(nullable).to.be.true;
  } else {
    expect(nullable).to.be.false;
  }
};

describe('Tesing parser', () => {
  it('1st test', () => {
    const input = 'a + 1.5 notEmpty {?string} : Given expression produces an empty string';
    
    const {expression, action, type, message} = parse(input);
    
    expect(expression).to.be.equal('a+1.5');
    expect(action).to.be.equal('notEmpty');
    expect(type).to.be.equal('string');
    expect(message).to.be.equal('Given expression produces an empty string');
  });
  
  it('2nd test', () => {
    const input = 'variable nullable {string} : Identifier is not null but is not a string';
    
    const {expression, action, type, nullable, message} = parse(input);
    
    expect(expression).to.be.equal('variable');
    expect(action).to.be.null;
    expect(nullable).to.be.true;
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
  
  it('variable must not be null and not empty', () => {
    const {expression, action, type, message, nullable} = parse('variable notEmpty');
    expect(expression).to.be.equal('variable');
    expect(action).to.be.equal('notEmpty');
    expect(type).to.not.exist;
    expect(message).to.not.exist;
    expect(nullable).to.be.false;
  });
  
  it('variable within range -1, 1', () => {
    assertParser('variable {-1 < string < 1}', 'variable', 'range', [-1, '<', '<', 1], 'string');
  });

  it('variable within range +1, +10 inclusive', () => {
    assertParser('variable {+1 <= string <= +10}', 'variable', 'range', [1, '<=', '<=', 10], 'string');
  });

  it('variable within range +1, +10 exclusive', () => {
    assertParser('variable {+1 < string < +10}', 'variable', 'range', [1, '<', '<', 10], 'string');
  });

  it('variable greater or equal 10 - pre argument', () => {
    assertParser('variable {10 <= string}', 'variable', 'range', [10, '<='], 'string');
  });

  it.skip('variable greater or equal 10 - natural way - post argument', () => {
    // TODO support converting operators
    assertParser('variable {string >= 10}', 'variable', 'range', [10, '<='], 'string');
  });

  it('variable must not be empty but might be null', () => {
    const {expression, action, type, message, nullable} = parse('variable notEmpty');
    expect(expression).to.be.equal('variable');
    expect(action).to.be.equal('notEmpty');
    expect(type).to.not.exist;
    expect(message).to.not.exist;
    expect(nullable).to.be.false;
  });
  
  it('the type without an action', () => {
    assertParser('name {?string} : Name is usually a string.', 'name', null, [], 'string', 'Name is usually a string.', true);
  });

  it.skip('the type with an action using 2 modifiers', () => {
    assertParser('name {?$string} : Name is usually a string.', 'name', 'notEmpty', [], 'string', 'Name is usually a string.', true);
  });

  it.skip('the type with an action using 2 modifiers - flipped', () => {
    assertParser('name {$?string} : Name is usually a string.', 'name', 'notEmpty', [], 'string', 'Name is usually a string.', true);
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
  
  it.skip('expression combining the nullable modifier and some action', () => {
    // tested variable might be null but must not be empty when is not null
    assertParser('variable nullable notEmpty');
    assertParser('variable notEmpty nullable');
    assertParser('variable notEmpty {?string}');
    assertParser('variable nullable {$string}');
  });
});
