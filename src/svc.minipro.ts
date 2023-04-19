import * as vscode from 'vscode';
import { projectFileProvider } from './explorer/projectFilesProvider';
import { Command, atfOutputChannel } from './os/command';
import { Project } from './types';


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
				jed.map( ru => ru.path),{
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
			jedPath = jed[0].path;
		}	

		const project = projectFileProvider.openProjects.find(p => p.jedFilePath.path === selectProjectWindowResponse);
		if(!project){
			atfOutputChannel.appendLine(`Failed to find requiested file ${selectProjectWindowResponse} in open projects`);
			return;
		}
		await runMiniPro(project);
		
	// const cpToWinResponseBuild = await copyToWindows(svfData.buildFileUri);
	// if(cpToWinResponseBuild.responseCode !== 0){
	// 	return;
	// }
	await projectFileProvider.refresh();
	};
	await context.subscriptions.push(vscode.commands.registerCommand(runMiniProCommandName,cmdRegisterMiniProHandler));
}

export async function runMiniPro(project: Project){	
	try{
		const command = new Command();
		
		//execute		
		vscode.window.setStatusBarMessage('Uploading using MiniPro ' + project.projectName, 5000);		
		//const cmdString = `minipro -p ${await project.deviceName()} -w "${project.jedFilePath}"`; 
		const cmdString = `minipro -p TL866II+ -w "${project.jedFilePath}"`; 
		await command.runCommand('ATF1504 Build', project.projectPath.path, cmdString);
		vscode.window.setStatusBarMessage('Done Uploading ' + project.projectName, 5000);	
		
	} catch(err: any){
		atfOutputChannel.appendLine('Critical Error running MiniPro:' + err.message);
	}
	
	//await projectFileProvider.refresh();
}
