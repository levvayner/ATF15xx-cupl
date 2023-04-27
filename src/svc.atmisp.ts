import * as vscode from 'vscode';
import { ProjectFilesProvider, VSProjectTreeItem } from './explorer/project-files-provider';
import { copyToWindows } from './explorer/fileFunctions';
import { Command, atfOutputChannel } from './os/command';
import { TextEncoder } from 'util';
import { Project } from './types';
import { isWindows } from './os/platform';
import { updateChn } from './explorer/project-file-functions';
import { projectFromTreeItem } from './svc.project';


let lastKnownPath = '';


export async function registerISPCommand(runISPCommandName: string, context: vscode.ExtensionContext) {
	
	const cmdRegisterISPHandler = async (treeItem: VSProjectTreeItem | vscode.Uri) => {
		const project = await projectFromTreeItem(treeItem);
		if(!project){
			atfOutputChannel.appendLine(`Failed to deploy JEDEC file. Unable to read project information`);
			return;
		}
		
		
		await runISP(project);
		await (await ProjectFilesProvider.instance()).refresh();
		        
		
	};
	await context.subscriptions.push(vscode.commands.registerCommand(runISPCommandName,cmdRegisterISPHandler));
}

export async function runISP(project: Project){
	// jed and cnh files come from project config.
	// create new ones if needed
	if(project.projectName.length <= 0 ){
		vscode.window.showErrorMessage(`PLD File format is incorrect. Expected /home/user/project/build/file.jed. found ${project.jedFilePath}`);
		return;
	}
	try{
		const command = new Command();
		//copy to windows
		//copy to working folder
		if(!isWindows()){
			const cpWorkingResponse = await copyToWindows(project.jedFilePath.fsPath);
			if(cpWorkingResponse.responseCode !== 0){
				return;
			}
		}
		
		await updateChn(project);
		
		
		atfOutputChannel.appendLine('Updating project ' + project.projectName);		
		

		if(!isWindows()){
			const cpBuildResponse = await copyToWindows(project.chnFilePath.path);
			if(cpBuildResponse.responseCode !== 0){
				return;
			}
			//execute		
			const cmdString = `wine "${(await ProjectFilesProvider.instance()).atmIspBinPath}" "${project.windowsChnFilePath}"`; 
			const commandResponse = await command.runCommand('vs-cupl Build', undefined, cmdString);

			if(commandResponse.responseCode !== 0){
				atfOutputChannel.appendLine(`Failed to execute ATMISP: ${commandResponse.responseError}`);
				return;
			}
		} else{
			//execute		
			const cmdString = `"${(await ProjectFilesProvider.instance()).atmIspBinPath}" "${project.chnFilePath.fsPath}"`; 
			const commandResponse = await command.runCommand('vs-cupl Build', project.projectPath.fsPath, cmdString);

			if(commandResponse.responseCode !== 0){
				atfOutputChannel.appendLine(`Failed to execute ATMISP: ${commandResponse.responseError}`);
				return;
			}			
		}
		

		if(!isWindows()){
			const copyCmd = `find ./ -maxdepth 1 -mmin -2 -type f -name "*.svf" -exec cp "{}" ${project.svfFilePath.fsPath} \\;`;
			const commandCopyToLinuxResult = await command.runCommand('vs-cupl Build', (await ProjectFilesProvider.instance()).workingLinuxFolder,copyCmd);
			if(commandCopyToLinuxResult.responseCode !== 0){
				atfOutputChannel.appendLine(`Failed to execute ATMISP: ${commandCopyToLinuxResult.responseError}`);
				return;
			}
			
		}


		//check svf file
		const date = new Date();
		const updatedSVF = (await vscode.workspace.fs.stat(project.svfFilePath)).mtime > date.setTime(date.getTime() - (1000));
		
		atfOutputChannel.appendLine( updatedSVF ? 
			'** Built SVF file successfully  ** ' : 
			'** Failed to build SVF file **'
		);
		
	} catch(err: any){
		atfOutputChannel.appendLine('Critical Error running ISP:' + err.message);
		return;
	}
	
	
		
	await (await ProjectFilesProvider.instance()).refresh();
}
