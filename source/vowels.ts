import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';

const calculateVowels = async (filePath: string) => {
  try {
    await fs.promises.access(filePath);
  } catch (err) {
    console.log('File passed doesnt exists. Placeholder used instead.');
    filePath = '../assets/clear_smaller.txt';
  }
  const uri = path.join(__dirname, filePath);
  const input = fs.createReadStream(uri);

  const rl = readline.createInterface({
    input,
    output: process.stdout,
    terminal: false
  });

  const result = {};
  let summ = 0;

  const vowelMap: { [key: string]: number } = {
    'a': 2,
    'e': 4,
    'i': 8,
    'o': 16,
    'u': 32,
  }

  rl.on('close', () => {
    console.log('Result: ', result);
    console.log('Summ: ', summ);
    process.exit(0);
  });

  rl.on('line', (line) => {
    line
      .split('')
      .filter(c => Object.keys(vowelMap).includes(c))
      .forEach(key => {
        result[key] = (result[key] || 0) + vowelMap[key];
        summ++;
      });
  });
}

calculateVowels('../assets/unsecretFile1.txt');
