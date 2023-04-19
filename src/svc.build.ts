import * as vscode from 'vscode';
import { ATF15xxProjectTreeItem, projectFileProvider } from './explorer/projectFilesProvider';
import { copyToLinux, copyToWindows} from './explorer/fileFunctions';
import { Command, atfOutputChannel } from './os/command';
import { Project } from './types';
import { getOSCharSeperator } from './os/platform';

export async function registerCompileProjectCommand(compileProjectCommandName: string, context: vscode.ExtensionContext) {
	
	const cmdCompileProjectHandler = async (treeItem: ATF15xxProjectTreeItem) => {

        const pldFiles = await vscode.workspace.findFiles(`**${treeItem.project.pldFilePath.path.replace(treeItem.project.projectPath.path,'')}`);
		//vscode.window.showInformationMessage('Calling compile project with uri ' + treeItem.label);

		if(pldFiles === undefined){
			vscode.window.showErrorMessage('No PLD Files found to build');
			return;
		}
		//get pld file opened
		if(pldFiles.length > 1 && !treeItem.label.includes('.PLD')){
			var selectProjectWindowResponse = await vscode.window.showQuickPick(
				pldFiles.map( ru => ru.path),{
					canPickMany: false,
					title: 'Select PLD File to compile',
					placeHolder: treeItem.label
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
		await buildProject(treeItem.project);
		await projectFileProvider.refresh();	
	};
	await context.subscriptions.push(vscode.commands.registerCommand(compileProjectCommandName,cmdCompileProjectHandler));
}

export async function buildProject(project: Project){
	
	//copy to working folder
	const cpToWinResponse = await copyToWindows(project.pldFilePath.path);
	if(cpToWinResponse.responseCode !== 0){
		return;
	}
	// 
	const workingLinuxFolder = projectFileProvider.wineBaseFolder + projectFileProvider.winTempPath;
	const workingWindowsFolder = projectFileProvider.winBaseFolder + projectFileProvider.winTempPath;
	

	const cmd = new Command();
    
	//run cupl
	const cuplWindowsBinPath = projectFileProvider.cuplBinPath.replace(projectFileProvider.wineBaseFolder, projectFileProvider.winBaseFolder).replace(/\//gi,'\\');
	const cuplWindowsDLPath = cuplWindowsBinPath.substring(0,cuplWindowsBinPath.lastIndexOf('\\') + 1);
	vscode.window.setStatusBarMessage('Updating project ' + project.projectName, 5000);
    const cmdString = `wine "${cuplWindowsBinPath}" -m1lxfjnabe -u "${cuplWindowsDLPath}cupl.dl" "${project.windowsPldFilePath}"`; 
	
	//execute build command
    const result = await cmd.runCommand('ATF1504 Build', `${workingLinuxFolder}`, cmdString);

	if(result.responseCode !== 0){
		vscode.window.setStatusBarMessage('Failed to build: ' + project.projectName + '. ' +result.responseError);
		atfOutputChannel.appendLine('Failed to build: ' + project.projectName + '. ' +result.responseError);
		//vscode.window.showErrorMessage(`Error executing\n${result.responseText}\n`); //** ERROR OCCURED **\n${result.responseError}`);
		return;
	}
	//copy results back
	await copyToLinux(`${project.jedFilePath.path.substring(project.jedFilePath.path.lastIndexOf(getOSCharSeperator())) }`,`${project.projectPath.path}`);
	
	await projectFileProvider.refresh();
	vscode.window.setStatusBarMessage('Compiled ' +  project.projectName);
	
		
    
    	
	
}
