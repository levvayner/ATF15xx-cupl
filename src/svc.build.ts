import * as vscode from 'vscode';
import { WorkingData } from './types';
import { setWorkingFileData } from './svc.deploy';
import { ATF15xxProjectTreeItem, projectFileProvider } from './explorer/projectFilesProvider';
import { copyToLinux, copyToWindows} from './explorer/fileFunctions';
import { Command, atfOutputChannel } from './os/command';

export async function registerCompileProjectCommand(compileProjectCommandName: string, context: vscode.ExtensionContext) {
	
	const cmdCompileProjectHandler = async (treeItem: ATF15xxProjectTreeItem) => {

        const pldFiles = await vscode.workspace.findFiles('**.PLD');
		let workingFile = new WorkingData();
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

			workingFile = setWorkingFileData(selectProjectWindowResponse);
			
			if(!selectProjectWindowResponse || selectProjectWindowResponse?.length === 0 ){
				vscode.window.showErrorMessage('No project selected to deploy');
				return;
			}
			buildProject(workingFile);
			
		} else{
			//run update
			workingFile = setWorkingFileData(treeItem.file ?? pldFiles[0].path);
			buildProject(workingFile);
		}		
		projectFileProvider.refresh();	
	};
	await context.subscriptions.push(vscode.commands.registerCommand(compileProjectCommandName,cmdCompileProjectHandler));
}

export async function buildProject(pldData: WorkingData){
	if(pldData.projectName.length <= 0 ){
		vscode.window.showErrorMessage(`PLD File format is incorrect. Expected /home/user/project/file.PLD. found ${pldData.wokringFileUri}`);
		return;
	}
	//copy to working folder
	const cpToWinResponse = await copyToWindows(pldData.wokringFileUri);
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
	vscode.window.setStatusBarMessage('Updating project ' + pldData.projectName, 5000);
    const cmdString = `wine "${cuplWindowsBinPath}" -m1lxfjnabe -u "${cuplWindowsDLPath}cupl.dl" "${workingWindowsFolder}\\${pldData.wokringFile}"`; 
	
	//execute build command
    const result = await cmd.runCommand('ATF1504 Build', `${workingLinuxFolder}`, cmdString);

	if(result.responseCode !== 0){
		vscode.window.setStatusBarMessage('Failed to build: ' + pldData.workingFileNameWithoutExtension + '. ' +result.responseError);
		atfOutputChannel.appendLine('Failed to build: ' + pldData.workingFileNameWithoutExtension + '. ' +result.responseError);
		//vscode.window.showErrorMessage(`Error executing\n${result.responseText}\n`); //** ERROR OCCURED **\n${result.responseError}`);
		return;
	}
	//copy results back
	copyToLinux(`${pldData.wokringFile.replace('.PLD', '.jed')}`,`${pldData.projectPath}/build/`);
	
	// const cmdCopyFilesFromWorkingFolder = `mkdir -p "${pldData.projectPath + '/build/'}" && cp -fR  ${destPath}`;
	// await runCommand('ATF1504 Build', pldData.projectPath, cmdCopyFilesFromWorkingFolder);

	projectFileProvider.refresh();
	//vscode.window.setStatusBarMessage('Compiled ' + pldData.workingFileNameWithoutExtension + 'to ' + destPath);
	vscode.window.setStatusBarMessage('Compiled ' + pldData.workingFileNameWithoutExtension);
	
		
    
    	
	
}
