import * as babel from 'babel-core';
import es2015 from 'babel-preset-es2015';
import strova_assert from '../src/index';
import fs from 'fs';

/*
 Idea/Webstorm Node.js Run/Debug configurations:
 Node parameters: -r babel-register
 Environment variables: BABEL_ENV=test
 */
function replace(code) {
  return babel.transform(code, {babelrc: false, presets: [es2015], plugins: [[strova_assert, {action: 'throw'}]]}).code.trim();
}

const fileName = './example/foomodule.js';

fs.readFile(fileName, function (err, content) {
  if (err) throw err;
  const result = replace(content.toString());
  console.log('*** result ***');
  console.log(result);
  console.log('*** end ***');
});
