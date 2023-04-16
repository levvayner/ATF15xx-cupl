// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { registerDeploySvfCommand } from './svc.deploy';
import { registerCreatePLDFile, registerCreateProjectCommand, registerDeleteFileCommand, registerOpenProjectCommand } from './svc.project';
import { registerCompileProjectCommand } from './svc.build';
import { registerISPCommand } from './svc.atmisp';
import { ProjectFilesProvider, projectFileProvider } from './explorer/projectFilesProvider';
import { Command } from './os/command';
import { registerCheckPrerequisite } from './explorer/systemFilesValidation';
import { PldEditorProvider } from './editor/pldEditorProvider';

// export let wineBaseFolder = '/home/vsadmin/.wine/drive_c/'; //TODO: extract programatically




// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Activating VS ATF15xx Programmer extension');
	const rootPath =
	vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
		? vscode.workspace.workspaceFolders[0].uri.fsPath
		: undefined;
	if(rootPath !== undefined)
	{	ProjectFilesProvider.init(rootPath);
		vscode.window.registerTreeDataProvider('atf15xx-project-files', projectFileProvider);		
	}
	
	await registerDeploySvfCommand('ATF15xx-cupl.deploySVF', context);
	await registerCreateProjectCommand('ATF15xx-cupl.createProject', context);
	await registerOpenProjectCommand('ATF15xx-cupl.openProject', context);
	await registerCreatePLDFile('atf15xx-project-files.addEntry', context);
	await registerCompileProjectCommand('ATF15xx-cupl.compileProject', context);
	await registerDeleteFileCommand('atf15xx-project-files.deleteEntry', context);
	await registerISPCommand('ATF15xx-cupl.runISP', context);
		
	let command = new Command();

	await registerCheckPrerequisite('ATF15xx-cupl.checkPrerequisite', context);
	
	await vscode.commands.executeCommand('ATF15xx-cupl.checkPrerequisite');

	context.subscriptions.push(PldEditorProvider.register(context));
}

// This method is called when your extension is deactivated
export function deactivate() {}




