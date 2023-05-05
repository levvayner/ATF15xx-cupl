import * as vscode from 'vscode';
import { ProjectFilesProvider } from './explorer/project-files-provider';
import { Command, atfOutputChannel } from './os/command';
import { Project } from './project';
import { uiIntentSelectTextFromArray } from './ui.interactions';
import { isWindows } from './os/platform';
import { stateProjects } from './state.projects';


let lastKnownPath = '';

export async function registerMiniProCommand(runMiniProCommandName: string, context: vscode.ExtensionContext) {
	
	const cmdRegisterMiniProHandler = async () => {

        const jed = await vscode.workspace.findFiles('**build/**.jed');
		const chnFiles = await vscode.workspace.findFiles('**.chn');
		
		if(jed === undefined){
			vscode.window.showErrorMessage('No JEDEC Files found to convert. Build Project');
			return;
		}
		
		let jedPath = '';
		//get jed file opened
		if(jed.length > 1){
			var selectProjectWindowResponse = await vscode.window.showQuickPick(
				jed.map( ru => ru.fsPath),{
					canPickMany: false,
					title: 'Select jed File to compile'
				}
			);
			if(selectProjectWindowResponse === undefined){
				vscode.window.setStatusBarMessage('Did not select a jed file',5000);
				return;
			}
			jedPath = selectProjectWindowResponse;

			
		} else{
			jedPath = jed[0].fsPath;
		}	

		const project = stateProjects.openProjects.find(p => p.jedFilePath.fsPath === selectProjectWindowResponse);
		if(!project){
			atfOutputChannel.appendLine(`Failed to find requiested file ${selectProjectWindowResponse} in open projects`);
			return;
		}
		await runMiniPro(project);
		
		const projectFileProvider = await ProjectFilesProvider.instance();
		await projectFileProvider.refresh();
	};
	await context.subscriptions.push(vscode.commands.registerCommand(runMiniProCommandName,cmdRegisterMiniProHandler));
}

export async function runMiniPro(project: Project){	
	try{
		const command = new Command();
		const projectFileProvider = await ProjectFilesProvider.instance();
		//TODO: verify deviec name from minipro list before deploying
		// start with full name, take away letters until at least one shows up
		let srchString = project.deviceName;
		if(!srchString){
			atfOutputChannel.appendLine('Failed to deploy using mini pro. Failed to read device name');
			return;
		}
		let cmdString = `minipro -t `; 
		const miniProFound =  await command.runCommand('vs-cupl Build', project.projectPath.fsPath, cmdString);
		if(miniProFound.responseCode !== 0){
			if(miniProFound.responseError.message.indexOf('No programmer found') >= 0){
				atfOutputChannel.appendLine('No Minipro device found. Check your connection to your TL866+ programmer');				
			}
			return;
		}
		
		let found = false;
		cmdString = '';
		var selectedDeviceName: string | undefined = undefined;	
		while(srchString.length > 0 && !found){
			cmdString = (isWindows() ? `minipro --logicic ${projectFileProvider.miniproPath}\\logicic.xml --infoic ${projectFileProvider.miniproPath}\\infoic.xml -L ${srchString}` : `minipro -L ${srchString}`); 		
			const devices = await command.runCommand('vs-cupl Build', project.projectPath.fsPath, cmdString);
			if(devices.responseText.length === 0){
				srchString = srchString.substring(0,srchString.length - 1);
				continue;
			}
			selectedDeviceName = await uiIntentSelectTextFromArray(devices.responseText.split('\n'));
			if(!selectedDeviceName || selectedDeviceName.length === 0){
				srchString = srchString.substring(0,srchString.length - 1);
				continue;
			}
			found = true;
	
		}
		if(!selectedDeviceName){
			atfOutputChannel.appendLine('Failed to deploy using mini pro. Failed to find device by this name: ' + project.deviceName);
			return;
		}
		//remove extra characters in name, but not found
		if(selectedDeviceName.indexOf('(') > 0){
			selectedDeviceName = selectedDeviceName.substring(0, selectedDeviceName.indexOf('('));
		}
		
		
		//execute		
		atfOutputChannel.appendLine('Uploading using MiniPro ' + project.projectName);		
		cmdString = `minipro ${isWindows() ? '--logicic ' + projectFileProvider.miniproPath + '\logicic.xml --infoic ' + projectFileProvider.miniproPath + '\infoic.xml' : ''} -p "${selectedDeviceName /* project.deviceName */}" -w "${project.jedFilePath.fsPath}"  2>&1 | tee`; 		
		const resp = await command.runCommand('vs-cupl Build', project.projectPath.fsPath, cmdString);
		if(resp.responseCode !== 0){
			atfOutputChannel.appendLine('Error occured calling minipro:' + resp.responseError + ' : ' + resp.responseText);
			vscode.window.setStatusBarMessage('Failed to upload ' + project.projectName, 5000);	
			return;
		}
		if(resp.responseText.includes('Warning!')){
			atfOutputChannel.appendLine('Done Uploading using minipro [WITH WARNINGS]:' + resp.responseText.split('\n').filter(l => l.includes('Warning!')).join('\n'));
		}else{
			atfOutputChannel.appendLine('Done Uploading using minipro:' + resp.responseText);
		}
		
		

		vscode.window.setStatusBarMessage('Done Uploading ' + project.projectName, 5000);	
		return resp;
		
	} catch(err: any){
		atfOutputChannel.appendLine('Critical Error running MiniPro:' + err.message);
	}
	
	//await projectFileProvider.refresh();
}
