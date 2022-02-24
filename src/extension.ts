// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { MidnightProvider } from './MidnightProvider';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from './parser.js';

export function activate(context: vscode.ExtensionContext) {
	
	console.log('Congratulations, your extension "midnight" is now active!');

	const provider = new MidnightProvider(context);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider('midnight.sidebarView', provider)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('midnight.test', () => {
			console.log('test command');
	}));
	
	// function test(newState: object) {
	// 	if (this._view) {
	// 		this._view.webview.postMessage({ test: "NEW STATE", tree: newState });
	// 	}
	// }

	let disposable = vscode.commands.registerCommand('midnight.helloWorld', () => {
		// TODO: need to do recursion here
		const tree = parse(fs.readFileSync(path.resolve(__dirname, './examples/App.jsx')));
		// iterate through tree
		// if node has children, push nodes into array <- recursion
		console.log('from disposable: ', tree);
		provider.testMsg(tree);
		console.log('disposed');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
	console.log('deactivated');
}

// function getWebviewContent(cat: keyof typeof cats) {
//   return `<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Cat Coding</title>
// </head>
// <body>
// 	<img src="${cats[cat]}" width="300" />
// </body>
// </html>`;
// }