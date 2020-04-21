/**
 * Aufgabe 2 verbesserung
 */

import * as fs from 'fs';
import * as readline from 'readline';

const input = fs.createReadStream('../unsecretFile.txt');
var rl = readline.createInterface({
  input: input,
  output: process.stdout,
  terminal: false
});

const isCharNumber = c => c >= '0' && c <= '9';
let total = 0;

rl.on('end', process.exit);
rl.on('line', (line) => {
  if (/\d/.test(line) === false) return;
  total = line.split('')
              .filter(isCharNumber)
              .map(ch => parseInt(ch, 10))
              .reduce((acc, curr) => acc + curr, total);

  console.log('running total: ', total);
});