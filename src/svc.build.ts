import * as vscode from 'vscode';
import { VSProjectTreeItem, ProjectFilesProvider } from './explorer/project-files-provider';
import { copyToLinux, copyToWindows} from './explorer/fileFunctions';
import { Command, atfOutputChannel } from './os/command';
import { Project } from './types';
import { isWindows } from './os/platform';
import { projectFromTreeItem } from './svc.project';

export async function registerCompileProjectCommand(compileProjectCommandName: string, context: vscode.ExtensionContext) {
	const projectFileProvider = await ProjectFilesProvider.instance();
	const cmdCompileProjectHandler = async (treeItem: VSProjectTreeItem | vscode.Uri) => {
		let project = await projectFromTreeItem(treeItem);
		if(treeItem === undefined && vscode.window.activeTextEditor){
			//try get from active window
			const p = vscode.window.activeTextEditor.document.uri.fsPath;
			project = await Project.openProject(vscode.Uri.parse(p.substring(0, p.lastIndexOf('/'))));
		}
		
		if(!project){
			atfOutputChannel.appendLine(`Failed to deploy JEDEC file. Unable to read project information`);
			return;
		}
		
        const pldFiles = await vscode.workspace.findFiles(`**${project.pldFilePath.path.replace(project.projectPath.path,'')}`);
		
		if(pldFiles === undefined){
			vscode.window.showErrorMessage('No PLD Files found to build');
			return;
		}
		
		await buildProject(project);
		await projectFileProvider.refresh();	
	};
	await context.subscriptions.push(vscode.commands.registerCommand(compileProjectCommandName,cmdCompileProjectHandler));
}

export async function buildProject(project: Project){
	
	let cmdString = '';
	const cmd = new Command();
	const extConfig = vscode.workspace.getConfiguration('vs-cupl'); 
	const projectFileProvider = await ProjectFilesProvider.instance();
	const cuplWindowsBinPath = projectFileProvider.cuplBinPath.replace(projectFileProvider.wineBaseFolder, projectFileProvider.winBaseFolder).replace(/\//gi,'\\');
	const cuplWindowsDLPath = cuplWindowsBinPath.substring(0,cuplWindowsBinPath.lastIndexOf('\\') + 1);
		

	//copy to working folder
	if(!isWindows()){
		const cpToWinResponse = await copyToWindows(project.pldFilePath.path);
		if(cpToWinResponse.responseCode !== 0){
			return;
		}
		// 
		//run cupl
		vscode.window.setStatusBarMessage('Updating project ' + project.projectName, 5000);
		cmdString = `wine "${cuplWindowsBinPath}" -m1lxfjnabe -u "${cuplWindowsDLPath}${extConfig.get('CuplDefinitions')}.dl" "${project.windowsPldFilePath}"`; 		
	}

	else {		
		cmdString = `${cuplWindowsBinPath} -m1lxfjnabe -u "${cuplWindowsDLPath}Atmel.dl" "${project.pldFilePath.fsPath}"`; 
	}
	
	//execute build command
	const result = await cmd.runCommand('vs-cupl Build', `${project.projectPath.fsPath}`, cmdString)
		.then(result => {
			if(result.responseCode !== 0){			
				atfOutputChannel.appendLine('** Failed to build: ** ' + project.projectName + '. ' +result.responseError);
			} else{
				atfOutputChannel.appendLine(`** Built module ** ${project.projectName} successfully`);
			}
		})
		.catch(err => {
			atfOutputChannel.appendLine('** Critical Error! Failed to build: ** ' + project.projectName + '. ' +err.message);
		});		
	
	if(!isWindows()){
		//copy results back
		let fileName = 
		project.jedFilePath.fsPath.substring(project.jedFilePath.fsPath.lastIndexOf('/'));

		await copyToLinux(`${fileName }`,`${project.projectPath.fsPath}`);
	}
	await projectFileProvider.refresh();
	vscode.window.setStatusBarMessage('Compiled ' +  project.projectName, 2000);
		
    
    	
	
}
