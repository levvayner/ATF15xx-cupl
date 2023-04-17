import * as vscode from 'vscode';
import { uiEnterProjectName, uiIntentDeployQuestion } from './ui.interactions';
import { createDeployFile, editLast} from './svc.deploy';
import { TextEncoder } from 'util';
import { WorkingCompileData, WorkingData } from './types';
import { stateManager } from './state';
import { copyToWindows} from './explorer/fileFunctions';
import { Command } from './os/command';
import { DeviceActionType, deviceAction, } from './devices/devices';
import { ATF15xxProjectTreeItem, projectFileProvider } from './explorer/projectFilesProvider';


let lastKnownPath = '';
export async function registerCreateProjectCommand(createProjectCommandName: string, context: vscode.ExtensionContext) {
	
	const state = stateManager(context);
	lastKnownPath = state.read('last-known-atf15xx-project-path');
	if(lastKnownPath === ''){
		lastKnownPath = projectFileProvider.wineBaseFolder;
	}
	const cmdCreateProjectHandler = async () => {

        var projectRoot = await vscode.window.showOpenDialog({canSelectMany: false, 
            canSelectFiles: false, canSelectFolders: true, 
            openLabel: "Create project here", 
            title: "Specify where you'd like to create a new project",
			defaultUri: vscode.Uri.parse(lastKnownPath)
        });
		
       
        var paths = projectRoot?.map(pr => pr.path);
        if(paths === undefined || paths.length === 0)
        {
			vscode.window.setStatusBarMessage('No path specified', 5000);
            return;
        }
		
		
        //creating here
		
		var projectName = await uiEnterProjectName();
        var path = paths[0] + '/' + projectName;
		state.write('last-known-atf15xx-project-path', paths[0]);
        await vscode.workspace.fs.createDirectory(vscode.Uri.parse( path ));
		createPLD(projectName, path);
		createChn(projectName, path);


		
		// //open folder
		// var workspaceFolder = await vscode.window.showWorkspaceFolderPick();
		const folderUri = vscode.Uri.file(path);
		
		await vscode.commands.executeCommand("vscode.openFolder", folderUri);
		
	};
	await context.subscriptions.push(vscode.commands.registerCommand(createProjectCommandName,cmdCreateProjectHandler));
}

export async function registerOpenProjectCommand(openProjectCommandName: string, context: vscode.ExtensionContext){

	const state = stateManager(context);
	lastKnownPath = state.read('last-known-atf15xx-project-path');
	if(lastKnownPath === ''){
		lastKnownPath = projectFileProvider.wineBaseFolder;
	}
	const cmdOpenProjectHandler = async () => {
		var projectRoot = await vscode.window.showOpenDialog({canSelectMany: false, 
			canSelectFiles: true, canSelectFolders: false, 
			openLabel: "Open project", 
			title: "Specify where you'd like to create a new project",
			defaultUri: vscode.Uri.parse(lastKnownPath),
			filters: {
				'Cupl Project File': ['pld'],
			}			
		});
		
	
		const createTime = new Date();

		var paths = projectRoot?.map(pr => pr.path);
		if(paths === undefined || paths.length === 0)
		{
			vscode.window.setStatusBarMessage('No path specified', 5000);
			return;
		}

		const folderUri = vscode.Uri.file(paths[0].substring(0,paths[0].lastIndexOf('/')));
		const folderName = folderUri.path.split('/').reverse()[0];
		vscode.workspace.updateWorkspaceFolders(0,0, {uri: folderUri, name: folderName});
			
		await vscode.commands.executeCommand("vscode.openFolder", folderUri);
	};

	await context.subscriptions.push(vscode.commands.registerCommand(openProjectCommandName,cmdOpenProjectHandler));
	
}

export async function registerCreatePLDFile(newFileCommandName: string, context: vscode.ExtensionContext)  {
	const cmdNewFileHandler = async (fileName: ATF15xxProjectTreeItem) => {
		var newFile = await vscode.window.showInputBox( {title: 'Specify New file', value: fileName?.label + '.PLD', prompt: 'Enter new project name'});

		if(newFile !== undefined){
			const workspaceFolder = vscode.workspace.workspaceFolders?.length === 0 ? undefined : vscode.workspace.workspaceFolders![0].uri; 
			if(workspaceFolder === undefined){
				console.log('error, no folder active');
				return;
			}
			await createPLD(newFile , workspaceFolder.path );
			await vscode.commands.executeCommand("vscode.open", newFile);
		}
	
	};

	await context.subscriptions.push(vscode.commands.registerCommand(newFileCommandName,cmdNewFileHandler));
}

export async function registerDeleteFileCommand(deleteFileCommandName: string, context: vscode.ExtensionContext){
	const cmdDeleteFileHandler = async (fileName: ATF15xxProjectTreeItem) => {
		var deleteResponse = await vscode.window.showQuickPick(['Yes', 'No'],{canPickMany: false, title:' Delete ' + fileName.label});
		if(deleteResponse === 'Yes'){
			await vscode.workspace.fs.delete(vscode.Uri.parse(fileName.file));
			if(fileName.label.toUpperCase().endsWith('.PLD.')){
				await backupFile(fileName);
			}
			projectFileProvider.refresh();
		}
	
	};

	await context.subscriptions.push(vscode.commands.registerCommand(deleteFileCommandName,cmdDeleteFileHandler));
}

export async function createPLD(projectName: string, path: string){
	const createTime = new Date();
	var projectText = 
`Name     ${projectName} ;
PartNo   01 ;
Date     ${createTime.toLocaleString()} ;
Revision 01 ;
Designer [YOUR_NAME] ;
Company   ;
Assembly None ;
Location  ;
Device   f1504ispplcc44 ;

/* Custom Cupl code below */`;
		
		await vscode.workspace.fs.writeFile(vscode.Uri.parse(path + '/' + projectName + '.PLD'), new TextEncoder().encode(projectText));
}

export async function createChn(projectName: string, path: string){
	var atmIspWinRelPath = projectFileProvider.winBaseFolder + path.replace(projectFileProvider.wineBaseFolder, '').replace(/\//gi,'\\');
	var jedFilePath = atmIspWinRelPath.replace(/\\\\/gi,'\\') +  '\\build\\' + projectName + '.jed';
	const action = new deviceAction("ATF1504AS",DeviceActionType.ProgramAndVerify,jedFilePath);
	
	
	
	await vscode.workspace.fs.writeFile(vscode.Uri.parse(path + '/' + projectName + '.chn'), new TextEncoder().encode(action.toString()));
}
export async function runUpdate(svfData: WorkingCompileData){
	const command = new Command();
	if(svfData.projectName.length <= 0 ){
		vscode.window.showErrorMessage(`SVF File format is incorrect. Expected /home/user/project/file.svf. found ${svfData.buildFileName}`);
		return;
	}

	var executeDeploy = await uiIntentDeployQuestion();	
	
	vscode.window.setStatusBarMessage('Updating project ' + svfData.projectName, 5000);
	
	//get all builder files.
	var buildFile = await getBuildFile(svfData);
	//create new if not found
	if(buildFile === undefined){
		await createDeployFile(svfData);
	}
	
	//update deployment file
	await editLast(svfData);

	// //copy to working folder
	// const cpToWinResponse = await copyToWindows(svfData.wokringFileUri);
	// if(cpToWinResponse.responseCode !== 0){
	// 	return;
	// }
	// const cpToWinResponseBuild = await copyToWindows(svfData.buildFileUri);
	// if(cpToWinResponseBuild.responseCode !== 0){
	// 	return;
	// }

	//execute
	if(executeDeploy) {
		await command.runCommand('ATF1504 Deploy', svfData.projectPath, `export FTDID=6014 && chmod +x "${ svfData.buildFileUri}" && "${ svfData.buildFileUri}"`);
	}	
	
}

export async function getBuildFile(svfData: WorkingCompileData){
	var templates = await vscode.workspace
	.findFiles('**/build/**.sh', null)
	.then(v => v
		.filter(t => 
			t.path.includes(svfData.projectName) && t.path.includes(svfData.buildFileName))
		.map(uri =>  vscode.workspace.asRelativePath(uri).replace(svfData.projectName,''))) as string[];	
  return templates.length === 0 ? undefined : templates[0];
}

async function backupFile(fileName: ATF15xxProjectTreeItem) {
	const fileUri = vscode.Uri.parse(fileName.file);
	const wsF = await vscode.workspace.getWorkspaceFolder(fileUri);
	if(wsF === undefined){
		vscode.window.showErrorMessage("Failed to backup file" + fileName.label);
		return;
	}
	const existingFiles = vscode.workspace.fs.readDirectory(wsF.uri);
	if(!(await existingFiles).find(dir => dir[0] === 'backps')){
		const backupUri = vscode.Uri.parse(wsF + '/backups');
		vscode.workspace.fs.createDirectory(backupUri);
		vscode.workspace.fs.copy(fileUri, backupUri);
	}


}

