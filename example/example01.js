import * as babel from 'babel-core';
import plugin from '../src/index';
import fs from 'fs';

function replace (code) {
    return babel.transform(code, { babelrc: false, plugins: [plugin] }).code.trim();
}

const fileName = './testing.js';

fs.readFile(fileName, function(err, content) {
  if (err) throw err;
  const result = replace(content.toString());
  console.log('*** result ***');
  console.log(result);
  console.log('*** end ***');
});
