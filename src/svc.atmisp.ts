import * as vscode from 'vscode';
import { wokringData } from './types';
import { createDeployFile, editLast, setWorkingFileData } from './svc.deploy';
import { projectFileProvider } from './explorer/projectFilesProvider';
import { atmIspTempFolder, copyToWindows, translateToWindowsTempPath, windowsBaseFolder, windowsTempFolder, wineBaseFolder } from './explorer/fileFunctions';
import { Command } from './os/command';
import { TextDecoder, TextEncoder } from 'util';


let lastKnownPath = '';

export async function registerISPCommand(runISPCommandName: string, context: vscode.ExtensionContext) {
	
	const cmdRegisterISPHandler = async () => {

        const pldFiles = await vscode.workspace.findFiles('**build/**.jed');
		const chnFiles = await vscode.workspace.findFiles('**.chn');
		let workingFile = new wokringData();

		if(pldFiles === undefined){
			vscode.window.showErrorMessage('No JEDEC Files found to convert');
			return;
		}
		if(chnFiles === undefined){
			vscode.window.showWarningMessage('No chn file found. Creating new one.');
			
		}
		
		//get pld file opened
		if(pldFiles.length > 1){
			var selectProjectWindowResponse = await vscode.window.showQuickPick(
				pldFiles.map( ru => ru.path),{
					canPickMany: false,
					title: 'Select jed File to compile'
				}
			);
			if(selectProjectWindowResponse === undefined){
				vscode.window.setStatusBarMessage('Did not select a jed file',5000);
				return;
			}

			workingFile = setWorkingFileData(selectProjectWindowResponse, '/build');
			
			if(!selectProjectWindowResponse || selectProjectWindowResponse?.length === 0 ){
				vscode.window.showErrorMessage('No jed file selected to deploy');
				return;
			}
			
		} else{
			//run update
			workingFile = setWorkingFileData(pldFiles[0].path, '/build');
			
		}	
		
		runISP(workingFile);
		
	// const cpToWinResponseBuild = await copyToWindows(svfData.buildFileUri);
	// if(cpToWinResponseBuild.responseCode !== 0){
	// 	return;
	// }
		projectFileProvider.refresh();
	};
	await context.subscriptions.push(vscode.commands.registerCommand(runISPCommandName,cmdRegisterISPHandler));
}

export async function runISP(pldData: wokringData){
	if(pldData.projectName.length <= 0 ){
		vscode.window.showErrorMessage(`PLD File format is incorrect. Expected /home/user/project/build/file.jed. found ${pldData.buildFileName}`);
		return;
	}

	const command = new Command();
	//copy to windows
	//copy to working folder
	const cpWorkingResponse = await copyToWindows(pldData.wokringFileUri);
	if(cpWorkingResponse.responseCode !== 0){
		return;
	}
	const chnData = new wokringData();
	chnData.wokringFile = pldData.wokringFile.replace('.jed','.chn');
	chnData.buildFileName = '';
	chnData.buildFileUri = '';
	chnData.projectName = pldData.projectName;
	chnData.projectPath = pldData.projectPath;
	chnData.wokringFileUri = pldData.wokringFileUri.replace('.jed','.chn');

	const chnText = await vscode.workspace.fs.readFile(vscode.Uri.parse( chnData.wokringFileUri));
	const newTextLines = new TextDecoder().decode(chnText).split('\n').filter(l => l.length > 0);
	const tempFileJEDEC = await translateToWindowsTempPath(pldData.wokringFile);
	const tempFileChn = await translateToWindowsTempPath(chnData.wokringFile);
	
	const foundLine = newTextLines.find(l => l.includes(chnData.projectPath.replace(/\//gi,'\\')) && l.includes(".jed"));
	if(foundLine){
		let retLines = newTextLines.filter(l => l !== foundLine);
		retLines.push(tempFileJEDEC);
		await vscode.workspace.fs.writeFile(vscode.Uri.parse( chnData.wokringFileUri), new TextEncoder().encode(retLines.join('\n')));
	}


	
	const cpBuildResponse = await copyToWindows(chnData.wokringFileUri);
	if(cpBuildResponse.responseCode !== 0){
		return;
	}


	//update jed location in chn file
	
	

	// var atmlWinRelPath = atmIspTempFolder + pldData.projectPath.replace(wineBaseFolder, '').replace(/\//gi,'\\');

    // var atmChnRelPath = atmIspTempFolder + pldData.projectPath.replace(wineBaseFolder, '').replace(/\//gi,'\\');
	let atmIspPath = `${wineBaseFolder}ATMEL_PLS_Tools/ATMISP/ATMISP.exe`; //TODO: extract programatically

	
	vscode.window.setStatusBarMessage('Updating project ' + pldData.projectName, 5000);
    const cmdString = `wine "${atmIspPath}" "${tempFileChn}"`; 
	
	//execute
    await command.runCommand('ATF1504 Build', undefined, cmdString);
    
    // const cmdCopyFiles = `${pldData.projectPath + '/build/' + pldData.workingFileNameWithoutExtension + '.jed'}`;

    // await runCommand('ATF1504 Build', pldData.projectPath, cmdCopyFiles);
		
	
}
