import {assert, expect, should} from 'chai'

import {foo} from './foo';

describe('Tesing method "foo"', () => {
  it('should calculate 1 + 2', () => {
    expect(foo(1, 2)).to.be.equal(3);
  });

it('should throw error when both arguments missing', () => {
    expect(() => {
      foo()
    }).to.throw('Missing arguments');
  });

  it('should throw error when the second argument is missing', () => {
    expect(() => {
      foo(1)
    }).to.throw('2nd argument is missing');
  });
});
