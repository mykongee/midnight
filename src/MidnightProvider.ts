import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { parse } from './parser.js';

export class MidnightProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'midnight.sidebarView';  

  private _view?: vscode.WebviewView;

  constructor(private readonly context: vscode.ExtensionContext){
    console.log('midnight provider constructed');
  }
  private _source: any;

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext<unknown>, 
    token: vscode.CancellationToken)
    : void | Thenable<void> {
    console.log('in resolve webview');
    // this._source = parse('./examples/App.jsx');
    this._source = parse(fs.readFileSync(path.resolve(__dirname, './examples/App.jsx')));
    // console.log('imported from parser: ', this._source); 
    // console.log(__dirname);

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        this.context.extensionUri,
        vscode.Uri.file(path.join(this.context.extensionPath, 'src/scripts')),
        vscode.Uri.file(path.join(this.context.extensionPath, 'src/dist')),
      ]
    };

    this._view = webviewView;
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  };

  public testMsg(newState: object) {
    if (this._view) {
      this._view.webview.postMessage({ test: "NEW STATE", tree: newState });
    }
  }

	private _getHtmlForWebview(webview: vscode.Webview) {
		// Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
		// const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'src/scripts', 'main.js'));
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'src/dist', 'sidebar.js'));

		// Do the same for the stylesheet.
		// const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
		// const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));
		// const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));

		// Use a nonce to only allow a specific script to be run.
		const nonce = getNonce();

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				
				<title>Midnight</title>
			</head>
			<body>
        <div id="root"></div>
        <script nonce="${nonce}" src="${scriptUri}"></script>
        </body>
        </html>`;
      }
    }
    // <button class="add-color-button">Add Color</button>
    
function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
}
	return text;
}  

function parseTest(filePath: string) {
  const source = fs.readFileSync(path.resolve(__dirname, filePath));
  console.log('FROM PARSETEST: ', source);
  // const parsed = JSXPARSER.parse(source, {sourceType: "module"}); 
  // const programBody: Array<any> = parsed.body; // get body of Program Node(i.e. source code entry)
  // console.log(programBody);
  // return programBody;
  return source;
}