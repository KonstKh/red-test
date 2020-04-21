import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as zlib from 'zlib';

const getFile = (file) => fs.readFileSync(path.join(process.cwd(), file));

const key = getFile('../secret.key').toString().substr(0, 32);
const decipher = crypto.createDecipheriv('aes-256-gcm', key, getFile('../iv.txt'));
decipher.setAuthTag(getFile('../auth.txt'));

fs.createReadStream(path.join(process.cwd(), "../secret.enc"))
  .pipe(decipher)
  .pipe(zlib.createGunzip())
  .pipe(fs.createWriteStream('../unsecretFile.txt'));

const getData = async (path: string): Promise<string> => {
  const rs = fs.createReadStream(path);
  return await readStream(rs);
}

const readStream = (stream, encoding = 'utf8'): Promise<string> => {
  stream.setEncoding(encoding);
  return new Promise((resolve, reject) => {
    let data = '';
    stream.on('data', chunk => data += chunk);
    stream.on('end', () => resolve(data));
    stream.on('error', error => reject(error));
  })
}

/**
 * Aufgabe 2: die Summe aller vorkommenden Ziffern in der Datei
 * @param path 
 */
const getSummOfNumbers = async (path: string): Promise<number | null> => {
  const text = await getData(path);
  const matches = text.match(/\d+\.?\d*/g);
  return matches && matches.reduce((acc, curr) => (acc + Number.parseInt(curr, 10)), 0);
}

getSummOfNumbers('../clear_smaller.txt').then(console.log);


/**
 * Aufgabe 3 #2 Summe aus alle vorkommenden Vokale
 * @param path 
 */
const countVowels = async (path: string) => {
  const text = await getData(path);
  const vowels = text.toLowerCase().match(/[aeiou]/gi);
  const mapCount = new Map();
  vowels && vowels.map(char => {
    mapCount.has(char) ? mapCount.get(char).val++ : mapCount.set(char, { val: 1 });
  });
  return mapCount;
}
countVowels('../clear_smaller.txt').then(console.log)

const vowelMap = {
  'a': 2,
  'e': 4,
  'i': 8,
  'o': 16,
  'u': 32,
}

/**
 * Aufgabe 3 #1
 */
const summOfVowels = async () => {
  const vowelsMap = await countVowels('../clear_smaller.txt');
  const result = {}
  vowelsMap.forEach((_val, key, map) => {
      const newVal = map.get(key).val * vowelMap[key]
      result[key] = newVal
  });
  return result;
}

summOfVowels().then(console.log);
