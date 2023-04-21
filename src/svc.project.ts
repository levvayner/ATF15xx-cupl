import * as vscode from 'vscode';
import { uiEnterProjectName, uiIntentDeployQuestion, uiIntentSelectDevice, uiIntentSelectManufacturer, uiIntentSelectPackageType, uiIntentSelectPinCount, uiIntentSelectTextFromArray } from './ui.interactions';
import { TextDecoder, TextEncoder } from 'util';
import { stateManager } from './state';
import { copyToWindows, translateToWindowsTempPath} from './explorer/fileFunctions';
import { Command, atfOutputChannel } from './os/command';
import { AtmIspDeviceActionType, AtmIspDeviceAction, DeviceConfiguration, AtmIspDeploymentCableType, } from './devices/devices';
import { VSProjectTreeItem, projectFileProvider } from './explorer/projectFilesProvider';
import { Project } from './types';
import { createDeploySVFScript, updateDeploySVFScript } from './svc.atmisp';
import { getOSCharSeperator } from './os/platform';

let command = new Command();
let lastKnownPath = '';
export async function registerCreateProjectCommand(createProjectCommandName: string, context: vscode.ExtensionContext) {
	
	const state = stateManager(context);
	lastKnownPath = state.read('last-known-VS-project-path');
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
		//set up project type
		var projectName = await uiEnterProjectName();
        var path = paths[0] + '/' + projectName + '/' + projectName + '.prj';

		var project = await createNewProject(path);

		if(!project){
			atfOutputChannel.appendLine('Failed to create project!');
			return;
		}

		//create default PLD
		await createPLD(project);
		
        //creating here		
		
		state.write('last-known-VS-project-path', paths[0]);
       
		// //open folder
		// var workspaceFolder = await vscode.window.showWorkspaceFolderPick();
		
		
		await vscode.workspace.updateWorkspaceFolders(0, 0,{  uri: project?.projectPath, name: project.projectName});
		await projectFileProvider.setWorkspace(project.projectPath.path);
		projectFileProvider.refresh();
		//await vscode.commands.executeCommand("vscode.openFolder", project?.projectPath);
		
	};
	await context.subscriptions.push(vscode.commands.registerCommand(createProjectCommandName,cmdCreateProjectHandler));
}

export async function registerConfigureProjectCommand(configureProjectCommandName: string, context: vscode.ExtensionContext){

	const cmdConfigureProjectHandler = async (treeItem: VSProjectTreeItem) => {

		const project = await createNewProject(treeItem.project.prjFilePath.path);
		if(!project){
			atfOutputChannel.appendLine('Failed to update project!');
			return;
		}
		//update PLD
		await updatePLD(project);

	};
	await context.subscriptions.push(vscode.commands.registerCommand(configureProjectCommandName,cmdConfigureProjectHandler));
}

export async function registerOpenProjectCommand(openProjectCommandName: string, context: vscode.ExtensionContext){

	const state = stateManager(context);
	lastKnownPath = state.read('last-known-VS-project-path');
	if(lastKnownPath === ''){
		lastKnownPath = projectFileProvider.wineBaseFolder;
	}
	const cmdOpenProjectHandler = async () => {
		var projectRoot = await vscode.window.showOpenDialog({canSelectMany: false, 
			canSelectFiles: true, canSelectFolders: false,
			openLabel: "Open project", 
			title: "Chose PLD file to open project",
			defaultUri: vscode.Uri.parse(lastKnownPath),
			filters: {
				'Cupl Project File': ['prj'],
			}			
		});
		
	
		const createTime = new Date();

		var paths = projectRoot?.map(pr => pr.path);
		if(paths === undefined || paths.length === 0)
		{
			vscode.window.setStatusBarMessage('No path specified', 5000);
			return;
		}

		const folderUri = vscode.Uri.file(paths[0].substring(0,paths[0].lastIndexOf(getOSCharSeperator())));// vscode.Uri.file(paths[0].substring(0,paths[0].lastIndexOf('/')));
		const folderName = folderUri.path.split('/').reverse()[0];
		projectFileProvider.setWorkspace(folderUri.path);
		vscode.workspace.updateWorkspaceFolders(0,0, {uri: folderUri, name: folderName});
		projectFileProvider.refresh();
		// await vscode.commands.executeCommand("vscode.openFolder", folderUri);
	};

	await context.subscriptions.push(vscode.commands.registerCommand(openProjectCommandName,cmdOpenProjectHandler));
	
}

export async function registerCloseProjectCommand(cmdCloseProjectCommand: string,context: vscode.ExtensionContext){
	const cmdCloseProjectHandler = async(project: VSProjectTreeItem) =>{
		vscode.workspace.saveAll();
		const folderIndex = vscode.workspace.workspaceFolders?.findIndex(wsp => wsp.name === project.label);
		if(folderIndex === undefined || folderIndex < 0){
			atfOutputChannel.appendLine('Failed to remove workspace folder. Not found in workspace folders!');
			return;
		}
		vscode.workspace.updateWorkspaceFolders(folderIndex,1);
		projectFileProvider.refresh();
	};

	await context.subscriptions.push(vscode.commands.registerCommand(cmdCloseProjectCommand, cmdCloseProjectHandler));
}

export async function registerDeleteFileCommand(deleteFileCommandName: string, context: vscode.ExtensionContext){
	const cmdDeleteFileHandler = async (fileName: VSProjectTreeItem) => {
		var delResp = await vscode.window.showInformationMessage(
			`Are you sure you want to delete ${fileName.file}?`,
			{
				modal: true,
			},
			{title: 'Yes', isCloseAffordance:true} as vscode.MessageItem, {title: 'No', isCloseAffordance:false} as vscode.MessageItem);
		// var deleteResponse = await vscode.window.showQuickPick(
		// 	['Yes', 'No'],{canPickMany: false, title:' Delete ' + fileName.label
		// });
		if(delResp!== undefined && delResp.title === 'Yes'){
			await vscode.workspace.fs.delete(vscode.Uri.parse(fileName.file));
			if(fileName.label.toUpperCase().endsWith('.PLD.')){
				await backupFile(fileName);
			}
			await projectFileProvider.refresh();
		}
	
	};

	await context.subscriptions.push(vscode.commands.registerCommand(deleteFileCommandName,cmdDeleteFileHandler));
}

export async function getDeviceConfiguration(){
	const mfg = await uiIntentSelectManufacturer();
	if(mfg === undefined || mfg?.length === 0){
		
		vscode.window.showErrorMessage('Must select manufacturer');
		return;
		
	}

	const pkg = await uiIntentSelectPackageType(mfg);
	if(pkg === undefined || pkg?.length === 0){
		
		vscode.window.showErrorMessage('Must select package type');
		return;
		
	}

	const pinCount = await uiIntentSelectPinCount(mfg, pkg);
	if(pinCount === undefined || pinCount?.length === 0){
		
		vscode.window.showErrorMessage('Must select pin count');
		return;
		
	}

	const device = await uiIntentSelectDevice(mfg,pkg,pinCount);
	if(device === undefined){
		
		vscode.window.showErrorMessage('Must select device');
		return;
		
	}
	return device;
}


export async function createNewProject(projectPath: string | undefined = undefined){

	if(!projectPath){
		atfOutputChannel.appendLine('Create Project Failed! No project Path specified');
		return;
	}

	var newProject = await defineProjectFile(projectPath);
	if(!newProject){
		atfOutputChannel.appendLine('Error generating new project file.');
		return;
	}
	
	const prjData = JSON.stringify(await newProject.device());
	await vscode.workspace.fs.createDirectory(newProject.projectPath);
	await vscode.workspace.fs.writeFile(newProject.prjFilePath, new TextEncoder().encode(prjData));

	// await createPLD(newProject);

	return newProject;
	// const hasFlags = deviceName?.indexOf('|') ?? 0 > 0;
	// let deviceNames = (hasFlags ?  deviceName?.substring(0,deviceName.indexOf('|')) : deviceName);
	// if(deviceNames === undefined){
	// 	const mfg = await uiIntentSelectManufacturer();
	// 	const pckType = await uiIntentSelectPackageType(mfg);
	// 	const pinCount = await uiIntentSelectPinCount(mfg, pckType);
	// 	deviceNames = (await uiIntentSelectDevice(mfg ?? '', pckType ?? '', (pinCount) ?? '0'))?.deviceName;
	// }
	// const hasMultipleValues = deviceNames?.indexOf(',') ?? 0 > 0;
	// let devices = hasMultipleValues ? deviceNames?.split(',') : [deviceNames?.trim()];
	
	// if(!devices || devices.length === 0 || !devices[0]){
	// 	atfOutputChannel.appendLine('Cannot create prj file. Unknown device!');
	// 	return;
	// }
	// //need to get friendly name
	// if(devices?.length > 1){
	// 	deviceName = await uiIntentSelectTextFromArray(devices as string[]);
	// }  else {
	// 	deviceName = devices[0];
	// }
	
}


export async function defineProjectFile(projectPath: string ){
	let device = await getDeviceConfiguration();

	if(device === undefined){
		atfOutputChannel.appendLine('Cannot create prj file. No device specified!');
		return;
	}
	
	const newProject = new Project(projectPath);
	await newProject.setDevice(device);
	return newProject;
}

export async function createPLD(project: Project){
	
	
		

	//find out device type
	// const deviceConfiguration = await getDeviceConfiguration();
	const createTime = new Date();
	
	var projectText = 
`Name     ${project.projectName} ;
PartNo   ${await project.deviceName()} ;
Date     ${createTime.toLocaleString()} ;
Revision 01 ;
Designer ${vscode.env.machineId} ;
Company   ;
Assembly None ;
Location  ;
Device   ${await project.deviceCode()} ;

/* Custom Cupl code below */`;
		
		await vscode.workspace.fs.writeFile(project.pldFilePath, new TextEncoder().encode(projectText));
		await vscode.commands.executeCommand("vscode.open", project.pldFilePath);
		return ;
}

export async function updatePLD(project: Project){
	if(!projectFileProvider.pathExists(project.pldFilePath.path)){
		await createPLD(project);
		projectFileProvider.refresh();
		return;
	}
	//read pld file. project configuration section should have fields updated: partno, device, ?date?
	const pldText = await vscode.workspace.fs.readFile(project.pldFilePath);
	const pldtextLines = new TextDecoder().decode(pldText).split('\n');

	const partNo = await project.deviceName();
	const device = await project.deviceCode();
	// let partNoFound = false, deviceFound = false;
	pldtextLines.forEach((l, index) => {
		if(l.startsWith('PartNo')){
			pldtextLines[index] = `PartNo   ${partNo};` ;
		}
		if(l.startsWith('Device')){
			pldtextLines[index] = `Device   ${device};` ;
		}			//typescript forEach does not allow a break. consider while or for loops	
	});

	await vscode.workspace.fs.writeFile(project.pldFilePath, new TextEncoder().encode(pldtextLines.join('\n')));

}

export async function createChn(project: Project){
	// var atmIspWinRelPath = projectFileProvider.winBaseFolder + projectFileProvider.winTempPath .replace(/\//gi,'\\');
	// var jedFilePath = atmIspWinRelPath.replace(/\\\\/gi,'\\') +  '\\build\\' + project.projectName + '.jed';

//TODO: use project (prj) config for properties
	const deviceName = await project?.deviceName();
	if(!deviceName){
		atfOutputChannel.appendLine('Error creating chn file: DeviceName missing from project file');
		return;
	}
	const action = new AtmIspDeviceAction(deviceName,AtmIspDeviceActionType.ProgramAndVerify,AtmIspDeploymentCableType.ATDH1150USB, project.windowsJedFilePath);	
	
	await vscode.workspace.fs.writeFile(project?.chnFilePath, new TextEncoder().encode(action.toString()));
}


export async function executeDeploy(project: Project){
	//execute	
	const response = await command.runCommand('VS-Cupl Deploy', project.projectPath.path, `export FTDID=6014 && chmod +x "${ project.buildFilePath.path }" && "${ project.buildFilePath.path}" 2>&1 | tee`);
	
	if(response.responseCode !== 0){
		const errorResponse = response.responseError.message.split('\n').filter((l: string) => l.startsWith('Error:')).map((e: string) => e.trim()).join('\n');
		atfOutputChannel.appendLine(`** Errors occured: **\n${errorResponse}`);		
		return;
	}
	
	atfOutputChannel.appendLine(response.responseText);
	
}

export async function runUpdateDeployScript(project: Project){
	const command = new Command();
	if(!project.buildFilePath){
		vscode.window.showErrorMessage(`SVF File format is incorrect. Expected /home/user/project/file.sh. found ${project.buildFilePath}`);
		return;
	}

	//var executeDeploy = await uiIntentDeployQuestion();	
	
	vscode.window.setStatusBarMessage('Updating project ' + project.projectName, 5000);
	
	//update deployment file
	await updateDeploySVFScript(project);
}


async function backupFile(fileName: VSProjectTreeItem) {
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

