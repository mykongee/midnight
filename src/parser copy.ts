import * as fs from 'fs';
import * as path from 'path';
import * as parserModule from 'acorn';
import * as jsx from 'acorn-jsx';
const PARSER = parserModule.Parser;
const JSXPARSER = PARSER.extend(jsx());


export const parse = (source: Buffer) => {
  // console.log('IN PARSE READING ', filePath);
  console.log('IN PARSE');
  // const source = fs.readFileSync(path.resolve(__dirname, filePath));
  console.log('source: ', source);
  const parsed = JSXPARSER.parse(source, {sourceType: "module"}); 
  console.log('parsed: ', parsed);
  const programBody: Array<any> = parsed.body; // get body of Program Node(i.e. source code entry)
  console.log(programBody)

  // return [fs, path, source, programBody];
  return [fs, path];
};

// works!