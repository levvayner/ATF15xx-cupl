// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { registerDeployJedCommand } from './svc.deploy';
import { registerCloseProjectCommand, registerConfigureProjectCommand, registerCreateProjectCommand, registerDeleteFileCommand, registerOpenProjectCommand } from './svc.project';
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
	console.log('Activating VS VS Programmer extension');
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
	
	vscode.window.registerTreeDataProvider('VS-Cupl-project-files', projectFileProvider);	
	
	await registerDeploySvfCommand('VS-Cupl.deploySVF', context);
	await registerCreateProjectCommand('VS-Cupl.createProject', context);
	await registerConfigureProjectCommand('VS-Cupl.configureProject', context);
	await registerOpenProjectCommand('VS-Cupl.openProject', context);
	await registerCloseProjectCommand('VS-Cupl.closeProject', context);
	await registerCompileProjectCommand('VS-Cupl.compileProject', context);
	await registerDeleteFileCommand('VS-Cupl-project-files.deleteEntry', context);
	await registerDeployJedCommand('VS-Cupl.deployJED', context);
	await registerISPCommand('VS-Cupl.runISP', context);
	await registerMiniProCommand('VS-Cupl.runMiniPro', context);
		
	

	await registerCheckPrerequisite('VS-Cupl.checkPrerequisite', context);
	
	//do not await
	vscode.commands.executeCommand('VS-Cupl.checkPrerequisite');

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




