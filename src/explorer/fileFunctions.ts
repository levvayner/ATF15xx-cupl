import * as vscode from 'vscode';
import { Command, ShellResponse } from '../os/command';
export let wineBaseFolder = '/home/vsadmin/.wine/drive_c/'; //TODO: extract programatically
export let windowsBaseFolder = `c:\\`; //TODO: extract programatically
export let windowsTempFolder = `temp`;
export let atmIspTempFolder = `c:\\`; //TODO: extract programatically

export const workingLinuxFolder = wineBaseFolder + windowsTempFolder;
export const workingWindowsFolder = windowsBaseFolder + windowsTempFolder;
/// source is full path to file
/// Copies selected file to working folder on windows path
export async function copyToWindows(source: string): Promise<ShellResponse>{
    //copy to w`orking folder
    

    const cmdCopyFilesToWorkingFolder = `mkdir -p "${workingLinuxFolder }" && cp -fR ${source} ${workingLinuxFolder}`;
    const cpResult  = await new Command().runCommand('ATF1504 Build', source.substring(0,source.lastIndexOf('/')), cmdCopyFilesToWorkingFolder);
    if(cpResult.responseCode !== 0){
        vscode.window.showErrorMessage(`Error copying to working folder\n${cpResult.responseText}\n** ERROR OCCURED **\n${cpResult.responseError}`);       
    }
    return cpResult;
}

export async function copyToLinux(sourceFile: string, destinationPath: string){
    //copy results back
	
	const cmdCopyFilesFromWorkingFolder = `mkdir -p "${destinationPath + '/build/'}" && cp -fR ${workingLinuxFolder}/${sourceFile} ${destinationPath}`;
	const cpResult  = await new Command().runCommand('ATF1504 Build', sourceFile.substring(0,sourceFile.lastIndexOf('/')), cmdCopyFilesFromWorkingFolder);
    if(cpResult.responseCode !== 0){
        vscode.window.showErrorMessage(`Error copying from working folder\n${cpResult.responseText}\n** ERROR OCCURED **\n${cpResult.responseError}`);       
    }
    return cpResult;
}

export function translateToWindowsTempPath(linuxPath: string): string{
    return workingWindowsFolder + '\\' + linuxPath.replace(/\//gi,'\\');
}

export function translateToLinuxPath(linuxPath: string): string{
    return linuxPath.replace(windowsBaseFolder, wineBaseFolder).replace(/\\/gi,'/');
}