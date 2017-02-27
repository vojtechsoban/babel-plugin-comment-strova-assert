import chai, {assert, expect, should} from 'chai';
import sinonChai from 'sinon-chai';
import lexer from '../lexer';
import * as t from '../types';

chai.use(sinonChai);

const whitespace = (value) => ({type: t.TYPE_WHITESPACE, value});
const symbol = (value) => ({type: t.TYPE_SYMBOLS, value});
const string = (value) => ({type: t.TYPE_STRING, value});
const number = (value) => ({type: t.TYPE_NUMBER, value});

describe('Lexer should', () => {
  
  it('scan "null" input', () => {
    expect(lexer(null)).to.be.empty;
  });
  
  it('scan "undefined" input', () => {
    expect(lexer(undefined)).to.be.empty;
  });
  
  it('scan empty input', () => {
    expect(lexer('')).to.be.empty;
  });
  
  it('scan single whitespace', () => {
    expect(lexer(' ')).to.be.deep.equal([{type: 'whitespace', value: ' '}]);
  });
  
  it('scan multiple whitespaces', () => {
    expect(lexer(' \t')).to.be.deep.equal([{type: 'whitespace', value: ' \t'}]);
  });
  
  it('scan single string', () => {
    expect(lexer('s')).to.be.deep.equal([{type: 'string', value: 's'}]);
  });
  
  it('scan integer number', () => {
    expect(lexer('123456')).to.be.deep.equal([{type: 'number', value: '123456'}]);
  });
  
  it('scan floating number', () => {
    expect(lexer('123.456')).to.be.deep.equal([{type: 'number', value: '123.456'}]);
  });
  
  it('scan floating number starting with point', () => {
    expect(lexer('.456')).to.be.deep.equal([{type: 'number', value: '.456'}]);
  });
  
  it('scan floating number ending with point', () => {
    expect(lexer('123.')).to.be.deep.equal([{type: 'number', value: '123.'}]);
  });
  
  it('scan series of symbols', () => {
    expect(lexer('{?+-/*}')).to.be.deep.equal([symbol('{'), symbol('?'), symbol('+'), symbol('-'), symbol('/'), symbol('*'), symbol('}')]);
  });
  
  it('scan combination of tokens', () => {
    expect(lexer('ab + .123 = ${cd} - 456')).to.be.deep.equal(
      [string('ab'), whitespace(' '), symbol('+'), whitespace(' '), number('.123'), whitespace(' '), symbol('='), whitespace(' '),
       symbol('$'), symbol('{'), string('cd'), symbol('}'), whitespace(' '), symbol('-'), whitespace(' '), number('456')]);
  });
});
