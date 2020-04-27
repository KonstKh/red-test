/**
 * Aufgabe 2 verbesserung
 */

import * as fs from 'fs';
import * as readline from 'readline';

const calculateNumbers = async (filePath: string) => {
  try {
    await fs.promises.access(filePath);
  } catch (err) {
    console.log('File passed doesnt exists. Placeholder used instead.');
    filePath = '../assets/clear_smaller.txt';
  }

  const input = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: input,
    output: process.stdout,
    terminal: false
  });

  const isCharNumber = (char: string) => char >= '0' && char <= '9';
  let total = 0;

  rl.on('close', () => {
    console.log(`Total: ${total}`);
    process.exit(0)
  });

  rl.on('line', (line) => {
    if (/\d/.test(line) === false) return;
    total = line.split('')
      .filter(isCharNumber)
      .map(ch => parseInt(ch, 10))
      .reduce((acc, curr) => acc + curr, total);

    // console.log('running total: ', total);
  });
}

calculateNumbers('../assets/unsecretFile.txt');
