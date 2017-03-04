import chai, {assert, expect, should} from 'chai';
import sinonChai from 'sinon-chai';
import lexer from '../lexer';
import * as t from '../types';

chai.use(sinonChai);

const whitespace = (value, position = 0) => ({type: t.TYPE_WHITESPACE, value, position});
const symbol = (value, position = 0) => ({type: t.TYPE_SYMBOLS, value, position});
const string = (value, position = 0) => ({type: t.TYPE_STRING, value, position});
const number = (value, position = 0) => ({type: t.TYPE_NUMBER, value, position});

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
    expect(lexer(' ')).to.be.deep.equal([whitespace(' ')]);
  });
  
  it('scan multiple whitespaces', () => {
    expect(lexer(' \t')).to.be.deep.equal([whitespace(' \t')]);
  });
  
  it('scan single string', () => {
    expect(lexer('s')).to.be.deep.equal([string('s')]);
  });
  
  it('scan integer number', () => {
    expect(lexer('123456')).to.be.deep.equal([number('123456')]);
  });
  
  it('scan floating number', () => {
    expect(lexer('123.456')).to.be.deep.equal([number('123.456')]);
  });
  
  it('scan floating number starting with point', () => {
    expect(lexer('.456')).to.be.deep.equal([number('.456')]);
  });
  
  it('scan floating number ending with point', () => {
    expect(lexer('123.')).to.be.deep.equal([number('123.')]);
  });
  
  it('scan series of symbols', () => {
    expect(lexer('{?+-/*}')).to.be.deep.equal([symbol('{', 0), symbol('?', 1), symbol('+', 2), symbol('-', 3), symbol('/', 4),
                                               symbol('*', 5), symbol('}', 6)]);
  });
  
  it('scan combination of tokens', () => {
    expect(lexer('ab + .123 = ${cd} - 456')).to.be.deep.equal(
      [string('ab', 0), whitespace(' ', 2), symbol('+', 3), whitespace(' ', 4), number('.123', 5), whitespace(' ', 9),
       symbol('=', 10), whitespace(' ', 11), symbol('$', 12), symbol('{', 13), string('cd', 14), symbol('}', 16), whitespace(' ', 17),
       symbol('-', 18), whitespace(' ', 19), number('456', 20)]);
  });
});
