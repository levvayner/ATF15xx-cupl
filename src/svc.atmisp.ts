import * as vscode from 'vscode';
import { VSProjectTreeItem, projectFileProvider } from './explorer/projectFilesProvider';
import { copyToLinux, copyToWindows, translateToWindowsTempPath } from './explorer/fileFunctions';
import { Command, atfOutputChannel } from './os/command';
import { TextDecoder, TextEncoder } from 'util';
import { createChn, executeDeploy} from './svc.project';
import { Project } from './types';
import { getOSCharSeperator } from './os/platform';


let lastKnownPath = '';
export async function registerDeploySvfCommand(cmdDeploySvf:  string, context: vscode.ExtensionContext) {
	
	const cmdDeploySvfHandler = async (treeItem: VSProjectTreeItem | undefined) => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		
		if(treeItem){
			await updateDeploySVFScript(treeItem.project);
		}
		//const rootUrl = vscode.workspace.workspaceFolders;
		const svfFiles = await vscode.workspace.findFiles('**.svf');
		
		if(svfFiles === undefined){
			vscode.window.showErrorMessage('No SVF Files found to deploy');
			return;
		}

		let project: Project;
		//get pld file opened
		if(svfFiles.length > 1){
			var selectProjectWindowResponse = await vscode.window.showQuickPick(
				svfFiles.map( ru => ru.path),{
					canPickMany: false,
					title: 'Select Project File to compile'
				}
			);
			if(selectProjectWindowResponse === undefined){
				vscode.window.setStatusBarMessage('Did not select a project file',5000);
				return;
			}

			
			
			if(!selectProjectWindowResponse || selectProjectWindowResponse?.length === 0 ){
				vscode.window.showErrorMessage('No project selected to deploy');
				return;
			}
			project = new Project(selectProjectWindowResponse);			
			
		} else{
			//run update
			project = new Project(svfFiles[0].path);
		}	
		
		await executeDeploy(project);

		await projectFileProvider.refresh();
	};
	await context.subscriptions.push(vscode.commands.registerCommand(cmdDeploySvf, cmdDeploySvfHandler));
	//register channel
	

}

export async function registerISPCommand(runISPCommandName: string, context: vscode.ExtensionContext) {
	
	const cmdRegisterISPHandler = async (treeItem: VSProjectTreeItem) => {

		if(treeItem){
			await runISP(treeItem.project);
			await projectFileProvider.refresh();
		}        
		
	};
	await context.subscriptions.push(vscode.commands.registerCommand(runISPCommandName,cmdRegisterISPHandler));
}

export async function createDeploySVFScript(project: Project){
	const buildFileHeader = `# VS ${await project.deviceName()} Builder file\n`;
	//if first build file	
	await vscode.workspace.fs.writeFile(project.buildFilePath , new TextEncoder().encode(buildFileHeader));
	var d = await vscode.workspace.openTextDocument(project.buildFilePath.path);

	var runDate = new Date();
	var editor = await vscode.window.showTextDocument(d);
	editor.edit(document => {
		const startLine = d.lineCount === 0 ? 0 : 1;
		document.insert(new vscode.Position(startLine,0), `#  Deployment file created at ${runDate.toLocaleString()}\n`);
	});		
}



export async function updateDeploySVFScript(project: Project): Promise<boolean>{
	var d = await vscode.workspace.openTextDocument(project.buildFilePath);
			
	var runDate = new Date();
	var editor = await vscode.window.showTextDocument(d);		
	
			
	var startWritingLineIdx = 0;
	for(startWritingLineIdx; startWritingLineIdx < d.lineCount;startWritingLineIdx++){
		//find last ExecutedOn
		var found = d.lineAt(startWritingLineIdx).text.includes('Executed on');
		if(found){
			break;
		}
	}
	const jtagDeviceName = await project.deviceName();
	var editBuilder = await editor.edit(
		editBuilder => {	
			
			var range = new vscode.Range(new vscode.Position(startWritingLineIdx,0), new vscode.Position(d.lineCount,0));
			//TODO: figure out expeected ids or reading then ahead
			var text = '#  Executed on ' + runDate.toLocaleString() + '\n';
			text += `openocd -f /usr/share/openocd/scripts/interface/ftdi/um232h.cfg  -c 'adapter_khz 400' -c 'transport select jtag' -c 'jtag newtap ${jtagDeviceName} tap -irlen 3 -expected-id 0x0151403f' -c init -c 'svf "${project.svfFilePath}"'  -c 'sleep 200' -c shutdown \n`;
			editBuilder.replace(range, text);

		});

	var saved = await d.save();
	
	return saved;
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
		const cpWorkingResponse = await copyToWindows(project.jedFilePath.path);
		if(cpWorkingResponse.responseCode !== 0){
			return;
		}
		
		if(((await vscode.workspace.findFiles(project.chnFilePath.path))).length === 0){
			createChn(project);
		}
		//TODO: consider if update chn is needed
		// const chnText = await vscode.workspace.fs.readFile(project.chnFilePath);
		// const newTextLines = new TextDecoder().decode(chnText).split('\n');
		// const tempFileJEDEC = await translateToWindowsTempPath(project.jedFilePath.path);
		//const tempFileChn = await translateToWindowsTempPath(project.chnFilePath.path);
		
		// const foundLine = newTextLines.find(l => l.includes(project.projectPath.path.replace(/\//gi,'\\')) && l.includes(".jed"));
		// if(foundLine){
		// 	let retLines = newTextLines.filter(l => l !== foundLine);
		// 	retLines.push(tempFileJEDEC);
		// 	await vscode.workspace.fs.writeFile(project.chnFilePath, new TextEncoder().encode(retLines.join('\n')));
		// }

		const cpBuildResponse = await copyToWindows(project.chnFilePath.path);
		if(cpBuildResponse.responseCode !== 0){
			return;
		}

		//execute		
		atfOutputChannel.appendLine('Updating project ' + project.projectName);		
		const cmdString = `wine "${projectFileProvider.atmSimBinPath}" "${project.windowsChnFilePath}"`; 
		await command.runCommand('ATF1504 Build', undefined, cmdString);
		
	} catch(err: any){
		atfOutputChannel.appendLine('Critical Error running ISP:' + err.message);
	}
	
	
	await copyToLinux(project.svfFilePath.path.substring(project.svfFilePath.path.lastIndexOf('\\') + 1), project.projectPath.path);
		
	await projectFileProvider.refresh();
}
