
import * as vscode from 'vscode';
import { TextEncoder } from 'util';
import { ProjectFilesProvider, VSProjectTreeItem } from './explorer/project-files-provider';
import { Project } from './project';
import { projectFromTreeItem } from './svc.project';
import { Command, atfOutputChannel } from './os/command';
import path = require('path');
import { stateProjects } from './state.projects';
import { isWindows } from './os/platform';
import { extensionUri } from './extension';
import { pathExists } from './explorer/fileFunctions';

export enum DeployCommandType{
	Program = 'Program',
	Erase = 'Erase'
}

export async function registerEraseSvfCommand(cmdEraseSvf: string, context: vscode.ExtensionContext) {
	const cmdEraseSvfHandler = async(treeItem: VSProjectTreeItem | vscode.Uri | undefined) => {
		let project = await projectFromTreeItem(treeItem);
		if(treeItem === undefined && vscode.window.activeTextEditor){
			//try get from active window
			const p = vscode.window.activeTextEditor.document.uri.fsPath;
			project = stateProjects.getOpenProject(vscode.Uri.parse(p.substring(0, p.lastIndexOf('/'))));
		}
		
		if(!project){
			atfOutputChannel.appendLine(`Failed to deploy JEDEC file. Unable to read project information`);
			return;
		}
		await runUpdateEraseScript(project);
		
		await executeDeploy(project);

	};
	context.subscriptions.push(vscode.commands.registerCommand(cmdEraseSvf, cmdEraseSvfHandler));
}

export async function registerDeploySvfCommand(cmdDeploySvf:  string, context: vscode.ExtensionContext) {
	
	const cmdDeploySvfHandler = async (treeItem: VSProjectTreeItem | vscode.Uri | undefined) => {
		let project = await projectFromTreeItem(treeItem);
		if(treeItem === undefined && vscode.window.activeTextEditor){
			//try get from active window
			const p = vscode.window.activeTextEditor.document.uri.fsPath;
			project = stateProjects.getOpenProject(vscode.Uri.parse(p.substring(0, p.lastIndexOf('/'))));
		}
		
		if(!project){
			atfOutputChannel.appendLine(`Failed to deploy JEDEC file. Unable to read project information`);
			return;
		}
		await runUpdateDeployScript(project);
		
		await executeDeploy(project);

		await (await ProjectFilesProvider.instance()).refresh();
	};

	context.subscriptions.push(vscode.commands.registerCommand(cmdDeploySvf, cmdDeploySvfHandler));	
}





export async function executeDeploy(project: Project){
	const command = new Command();
	//execute	
	atfOutputChannel.appendLine("Deploying SVF File to CPLD...");
    //on windows use SET instead of export and call command directly, istead of script
    const setEnvVar = isWindows() ? 'SET FTDID=6014' : 'export FTDID=6014';
    const cmdText = isWindows() ? GetOCDCommand(project) : `${setEnvVar} && chmod +x "${ project.buildFilePath.fsPath }" && "${ project.buildFilePath.fsPath}" 2>&1 | tee`
	const response = await command.runCommand('vs-cupl Deploy', project.projectPath.fsPath, cmdText);
	const errorResponse = response.responseText.split('\n').filter((l: string) => l.startsWith('Error:')).map((e: string) => e.trim()).join('\n');
	
	if(response.responseCode !== 0 || errorResponse.length > 0){
		
		atfOutputChannel.appendLine(`**Failed to deploy **\nErrors occured:\n------------------------\n${errorResponse}\n------------------------`);		
		return;
	}
	atfOutputChannel.appendLine("** Deployed SVF File to CPLD **");
	if(command.debugMessages)
	{
		atfOutputChannel.appendLine(response.responseText);
	}
	
}


async function runUpdateDeployScript(project: Project){
	const command = new Command();
	if(!project.buildFilePath){
		vscode.window.showErrorMessage(`SVF File format is incorrect. Expected /home/user/project/file.sh. found ${project.buildFilePath}`);
		return;
	}	
	vscode.window.setStatusBarMessage('Updating SVF Deployment scsript for ' + project.projectName, 5000);
	
	//update deployment file
	await updateDeploySVFScript(project);
}

async function createDeploySVFScript(project: Project){
	const buildFileHeader = `# VS ${project.deviceName} Builder file\n`;
	//if first build file	
	await vscode.workspace.fs.writeFile(project.buildFilePath , new TextEncoder().encode(buildFileHeader));
	var d = await vscode.workspace.openTextDocument(project.buildFilePath.path);

	var runDate = new Date();
	var editor = await vscode.window.showTextDocument(d);
	await editor.edit(document => {
		const startLine = d.lineCount === 0 ? 0 : 1;
		document.insert(new vscode.Position(startLine,0), `#  Deployment file created at ${runDate.toLocaleString()}\n`);
	});	
	var saved = await d.save();
	//await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
}



async function updateDeploySVFScript(project: Project): Promise<boolean>{
	//create new if not found
	if(!pathExists(project.buildFilePath.path)){
		await createDeploySVFScript(project);
	}
	var d = await vscode.workspace.openTextDocument(project.buildFilePath);
			
	var runDate = new Date();
	var editor = await vscode.window.showTextDocument(d);
    
    
	
			
	var startWritingLineIdx = 0;
	for(startWritingLineIdx; startWritingLineIdx < d.lineCount;startWritingLineIdx++){
		//find last ExecutedOn
		var found = d.lineAt(startWritingLineIdx).text.startsWith('# Executed ');
		if(found){
			break;
		}
	}
	
	
	var editBuilder = await editor.edit(
		editBuilder => {	
			var range = new vscode.Range(new vscode.Position(startWritingLineIdx,0), new vscode.Position(d.lineCount,0));
		
			var text = '#  Executed on ' + runDate.toLocaleString() + '\n';
			text += GetOCDCommand(project);
			editBuilder.replace(range, text);

		});
	var saved = await d.save();
	await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
	
	
	return saved;
}



async function runUpdateEraseScript(project: Project) {
	//create new if not found
	if(pathExists(project.buildFilePath.path)){
		await createDeploySVFScript(project);
	}
	var d = await vscode.workspace.openTextDocument(project.buildFilePath);
			
	var runDate = new Date();
	var editor = await vscode.window.showTextDocument(d);
    
    
	
			
	var startWritingLineIdx = 0;
	for(startWritingLineIdx; startWritingLineIdx < d.lineCount;startWritingLineIdx++){
		//find last ExecutedOn
		var found = d.lineAt(startWritingLineIdx).text.startsWith('# Executed ');
		if(found){
			break;
		}
	}
	
	
	var editBuilder = await editor.edit(
		editBuilder => {	
			var range = new vscode.Range(new vscode.Position(startWritingLineIdx,0), new vscode.Position(d.lineCount,0));
		
			var text = '#  Executed ERASE on ' + runDate.toLocaleString() + '\n';
			text += GetOCDCommand(project, DeployCommandType.Erase);
			editBuilder.replace(range, text);

		});
	var saved = await d.save();
	await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
	
	
	return saved;
}


function GetOCDCommand(project: Project, commandType: DeployCommandType = DeployCommandType.Program) {
    const extConfig = vscode.workspace.getConfiguration('vs-cupl');
    const ocdBinPath = extConfig.get('OpenOCDBinPath') as string;
    const ocdDLPath = extConfig.get('OpenOCDDLPath') as string;
    const openOcdCode = project.device?.openOCDDeviceCode ?? '151403f';
	const svfPath = commandType === DeployCommandType.Program ? project.svfFilePath.fsPath : path.join(extensionUri.fsPath, 'assets','bin','atf1504-svf','atf1504as-erase.svf');
	const svfParameter = isWindows() ? `svf '${svfPath}'` : `svf ${svfPath}`; //linux version does not support single quotes
    return `"${ocdBinPath}" -f "${path.join(ocdDLPath, 'scripts', 'interface', 'ftdi', 'um232h.cfg')}"  -c "adapter speed 400" -c "transport select jtag" -c "jtag newtap ${project.deviceName} tap -irlen 3 -expected-id 0x0${openOcdCode}" -c init -c "${svfParameter}"  -c "sleep 200" -c shutdown \n`;
}