import * as vscode from 'vscode';
import { TextDecoder, TextEncoder } from 'util';
import { AtmIspDeviceAction, AtmIspDeviceActionType, AtmIspDeploymentCableType } from '../devices/devices';
import { atfOutputChannel } from '../os/command';
import { isWindows } from '../os/platform';
import { Project } from '../types';
import { VSProjectTreeItem, projectFileProvider } from './project-files-provider';
import { getDeviceConfiguration, uiEnterProjectName } from '../ui.interactions';
import path = require('path');


export async function defineProjectFile(projectPath: vscode.Uri ){
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
	if(!projectFileProvider.pathExists(project.pldFilePath.fsPath)){
		await createPLD(project);
		await projectFileProvider.refresh();
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

export async function updateChn(project: Project){
//TODO: use project (prj) config for properties
	const deviceName = await project?.deviceName();
	if(!deviceName){
		atfOutputChannel.appendLine('Error creating chn file: DeviceName missing from project file');
		return;
	}
	const action = new AtmIspDeviceAction(deviceName,AtmIspDeviceActionType.ProgramAndVerify,AtmIspDeploymentCableType.ATDH1150USB, isWindows() ?  project.jedFilePath.fsPath : project.windowsJedFilePath);	
	
	await vscode.workspace.fs.writeFile(project?.chnFilePath, new TextEncoder().encode(action.toString()));
}


export async function cloneProject(projectPath: vscode.Uri | undefined = undefined){

	if(!projectPath){
		atfOutputChannel.appendLine('Create Project Failed! No project Path specified');
		return;
	}
	const oldProject = new Project(projectPath);

	const projectName = await uiEnterProjectName();
	const projectDir =  path.join(projectPath.fsPath.substring(0,projectPath.fsPath.lastIndexOf('/')) , projectName);
	var newProjectPath = projectDir + '/' + projectName + '.prj';

		
	await vscode.workspace.fs.createDirectory(vscode.Uri.parse(projectDir));
	await vscode.workspace.fs.copy(oldProject.prjFilePath,vscode.Uri.parse(newProjectPath) );
	
	var newProject = new Project(vscode.Uri.parse(projectDir));

	await vscode.workspace.fs.copy(oldProject.pldFilePath,newProject.pldFilePath );
	
	await projectFileProvider.setActiveTreeItem(newProject.projectName);
	return newProject;
	
}

export async function createProject(projectPath: vscode.Uri | undefined = undefined){

	if(!projectPath){
		atfOutputChannel.appendLine('Create Project Failed! No project Path specified');
		return;
	}

	var newProject = await defineProjectFile(projectPath);
	if(!newProject){
		atfOutputChannel.appendLine('Error generating new project file.');
		return;
	}
	
	const prjData = JSON.stringify(await newProject.device(),null,4);
	await vscode.workspace.fs.createDirectory(newProject.projectPath);
	await vscode.workspace.fs.writeFile(newProject.prjFilePath, new TextEncoder().encode(prjData));

	return newProject;
	
}


export async function backupFile(fileName: VSProjectTreeItem) {
	const fileUri = vscode.Uri.parse(fileName.file.fsPath);
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