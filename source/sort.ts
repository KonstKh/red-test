import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';

export const convertAsciiToString = (arr: Array<number>) => {
  return arr.map(n => String.fromCharCode(n)).join('');
}

const processResult = (result: Array<number>) => {
  const subtractedResult = result.map((el, i) => el - i);
  console.log(`gefundene Summen: ${subtractedResult}`);

  const largest3elements = [...subtractedResult].sort((a, b) => (b - a)).splice(0, 3);
  console.log(`größte 3 Werte: ${largest3elements}`);

  const unordered = [] as { key: number, value: number }[];
  largest3elements.forEach((el) => {
    if (subtractedResult.indexOf(el) !== -1) {
      unordered.push({ key: subtractedResult.indexOf(el), value: el })
    };
  });
  unordered.sort((a, b) => (a.key - b.key));
  const ordered = [] as number[];
  unordered.forEach(el => ordered.push(el.value));
  console.log(`größte 3 Werte in der Reihenfolge ihres Vorkommens: ${ordered}`);

  const orderedMinusIndex = ordered.reduce((acc, curr, i) => {
    acc.push(curr - i);
    return acc;
  }, [] as number[]);
  console.log(`größte 3 Werte in der Reihenfolge ihres Vorkommens abzüglich Index: ${orderedMinusIndex}`);
}

export const parseFile = async (filePath: string, cb?: Function) => {
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

  const result: number[] = [];

  rl.on('close', () => {
    processResult(result);
    cb && cb(result);
  });

  const isCharNumber = (c: string) => c >= '0' && c <= '9';

  rl.on('line', (line: string) => {
    const sentences = line.split('. ');
    sentences.forEach(sentence => {
      let summ = 0;
      const sentenceSumm = sentence
        .split('')
        .filter(isCharNumber)
        .map(ch => parseInt(ch, 10))
        .reduce((acc, curr) => acc + curr, summ);

      const minValue = Math.min(...result);
      if (result.length < 10) {
        result.push(sentenceSumm);
      } else if (sentenceSumm > minValue) {
        const minIndex = result.indexOf(minValue);
        result.splice(minIndex, 1);
        result.push(sentenceSumm);
        // console.log(`running summ per sentence: ${result}`)
      }
    })
  });
}

// parseFile('../assets/unsecretFile1.txt');
