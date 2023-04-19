// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { registerDeployJedCommand } from './svc.deploy';
import { registerCloseProjectCommand, registerCreateProjectCommand, registerDeleteFileCommand, registerOpenProjectCommand } from './svc.project';
import { registerCompileProjectCommand } from './svc.build';
import { registerDeploySvfCommand, registerISPCommand } from './svc.atmisp';
import { ProjectFilesProvider, projectFileProvider } from './explorer/projectFilesProvider';
import { Command } from './os/command';
import { registerCheckPrerequisite } from './explorer/systemFilesValidation';
import path = require('path');
import { registerMiniProCommand } from './svc.minipro';
// import { PldEditorProvider } from './editor/pldEditorProvider.ts.old';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Activating VS ATF15xx Programmer extension');
	ProjectFilesProvider.init();


	const rootPath =
	vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
		? vscode.workspace.workspaceFolders[0].uri.fsPath
		: undefined;
	if(rootPath !== undefined)
	{		
		projectFileProvider.setWorkspace(rootPath[0]);
		vscode.window.setStatusBarMessage('No open folder found!',2000);
	}
	//path of executing extension
	context.extensionPath;
	
	vscode.window.registerTreeDataProvider('atf15xx-project-files', projectFileProvider);	
	
	await registerDeploySvfCommand('ATF15xx-cupl.deploySVF', context);
	await registerCreateProjectCommand('ATF15xx-cupl.createProject', context);
	await registerOpenProjectCommand('ATF15xx-cupl.openProject', context);
	await registerCloseProjectCommand('ATF15xx-cupl.closeProject', context);
	await registerCompileProjectCommand('ATF15xx-cupl.compileProject', context);
	await registerDeleteFileCommand('atf15xx-project-files.deleteEntry', context);
	await registerDeployJedCommand('ATF15xx-cupl.deployJED', context);
	await registerISPCommand('ATF15xx-cupl.runISP', context);
	await registerMiniProCommand('ATF15xx-cupl.runMiniPro', context);
		
	

	await registerCheckPrerequisite('ATF15xx-cupl.checkPrerequisite', context);
	
	//do not await
	vscode.commands.executeCommand('ATF15xx-cupl.checkPrerequisite');

	// supportedDevices = new devices();
	// supportedDevices.init(path.join(          
    //   ".",
    //   "src",
    //   "devices",
    //   "device-list.json"));
	// context.subscriptions.push(PldEditorProvider.register(context));
}

// This method is called when your extension is deactivated
export function deactivate() {}




