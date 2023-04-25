import * as vscode from 'vscode';
import { VSProjectTreeItem, projectFileProvider } from './explorer/projectFilesProvider';
import { copyToLinux, copyToWindows} from './explorer/fileFunctions';
import { Command, atfOutputChannel } from './os/command';
import { Project } from './types';
import { getOSCharSeperator, isWindows } from './os/platform';
import { projectFromTreeItem } from './svc.project';

export async function registerCompileProjectCommand(compileProjectCommandName: string, context: vscode.ExtensionContext) {
	
	const cmdCompileProjectHandler = async (treeItem: VSProjectTreeItem | vscode.Uri) => {
		const project = await projectFromTreeItem(treeItem);
		
		if(!project){
			atfOutputChannel.appendLine(`Failed to deploy JEDEC file. Unable to read project information`);
			return;
		}
		const label =  treeItem instanceof(VSProjectTreeItem) ? treeItem.label : treeItem.fsPath;
        const pldFiles = await vscode.workspace.findFiles(`**${project.pldFilePath.path.replace(project.projectPath.path,'')}`);
		//vscode.window.showInformationMessage('Calling compile project with uri ' + treeItem.label);

		if(pldFiles === undefined){
			vscode.window.showErrorMessage('No PLD Files found to build');
			return;
		}
		//get pld file opened
		if(pldFiles.length > 1 && !label.toLowerCase().includes('.pld')){
			var selectProjectWindowResponse = await vscode.window.showQuickPick(
				pldFiles.map( ru => ru.path),{
					canPickMany: false,
					title: 'Select PLD File to compile',
					placeHolder: label					
				}
			);
			if(selectProjectWindowResponse === undefined){
				vscode.window.setStatusBarMessage('Did not select a PLD file',5000);
				return;
			}

			
			
			if(!selectProjectWindowResponse || selectProjectWindowResponse?.length === 0 ){
				vscode.window.showErrorMessage('No project selected to deploy');
				return;
			}
		}	
		await buildProject(project);
		await projectFileProvider.refresh();	
	};
	await context.subscriptions.push(vscode.commands.registerCommand(compileProjectCommandName,cmdCompileProjectHandler));
}

export async function buildProject(project: Project){
	
	let cmdString = '';
	const cmd = new Command();
	const cuplWindowsBinPath = projectFileProvider.cuplBinPath.replace(projectFileProvider.wineBaseFolder, projectFileProvider.winBaseFolder).replace(/\//gi,'\\');
	const cuplWindowsDLPath = cuplWindowsBinPath.substring(0,cuplWindowsBinPath.lastIndexOf('\\') + 1);
		

	//copy to working folder
	if(!isWindows()){
		const cpToWinResponse = await copyToWindows(project.pldFilePath.path);
		if(cpToWinResponse.responseCode !== 0){
			return;
		}
		// 
		const workingLinuxFolder = projectFileProvider.wineBaseFolder + getOSCharSeperator() + projectFileProvider.winTempPath;
		const workingWindowsFolder = projectFileProvider.winBaseFolder + projectFileProvider.winTempPath;
		
		

		//run cupl
		vscode.window.setStatusBarMessage('Updating project ' + project.projectName, 5000);
		cmdString = `wine "${cuplWindowsBinPath}" -m1lxfjnabe -u "${cuplWindowsDLPath}cupl.dl" "${project.windowsPldFilePath}"`; 
		
		//execute build command
		// const result = await cmd.runCommand('vs-cupl Build', `${workingLinuxFolder}`, cmdString);
		
	}

	else {		
		cmdString = `"${cuplWindowsBinPath}" -m1lxfjnabe -u "${cuplWindowsDLPath}cupl.dl" "${project.pldFilePath.fsPath}"`; 
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
		project.jedFilePath.fsPath.substring(project.jedFilePath.fsPath.lastIndexOf(getOSCharSeperator()));

		await copyToLinux(`${fileName }`,`${project.projectPath.fsPath}`);
	}
	await projectFileProvider.refresh();
	vscode.window.setStatusBarMessage('Compiled ' +  project.projectName, 2000);
		
    
    	
	
}
