import * as fs from 'fs';
import * as path from 'path';
import * as parserModule from 'acorn';
import * as jsx from 'acorn-jsx';
const PARSER = parserModule.Parser;
const JSXPARSER = PARSER.extend(jsx());


// CONSTANTS 
const JSXTEXT: string = 'JSXText';
const JSXELEMENT: string = 'JSXElement';
const JSXEXPRESSIONCONTAINER: string = 'JSXExpressionContainer';

// TS Interface
interface Node {
  type: string,
  start: number,
  end: number,
  value: any,
  raw: string,
  declarations: Array<Node>,
  declaration: Node,
  properties: Array<Node>,
  method: boolean,
  init: Node,
  body: Array<any>|object,
  children: Array<Node>,
  argument: Node,
  openingElement: Node,
  name: Node|string,
  attributes: Array<Node>,
  props: Node,
  expression: Node,
  source: Node,
}

interface ComponentNode {
  name: string,
  children: Array<any>,
  props: Object
}

class ComponentNode {
  constructor(name: string, props: Object, children: Array<any>) {
    this.name = name;
    this.children = children;
    this.props = props;
  }
}


export const parse = (source: Buffer) => {
  // console.log('IN PARSE READING ', filePath);
  console.log('IN PARSE');
  // const source = fs.readFileSync(path.resolve(__dirname, filePath));
  console.log('source: ', source);
  const parsed = JSXPARSER.parse(source, {sourceType: "module"}); 
  console.log('parsed: ', parsed);
  const programBody: Array<any> = parsed.body; // get body of Program Node(i.e. source code entry)
  console.log(programBody);
  const output = main(programBody);
  console.log('main: ', output);

  // return [fs, path, source, programBody];
  // return [fs, path, output];
  return output;
};


function getImportNodes(programBody: Array<Node>) {
  const importNodes: Array<Node> = programBody.filter((node: Node) => node.type === 'ImportDeclaration');
  return importNodes;
}
function getVariableNodes(programBody: Array<Node>) {
  const variableNodes: Array<Node> = programBody.filter((node: Node) => node.type === 'VariableDeclaration');
  return variableNodes;
}
function getNonImportNodes(programBody: Array<any>) {
  const nonImportNodes: Array<Node> = programBody.filter((node: Node) => node.type !== 'ImportDeclaration');
  return nonImportNodes;
}
function getExportDefaultNodes(otherNodes: Array<any>) {
  const exportDefaultNode: Node = otherNodes.filter((node: Node) => {
  node.type === 'ExportDefaultDeclaration';
  })[0];
  return exportDefaultNode;
}

function getChildrenNodes(variableNodes: Array<Node>) {
  // RETURN STATEMENT in functional component
  const nodes = variableNodes[variableNodes.length-1].declarations[0].init.body.body;
  const returnNode = nodes.filter((node) => node.type === 'ReturnStatement')[0];
  const childrenNodes = returnNode.argument.children;
  return childrenNodes;
}

function getJsxNodes(childrenNodes: Array<Node>) {
  const jsxNodes: Array<Node> = childrenNodes.filter((node: Node) => node.type === JSXELEMENT);
  return jsxNodes;
}

function getChildrenComponents(jsxNodes: Array<Node>, importNodes: Array<Node>) {
  const components = [];
  const regex = /[a-zA-Z]+(.jsx|.js)/;  
  const importValues = importNodes.map((node) => node.source.value);
  const componentPaths = importValues.filter((str) => regex.test(str) === true); 
  const cache = {};
  for (let str of componentPaths) {
    const splitName = str.split('/');
    const componentPath = splitName[splitName.length-1];
    const name = componentPath.split('.')[0];
    cache[name] = str;
  }
  console.log('Cache', cache);
  
  // importValues = ['./Children.jsx', 'react', 'react-router-dom']
  for (let node of jsxNodes) {
    const firstChar = node.openingElement.name.name[0]; // actual name label (i.e. 'Chatroom', 'Component')
    const componentName = node.openingElement.name.name;
    if (firstChar === firstChar.toUpperCase()) {
      const props = getProps(node); 
      // --- OLD ---
      // check componentName against importNodes
      // if name matches import node name, take filepath
      // recursively invoke parsing algo on file
      // let children: Array<ComponentNode> = [];
      // if (cache[`${componentName}`]) { // './Children.jsx
      //   children = main(cache[`${componentName}`]);
      // }
      // const componentNode = new ComponentNode(componentName, props, children);
      // --- OLD ---
      
      // --- NEW ---
        // need to pass message?
        // or somehow do all logic in extension.ts
      const componentNode = new ComponentNode(componentName, props, []);
      // --- NEW ---


      components.push(componentNode);      
    }
  }
  return components;
}

function getPropValue(node: Node) {
  if (Object.keys(node).includes('expression')) {
    return node.expression.value; // look into the value (node) and find the expression 
  } else {
    return node.value; // return the value 
  }
}

function getProps(node: Node){
  const propObj = {};
  for(let prop of node.openingElement.attributes){
    const name = prop.name.name;
    propObj[name] = getPropValue(prop.value); 
    // console.log('propObj', propObj);
  }
  // console.log(propArr);
  return propObj;
}

function main(arr: Array<any>) {
  // console.log(filePath);
  // const tree = getTree(filePath);
  console.log('IN MAIN: ', arr);
  const importNodes = getImportNodes(arr);
  const variableNodes = getVariableNodes(arr);
  const childrenNodes = getChildrenNodes(variableNodes);
  const jsxNodes = getJsxNodes(childrenNodes);
  const result = getChildrenComponents(jsxNodes, importNodes);
  // console.log(result);
  return result;
}
