import * as vscode from 'vscode';
import { deviceList, DeviceManufacturer, DevicePackageType } from './devices/devices';


export async function uiIntentDeployQuestion(){
	var selectedProjectOption = await vscode.window.showQuickPick(
		['No', 'Yes'],{
			canPickMany: false,
			title: 'Execute Deployment'
		}
	);
	
		if(!selectedProjectOption || selectedProjectOption?.length === 0 ){
			vscode.window.showErrorMessage('Must select option if to deploy or not');
			return;
		}
		return selectedProjectOption === 'Yes';
}

export async function uiIntentSelectManufacturer(){
	var selectedOption = await vscode.window.showQuickPick(
		Object.values(DeviceManufacturer).filter(v => typeof(v) !== 'number') as [],{
			canPickMany: false,
			title: 'Device Manufacturer'
		}
	);
	const mfg = selectedOption as DeviceManufacturer;
	return mfg ?? DeviceManufacturer.undefined;
}

export async function uiIntentSelectPackageType(manufacturer: DeviceManufacturer){
	var pckType = (Object.values(DevicePackageType) as []).filter(pck => deviceList.filter(dli => dli.manufacturer === manufacturer).length > 0);
	var selectedOption = await vscode.window.showQuickPick(
		pckType,{
			canPickMany: false,
			title: 'Device Package Type'
		}
	);
	const packageType = selectedOption as DevicePackageType;
	return packageType ?? DevicePackageType.undefined;
}


export async function uiIntentSelectPinCount(manufacturer: DeviceManufacturer, packageType: DevicePackageType){
	const pinCounts = [... new Set(deviceList.filter(dli => dli.manufacturer === manufacturer && dli.packageType === packageType).map(dl => dl.pinCount.toFixed(0)))];
	var selectedOption = await vscode.window.showQuickPick(
		pinCounts,{
			canPickMany: false,
			title: 'Device Pin Count'
		}
	);
	
	return selectedOption;
}

export async function uiIntentSelectDevice(manufacturer: DeviceManufacturer, packageType: DevicePackageType, pinCount: string){
	const mfgDefined = manufacturer !== DeviceManufacturer.undefined;
	const pckTypeDefined = packageType !== DevicePackageType.undefined;
	const pinCountDefined = pinCount !== '0';
	const filteredSet = [... new Set(deviceList
		.filter(d => (!mfgDefined ||  d.manufacturer === manufacturer)
			 && (!pckTypeDefined || d.packageType === packageType)
			 && (!pinCountDefined || d.pinCount.toFixed(0) === pinCount )))];
	const noSeperator = mfgDefined && pckTypeDefined && pinCountDefined;
	const deviceName =filteredSet.map(dl => `${dl.deviceName}${noSeperator ? '' : ' || '}${ mfgDefined ? '' : ' Mfg: ' + dl.manufacturer.toString()}${pckTypeDefined ? '' : 'Package: ' + dl.packageType.toString()}${pinCountDefined ? '' : 'Pins: ' + dl.pinCount.toFixed(0)}`);
	var selectedProjectOption = await vscode.window.showQuickPick(
		deviceName,{
			canPickMany: false,
			title: 'Device'
		}
	);
	
	return deviceList.find(d => (noSeperator ? d.deviceName : d.deviceCode.substring(0,d.deviceCode.indexOf(' || '))) === selectedProjectOption);
}

export async function uiIntentSelectTextFromArray(selections: string[], title: string | undefined = undefined): Promise<string>{
	
	var selectedOption = await vscode.window.showQuickPick(
		selections.map(s => s.trim()),{
			canPickMany: false,
			title: title
		}
	);
	
	return selectedOption ?? '';
}


export async function uiEnterProjectName(): Promise<string> {
	var selectProjectName = await vscode.window.showInputBox({
			title: 'Specify Project Name'
		}
	);
    return selectProjectName ?? '';
}
