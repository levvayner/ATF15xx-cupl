import * as vscode from 'vscode';
import { Pin, PinConfiguration, PinType, getDevicePins } from '../devices/pin-configurations';
import { Project } from '../types';
import { ProjectFilesProvider } from '../explorer/project-files-provider';
import { stateProjects } from '../state.projects';
import { atfOutputChannel } from '../os/command';
import { PinViewProvider, providerPinView } from './pin-view';
import path = require('path');
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
  
    // const prj = stateProjects.openProjects[0];
    // if(prj){
    //     providerChipView.openProjectChipView(prj);
    // }
   
	context.subscriptions.push(
		vscode.window.onDidChangeActiveColorTheme(providerChipView.updateThemeColors)
	);
    vscode.workspace.onDidOpenTextDocument(providerChipView.checkIfChipIsNeededForDocument);
    vscode.workspace.onDidChangeWorkspaceFolders(providerChipView.checkIfChipIsNeededForWorkspaceFolder);
    vscode.window.onDidChangeActiveTextEditor(providerChipView.checkIfChipIsNeededForTextEditor);
    
}

export class ChipViewProvider implements vscode.WebviewViewProvider {
    
    show() {
        this._view?.show();
    }

	public static readonly viewType = 'vs-cupl.chip-view';

	private _view?: vscode.WebviewView;
	private _colors:{type: string, color: string   } [] = [];
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
			
            if(message.type==='selectPin'){
                console.log(`[Chip View] selected pin ` + message.pin.id);
                providerPinView.selectPin(message.pin.id);
				return;
            }
            if(message.type==='addPin'){
				const isPldFile = vscode.window.activeTextEditor?.document.fileName.endsWith('.pld');
				if(!isPldFile){
					return;// nothing to add here
				}
				const pinDeclarations = vscode.window.activeTextEditor?.document.getText().split('\n').filter(d => d.trim().toUpperCase().startsWith('PIN '));
				const declaration = pinDeclarations !== undefined && pinDeclarations.find(pd => pd.split(' ')[1] === message.pin.id.toFixed(0));
                console.log(`[Chip View] selected pin ` + message.pin.id);
				if(!vscode.window.activeTextEditor){
					return;
				}
				if(declaration){
					const lineNo = vscode.window.activeTextEditor?.document.getText().split('\n')?.indexOf(declaration);
					let charIdxStart = declaration.lastIndexOf('=') + 1;
					if(declaration[charIdxStart] === ' '){
						charIdxStart++;
					}
					let charIdxEnd = declaration.indexOf(';') - 1;
					vscode.window.activeTextEditor.selection = new vscode.Selection({line: lineNo, character: charIdxStart} as vscode.Position,{line: lineNo, character: charIdxEnd} as vscode.Position);
										
					return;
				}
                const cursorLocation = vscode.window.activeTextEditor.selection.start;
				if(cursorLocation === undefined){
					return;
				}
				const line = vscode.window.activeTextEditor.document.lineAt(cursorLocation.line);
				if(!line){
					return;
				}
				let typeNames = ''; 
				message.pin.type.forEach((t: any) => {
						typeNames += t + ' ';
					
				});
				typeNames = typeNames.trim().toUpperCase();
				if(typeNames === 'NC' || typeNames === 'VCC' || typeNames === 'GND'){
					return; // no need to add NC, VCC, GND pins
				}
				const insertStr = `PIN ${message.pin.id} = ; /* PIN TYPES: ${typeNames} */\n`;
				const locDropCursor = insertStr.indexOf(';');
				if(cursorLocation.character > line.firstNonWhitespaceCharacterIndex){
					//insert on next line
					vscode.window.activeTextEditor?.edit(ed => {
						const pos = {line: cursorLocation.line+1, character: locDropCursor + line.firstNonWhitespaceCharacterIndex} as vscode.Position;
						ed.insert({line: cursorLocation.line+1, character: line.firstNonWhitespaceCharacterIndex} as vscode.Position, insertStr );
						if(vscode.window.activeTextEditor)
						{
							vscode.window.activeTextEditor.selection = new vscode.Selection(pos, pos);
						}
					});
					//vscode.window.activeTextEditor?.insertSnippet(new vscode.SnippetString( `PIN ${message.pin.id} = ; /* PIN TYPES: ${typeNames} */`),);
				} else{
					vscode.window.activeTextEditor?.insertSnippet(new vscode.SnippetString(insertStr));
					if(vscode.window.activeTextEditor)
					{
						vscode.window.activeTextEditor.selection = new vscode.Selection({line: cursorLocation.line, character: locDropCursor + line.firstNonWhitespaceCharacterIndex} as vscode.Position,{line: cursorLocation.line, character: locDropCursor + line.firstNonWhitespaceCharacterIndex} as vscode.Position);
					}
				}
                
				return;
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
	public get colors(){
		return this._colors;
	}

	public setColors(theme: vscode.ColorTheme | undefined= undefined) {
		
		const themeKind = theme === undefined ? 
			vscode.window.activeColorTheme.kind :
			theme.kind;

		this._colors = [];
		switch(themeKind){
			case vscode.ColorThemeKind.Dark:

				this._colors.push({type: 'foreground',color:'#cee'});
				this._colors.push({type: 'background',color:'#233'});
				this._colors.push({type: 'accent1',color:'#eef'});
				this._colors.push({type: 'accent2',color:'#bcb'});
				this._colors.push({type: 'accent3',color:'#ace'});
				this._colors.push({type: 'pinGND',color:'#333'});
				this._colors.push({type: 'pinVCC',color:'#F22'});
				this._colors.push({type: 'pinIN',color:'#22A'});
				this._colors.push({type: 'pinINOUT',color:'#0d9292'});
				this._colors.push({type: 'pinOUT',color:'#2A2'});
				this._colors.push({type: 'pinOE',color:'#C4BF36'});
				this._colors.push({type: 'pinCLR',color:'#C70039'});
				this._colors.push({type: 'pinCLK',color:'#D314F5'});
				this._colors.push({type: 'pinPD',color:'#E815BF'});
				this._colors.push({type: 'pinTCK',color:'#2f5511'});
				this._colors.push({type: 'pinTDI',color:'#204107'});
				this._colors.push({type: 'pinTDO',color:'#19641f'});
				this._colors.push({type: 'pinTMS',color:'#3B8901'});
				this._colors.push({type: 'pinNC',color:'#999'});
				break;

			case vscode.ColorThemeKind.Light:
				this._colors.push({type: 'foreground',color:'#333'});
				this._colors.push({type: 'background',color:'#eee'});
				this._colors.push({type: 'accent1',color:'#669'});
				this._colors.push({type: 'accent2',color:'#89a'});

				this._colors.push({type: 'accent3',color:'#438'});
				this._colors.push({type: 'pinGND',color:'#aaa'});
				this._colors.push({type: 'pinVCC',color:'#FF9696'});
				this._colors.push({type: 'pinIN',color:'#ACEDAF'});
				this._colors.push({type: 'pinINOUT',color:'#adFFEF'});
				this._colors.push({type: 'pinOUT',color:'#2A2'});
				this._colors.push({type: 'pinOE',color:'#C9C596'});
				this._colors.push({type: 'pinCLR',color:'#d94099'});
				this._colors.push({type: 'pinCLK',color:'#FA69F5'});
				this._colors.push({type: 'pinPD',color:'#FF75DE'});
				this._colors.push({type: 'pinTCK',color:'#9FB440'});
				this._colors.push({type: 'pinTDI',color:'#90AE8A'});
				this._colors.push({type: 'pinTDO',color:'#AECD4A'});
				this._colors.push({type: 'pinTMS',color:'#9CCA44'});
				this._colors.push({type: 'pinNC',color:'#999'});
				break;

			default:
				this._colors.push({type: 'foreground',color:'#fff'});
				this._colors.push({type: 'background',color:'#000'});
				this._colors.push({type: 'accent1',color:'#eef'});
				this._colors.push({type: 'accent2',color:'#ecc'});
				this._colors.push({type: 'accent3',color:'#ace'});
				this._colors.push({type: 'pinGND',color:'#333'});
				this._colors.push({type: 'pinVCC',color:'#F22'});
				this._colors.push({type: 'pinIN',color:'#22A'});
				this._colors.push({type: 'pinINOUT',color:'#0d9292'});
				this._colors.push({type: 'pinOUT',color:'#2A2'});
				this._colors.push({type: 'pinOE',color:'#C4BF36'});
				this._colors.push({type: 'pinCLR',color:'#C70039'});
				this._colors.push({type: 'pinCLK',color:'#D314F5'});
				this._colors.push({type: 'pinPD',color:'#E815BF'});
				this._colors.push({type: 'pinTCK',color:'#2f5511'});
				this._colors.push({type: 'pinTDI',color:'#204107'});
				this._colors.push({type: 'pinTDO',color:'#19641f'});
				this._colors.push({type: 'pinTMS',color:'#3B8901'});
				this._colors.push({type: 'pinNC',color:'#999'});
				break;
		}
		

		if (this._view) {
			this._view.show?.(true); 
			this._view.webview.postMessage({ type: 'colors', colors: this._colors });
		}
		
	}

    public openProjectChipView(project: Project | undefined){
        if(project === undefined){
			stateProjects.setActiveProject(undefined);
            this.setDevice(undefined);
			this.setColors();
            providerPinView.setPins(undefined);
            return;
        }
        if(project.device && project.device.pinConfiguration){
            const pins = getDevicePins(project.device.pinConfiguration,project.device.pinCount, project.device.packageType);
            if(pins)
            {
				stateProjects.setActiveProject(project);
                this.setDevice(pins);				
				this.setColors();
                providerPinView.setPins(pins);
				providerPinView.setColors(this._colors);
            }else{
                atfOutputChannel.appendLine(`No Device pin map found for device ${project.device.pinConfiguration} with ${project.device.pinCount} pins in a ${project.device.packageType} package.`);
            }
        }
    }

    async checkIfChipIsNeededForDocument(e: vscode.TextDocument) {
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
		providerChipView.setColors();
        providerChipView.setDevice(project.devicePins);
		providerPinView.setPins(project.devicePins);
		providerPinView.setColors(this._colors);
    
    }

    checkIfChipIsNeededForWorkspaceFolder(workspaceFolderEvent: vscode.WorkspaceFoldersChangeEvent) {
        if(workspaceFolderEvent.added && workspaceFolderEvent.added.length > 0){
            const project = stateProjects.openProjects.find(p => p.projectPath === workspaceFolderEvent.added[0].uri);
            if(project === undefined){
                return;
            }
			stateProjects.setActiveProject(project);
            this.setDevice(project.devicePins);
			this.setColors();
			providerPinView.setPins(project.devicePins);
			providerPinView.setColors(this._colors);
        }
        if(workspaceFolderEvent.removed && workspaceFolderEvent.removed.length > 0){
            const project = stateProjects.openProjects.find(p => p.projectPath === workspaceFolderEvent.removed[0].uri);
            if(project === undefined){
                return;
            }
            //TODO: check if selected chip view is of this project
			stateProjects.setActiveProject(project);
            this.setDevice(undefined);
			this.setColors();
			providerPinView.setPins(project.devicePins);
			providerPinView.setColors(this._colors);
        }
    }

    async checkIfChipIsNeededForTextEditor(editor: vscode.TextEditor | undefined) {
        if(editor === undefined){
			stateProjects.setActiveProject(undefined);
            providerChipView.setDevice(undefined);
			providerChipView.setColors();			
            return;
        }
        if(editor.document.fileName.endsWith('.prj') ||editor.document.fileName.endsWith('.pld') ){
            //const project = stateProjects.openProjects.find(p => p.projectPath.fsPath === editor.document.fileName.substring(editor.document.fileName.lastIndexOf(path.sep)));
            const project = await Project.openProject(vscode.Uri.file(editor.document.fileName));
			stateProjects.setActiveProject(project);
            providerChipView.setDevice(project?.devicePins);
			providerChipView.setColors();
			providerPinView.setPins(project.devicePins);
			providerPinView.setColors(this._colors);
        }
    }

	private _getHtmlForWebview(webview: vscode.Webview) {
		// Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'assets', 'js',  'script.js'));

		// Do the same for the stylesheet.
		const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri,'assets', 'css', 'reset.css'));
		const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'assets', 'css', 'vscode.css'));
		const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'assets', 'css',  'style.css'));

		
		this.setColors();

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

	public updateThemeColors(e: vscode.ColorTheme) {
		providerChipView.setColors(e);
		providerPinView.setColors(providerChipView.colors);
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


