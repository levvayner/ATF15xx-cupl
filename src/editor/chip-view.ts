import * as vscode from 'vscode';
import { Pin, PinConfiguration, getDevicePins } from '../devices/pin-configurations';
import { Project } from '../types';
import { ProjectFilesProvider } from '../explorer/project-files-provider';
import { stateProjects } from '../state.projects';
import { atfOutputChannel } from '../os/command';
import { PinViewProvider, providerPinView } from './pin-view';
/*
Custom pin layout viewer

*/
export let providerChipView: ChipViewProvider;

export function registerChipViewPanelProvider(context: vscode.ExtensionContext) {
    
    providerChipView = new ChipViewProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(ChipViewProvider.viewType, providerChipView));

    context.subscriptions.push(
        vscode.commands.registerCommand('vs-cupl.showChipView', () => {
            providerChipView.show();
        }));
  
    const prj = stateProjects.openProjects[0];
    if(prj){
        providerChipView.openProjectChipView(prj);
    }
   
    vscode.workspace.onDidOpenTextDocument(providerChipView.checkIfChipIsNeeded);
    
}

export class ChipViewProvider implements vscode.WebviewViewProvider {
    
    show() {
        this._view?.show();
    }

	public static readonly viewType = 'vs-cupl.chip-view';

	private _view?: vscode.WebviewView;

	constructor(
		private readonly _extensionUri: vscode.Uri,
	) {
        
     }

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		this._view = webviewView;

		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,

			localResourceRoots: [
				this._extensionUri
			]
		};

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(message => {
            if(message.type='selectPin'){
                console.log(`[Chip View] selected pin ` + message.pin.id);
                providerPinView.selectPin(message.pin.id);
            }
        });

	}

	public setDevice(device: PinConfiguration | undefined) {
		if (this._view) {
			this._view.show?.(true); 
            if(device === undefined){
                this._view.webview.postMessage({type:'clearDevice'});
            }else {
                this._view.webview.postMessage({ type: 'setDevice', device: device });
                providerPinView.setPins(device);
            }
		}
        
	}

	public selectPin(pin: Pin) {
		if (this._view) {
			this._view.show?.(true); 
			this._view.webview.postMessage({ type: 'selectPin', pin: pin });
		}
	}

    public openProjectChipView(project: Project | undefined){
        if(project === undefined){
            this.setDevice(undefined);
            return;
        }
        if(project.device && project.device.pinConfiguration){
            const pins = getDevicePins(project.device.pinConfiguration,project.device.pinCount, project.device.packageType);
            if(pins)
            {
                this.setDevice(pins);
            }else{
                atfOutputChannel.appendLine(`No Device pin map found for device ${project.device.pinConfiguration} with ${project.device.pinCount} pins in a ${project.device.packageType} package.`);
            }
        }
    }

    async checkIfChipIsNeeded(e: vscode.TextDocument) {
        if(!(e.fileName.endsWith('prj') || e.fileName.endsWith('.pld'))){
            return;
        }
        const project = await Project.openProject(vscode.Uri.file(e.fileName));
        if(project === undefined || !project.deviceName){
            return;
        }
        if(project.devicePins === undefined){
            return;
        }
        providerChipView.setDevice(project.devicePins);
    
    }

	private _getHtmlForWebview(webview: vscode.Webview) {
		// Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'assets', 'js',  'script.js'));

		// Do the same for the stylesheet.
		const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri,'assets', 'css', 'reset.css'));
		const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'assets', 'css', 'vscode.css'));
		const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'assets', 'css',  'style.css'));

		// Use a nonce to only allow a specific script to be run.
		const nonce = getNonce();

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
					Use a content security policy to only allow loading styles from our extension directory,
					and only allow scripts that have a specific nonce.
					(See the 'webview-sample' extension sample for img-src content security policy examples)
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
				<link href="${styleMainUri}" rel="stylesheet">

				<title>Chip View</title>
			</head>
			<body>
				<canvas id='ic' width="800" height="500"></canvas>

				
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
	}
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
