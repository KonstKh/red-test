import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import { convertAsciiToString, parseFile } from './sort';

const options = {
  key: fs.readFileSync(path.join(__dirname, '../assets/localhost.key')),
  cert: fs.readFileSync(path.join(__dirname, '../assets/localhost.crt'))
}

https.createServer(options, async (req, res) => {
  if (req.url === '/favicon.ico') {
    res.writeHead(200, { 'Content-Type': 'image/x-icon' });
    return res.end();
  }
  // change fileName in case it needs
  await parseFile('../assets/unsecretFile.txt', (fileParseResult) => {
    console.log('fileParseResult: ', fileParseResult);
    const convertedString = convertAsciiToString(fileParseResult);
    res.writeHead(200);
    console.log(`convertedString: ${convertedString}`)
    res.end(`convertedString: ${convertedString}`);
  });

}).listen(8080);
