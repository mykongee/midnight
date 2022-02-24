"use strict";
exports.__esModule = true;
exports.parse = void 0;
var parserModule = require("acorn");
var jsx = require("acorn-jsx");
var PARSER = parserModule.Parser;
var JSXPARSER = PARSER.extend(jsx());
// CONSTANTS 
var JSXTEXT = 'JSXText';
var JSXELEMENT = 'JSXElement';
var JSXEXPRESSIONCONTAINER = 'JSXExpressionContainer';
var ComponentNode = /** @class */ (function () {
    function ComponentNode(name, props, children) {
        this.name = name;
        this.children = children;
        this.props = props;
    }
    return ComponentNode;
}());
var parse = function (source) {
    // console.log('IN PARSE READING ', filePath);
    console.log('IN PARSE');
    // const source = fs.readFileSync(path.resolve(__dirname, filePath));
    console.log('source: ', source);
    var parsed = JSXPARSER.parse(source, { sourceType: "module" });
    console.log('parsed: ', parsed);
    var programBody = parsed.body; // get body of Program Node(i.e. source code entry)
    console.log(programBody);
    var output = main(programBody);
    console.log('main: ', output);
    // return [fs, path, source, programBody];
    // return [fs, path, output];
    return output;
};
exports.parse = parse;
function getImportNodes(programBody) {
    var importNodes = programBody.filter(function (node) { return node.type === 'ImportDeclaration'; });
    return importNodes;
}
function getVariableNodes(programBody) {
    var variableNodes = programBody.filter(function (node) { return node.type === 'VariableDeclaration'; });
    return variableNodes;
}
function getNonImportNodes(programBody) {
    var nonImportNodes = programBody.filter(function (node) { return node.type !== 'ImportDeclaration'; });
    return nonImportNodes;
}
function getExportDefaultNodes(otherNodes) {
    var exportDefaultNode = otherNodes.filter(function (node) {
        node.type === 'ExportDefaultDeclaration';
    })[0];
    return exportDefaultNode;
}
function getChildrenNodes(variableNodes) {
    // RETURN STATEMENT in functional component
    var nodes = variableNodes[variableNodes.length - 1].declarations[0].init.body.body;
    var returnNode = nodes.filter(function (node) { return node.type === 'ReturnStatement'; })[0];
    var childrenNodes = returnNode.argument.children;
    return childrenNodes;
}
function getJsxNodes(childrenNodes) {
    var jsxNodes = childrenNodes.filter(function (node) { return node.type === JSXELEMENT; });
    return jsxNodes;
}
function getChildrenComponents(jsxNodes, importNodes) {
    var components = [];
    var regex = /[a-zA-Z]+(.jsx|.js)/;
    var importValues = importNodes.map(function (node) { return node.source.value; });
    var componentPaths = importValues.filter(function (str) { return regex.test(str) === true; });
    var cache = {};
    for (var _i = 0, componentPaths_1 = componentPaths; _i < componentPaths_1.length; _i++) {
        var str = componentPaths_1[_i];
        var splitName = str.split('/');
        var componentPath = splitName[splitName.length - 1];
        var name_1 = componentPath.split('.')[0];
        cache[name_1] = str;
    }
    console.log('Cache', cache);
    // importValues = ['./Children.jsx', 'react', 'react-router-dom']
    for (var _a = 0, jsxNodes_1 = jsxNodes; _a < jsxNodes_1.length; _a++) {
        var node = jsxNodes_1[_a];
        var firstChar = node.openingElement.name.name[0]; // actual name label (i.e. 'Chatroom', 'Component')
        var componentName = node.openingElement.name.name;
        if (firstChar === firstChar.toUpperCase()) {
            var props = getProps(node);
            // --- OLD ---
            // check componentName against importNodes
            // if name matches import node name, take filepath
            // recursively invoke parsing algo on file
            // let children: Array<ComponentNode> = [];
            // if (cache[`${componentName}`]) {
            // children = main(cache[`${componentName}`]);
            // }
            // const componentNode = new ComponentNode(componentName, props, children);
            // --- OLD ---
            // --- NEW ---
            // need to pass message?
            // or somehow do all logic in extension.ts
            var componentNode = new ComponentNode(componentName, props, []);
            // --- NEW ---
            components.push(componentNode);
        }
    }
    return components;
}
function getPropValue(node) {
    if (Object.keys(node).includes('expression')) {
        return node.expression.value; // look into the value (node) and find the expression 
    }
    else {
        return node.value; // return the value 
    }
}
function getProps(node) {
    var propObj = {};
    for (var _i = 0, _a = node.openingElement.attributes; _i < _a.length; _i++) {
        var prop = _a[_i];
        var name_2 = prop.name.name;
        propObj[name_2] = getPropValue(prop.value);
        // console.log('propObj', propObj);
    }
    // console.log(propArr);
    return propObj;
}
function main(arr) {
    // console.log(filePath);
    // const tree = getTree(filePath);
    console.log('IN MAIN: ', arr);
    var importNodes = getImportNodes(arr);
    var variableNodes = getVariableNodes(arr);
    var childrenNodes = getChildrenNodes(variableNodes);
    var jsxNodes = getJsxNodes(childrenNodes);
    var result = getChildrenComponents(jsxNodes, importNodes);
    // console.log(result);
    return result;
}
