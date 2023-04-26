import * as vscode from 'vscode';
import { DeviceConfiguration, DeviceManufacturer } from './devices/devices';
import { projectFileProvider } from './explorer/project-files-provider';
import path = require('path');
export const buildDirectory = 'build';
export const atmIspDirectory = 'atmisp';
export class Project{
	
	public readonly prjFilePath: vscode.Uri;
	public readonly pldFilePath: vscode.Uri;
	public readonly jedFilePath: vscode.Uri;
	public readonly chnFilePath: vscode.Uri;
	public readonly svfFilePath: vscode.Uri;
	public readonly projectPath: vscode.Uri;
	public readonly projectName: string;
	public readonly buildFilePath: vscode.Uri;
	public readonly windowsPldFilePath: string;
	public readonly windowsJedFilePath: string;
	public readonly windowsChnFilePath: string;

	private isInitialized = false;
	private deviceConfiguration: DeviceConfiguration | undefined;
	/** projectPath: 		/home/user/CUPLProjects/project1/ on Linux, C:\Users\User1\CUPLProjects\project1\
	 ** projectFileName: 	Projectvs-cupl.prj or Projectvs-cupl
	**/
	constructor(
		private readonly projectPathIn: vscode.Uri,
	){
		//can be passed in with project file, or with project directory
		if(projectPathIn.fsPath.toLowerCase().endsWith('.prj')){
			this.projectName = projectPathIn.fsPath.substring(projectPathIn.fsPath.lastIndexOf(path.sep)+1).replace('.prj','');
			this.projectPath =  vscode.Uri.file(
				projectPathIn.fsPath.substring(0,projectPathIn.fsPath.lastIndexOf(path.sep))
			);
		}
		else{
			this.projectName = projectPathIn.fsPath.split(path.sep).filter(parts => parts.length > 0).reverse()[0];
			this.projectPath = vscode.Uri.parse( projectPathIn.fsPath);
		}
		
		this.prjFilePath = vscode.Uri.file( path.join(this.projectPath.fsPath, this.projectName + '.prj'));

		this.pldFilePath =  vscode.Uri.file(path.join(
			this.projectPath.fsPath , this.projectName + '.pld'));
		this.windowsPldFilePath = projectFileProvider.workingWindowsFolder.replace(/\\\\/gi,'\\')  + '\\' +  this.projectName + '.pld';
			
		this.jedFilePath =  vscode.Uri.file(path.join(
			this.projectPath.fsPath , this.projectName /*.substring(0,9)*/ + '.jed'));
		this.windowsJedFilePath = projectFileProvider.workingWindowsFolder.replace(/\\\\/gi,'\\')  + '\\' +  this.projectName + '.jed';

		//for chips requiring ATMISP to convert jed to svf
		this.chnFilePath =  vscode.Uri.file(path.join(
			this.projectPath.fsPath + path.sep  + atmIspDirectory + path.sep  + this.projectName + '.chn'));
		this.windowsChnFilePath = projectFileProvider.workingWindowsFolder + '\\' + this.projectName + '.chn';

		this.svfFilePath =  vscode.Uri.file(path.join(
			this.projectPath.fsPath , atmIspDirectory , this.projectName + '.svf'));
		
		this.buildFilePath =  vscode.Uri.file(path.join(
			this.projectPath.fsPath , buildDirectory , this.projectName + '.sh'));

		vscode.workspace.fs.readDirectory(this.projectPath).then(existingFiles => {
			if (!existingFiles.find(dir => dir[0] === buildDirectory)) {
				vscode.workspace.fs.createDirectory(vscode.Uri.parse(path.join(this.projectPath.fsPath , buildDirectory)));
			}
			if (!existingFiles.find(dir => dir[0] === atmIspDirectory)) {
				vscode.workspace.fs.createDirectory(vscode.Uri.parse(path.join(this.projectPath.fsPath , atmIspDirectory)));
			}
		});
		
			
	}
	private async init(){
		//parse project file to set memebers
		if(this.isInitialized){
			return;
		}
		const deviceConfigRaw = await (await vscode.workspace.openTextDocument(this.prjFilePath.path)).getText();
		this.deviceConfiguration = JSON.parse(deviceConfigRaw) as DeviceConfiguration;
		this.isInitialized = true;
	}

	async setDevice(device: DeviceConfiguration) {
		this.deviceConfiguration = device;
		this.isInitialized = true;
	}

	public async device(){
		return this.deviceConfiguration;
	}

	public async deviceManufacturer(){
		await this.init();
		return this.deviceConfiguration?.manufacturer;
	}

	public async devicePackageType(){
		await this.init();
		return this.deviceConfiguration?.packageType;
	}

	public async devicePinCount(){
		await this.init();
		return this.deviceConfiguration?.pinCount;
	}

	public async deviceProgrammer(){
		await this.init();
		return this.deviceConfiguration?.programmer;
	}

	public async deviceCode(){
		await this.init();
		return this.deviceConfiguration?.deviceCode;
	}
	public async deviceName(){
		await this.init();
		return this.deviceConfiguration?.deviceUniqueName;
	}

}