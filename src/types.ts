import * as vscode from 'vscode';
import { DeviceConfiguration, DeviceManufacturer } from './devices/devices';
import { getOSCharSeperator } from './os/platform';
import { projectFileProvider } from './explorer/projectFilesProvider';
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
	 ** projectFileName: 	ProjectVS-Cupl.prj or ProjectVS-Cupl
	**/
	constructor(
		private readonly projectPathIn: string,
	){
		const chrS = getOSCharSeperator();
		//if has training, remove it
		// if(projectFilePath.path.endsWith(chrS))
		// {
		// 	projectFilePath = vscode.Uri.parse(`${projectFilePath.path.substring(0,projectFilePath.path.length - 1)}`);
		// }
		var winTempPath = projectFileProvider.winBaseFolder + projectFileProvider.winTempPath .replace(/\//gi,'\\');
		//can be passed in with project file, or with project directory
		if(projectPathIn.toLowerCase().endsWith('.prj')){
			this.projectName = projectPathIn.substring(projectPathIn.lastIndexOf(chrS)+1).replace('.prj','');
			this.projectPath =  vscode.Uri.parse(
				projectPathIn.substring(0,projectPathIn.lastIndexOf(chrS))
			);
		}
		else{
			this.projectName = projectPathIn.split(chrS).filter(parts => parts.length > 0).reverse()[0];
			this.projectPath = vscode.Uri.parse( projectPathIn);
		}
		

		//this.projectName = projectFilePath.substring(projectFilePath.lastIndexOf(chrS)+1).replace('.prj','');
		
		// this.projectPath =  vscode.Uri.parse(
		// 	projectFilePath.substring(0,projectFilePath.lastIndexOf(chrS))
		// );
		this.prjFilePath = vscode.Uri.parse(
			this.projectPath.path + chrS + this.projectName + '.prj' );

		this.pldFilePath =  vscode.Uri.parse(
			this.projectPath.path + chrS + this.projectName + '.pld');
		this.windowsPldFilePath = winTempPath.replace(/\\\\/gi,'\\')  + '\\' +  this.projectName + '.pld';
			
		this.jedFilePath =  vscode.Uri.parse(
			this.projectPath.path +  chrS + this.projectName /*.substring(0,9)*/ + '.jed');
		this.windowsJedFilePath = winTempPath.replace(/\\\\/gi,'\\')  + '\\' +  this.projectName + '.jed';

		//for chips requiring ATMISP to convert jed to svf
		this.chnFilePath =  vscode.Uri.parse(
			this.projectPath.path + chrS  + atmIspDirectory + chrS  + this.projectName + '.chn');
		this.windowsChnFilePath = winTempPath + '\\' + this.projectName + '.chn';

		this.svfFilePath =  vscode.Uri.parse(
			this.projectPath.path + chrS + atmIspDirectory + chrS + this.projectName + '.svf');
		
		this.buildFilePath =  vscode.Uri.parse(
			this.projectPath.path + chrS + buildDirectory + chrS + this.projectName + '.sh');

		vscode.workspace.fs.readDirectory(this.projectPath).then(existingFiles => {
			if (!existingFiles.find(dir => dir[0] === buildDirectory)) {
				vscode.workspace.fs.createDirectory(vscode.Uri.parse(this.projectPath.path + chrS + buildDirectory));
			}
			if (!existingFiles.find(dir => dir[0] === atmIspDirectory)) {
				vscode.workspace.fs.createDirectory(vscode.Uri.parse(this.projectPath.path + chrS + atmIspDirectory));
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