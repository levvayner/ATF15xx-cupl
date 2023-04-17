import * as vscode from 'vscode';
import { Command, ShellResponse, atfOutputChannel } from '../os/command';
import { projectFileProvider } from './projectFilesProvider';

/// source is full path to file
/// Copies selected file to working folder on windows path
export async function copyToWindows(source: string): Promise<ShellResponse>{
    //copy to w`orking folder
    

    const cmdCopyFilesToWorkingFolder = `mkdir -p "${projectFileProvider.workingLinuxFolder }" && cp -fR ${source} ${projectFileProvider.workingLinuxFolder}`;
    const cpResult  = await new Command().runCommand('ATF1504 Build', source.substring(0,source.lastIndexOf('/')), cmdCopyFilesToWorkingFolder);
    if(cpResult.responseCode !== 0){
        vscode.window.showErrorMessage(`Error copying to working folder\n${cpResult.responseText}\n** ERROR OCCURED **\n${cpResult.responseError}`);       
    }
    atfOutputChannel.appendLine(`Copy to Windows command for file ${source} ${cpResult.responseCode === 0? 'completed successfully' : 'failed'}`  );
    return cpResult;
}

export async function copyToLinux(sourceFile: string, destinationPath: string){
    //copy results back
	
	const cmdCopyFilesFromWorkingFolder = `mkdir -p "${destinationPath + '/build/'}" && cp -fR ${projectFileProvider.workingLinuxFolder}/${sourceFile} ${destinationPath}`;
	const cpResult  = await new Command().runCommand('ATF1504 Build', sourceFile.substring(0,sourceFile.lastIndexOf('/')), cmdCopyFilesFromWorkingFolder);
    if(cpResult.responseCode !== 0){
        vscode.window.showErrorMessage(`Error copying from working folder\n${cpResult.responseText}\n** ERROR OCCURED **\n${cpResult.responseError}`);       
    }
    atfOutputChannel.appendLine(`Copy to Linux command for file ${sourceFile} to ${destinationPath} ${cpResult.responseCode === 0? 'completed successfully' : 'failed'}`  );
    return cpResult;
}

export function translateToWindowsTempPath(linuxPath: string): string{
    return projectFileProvider.workingWindowsFolder + '\\' + linuxPath.replace(/\//gi,'\\');
}

export function translateToLinuxPath(linuxPath: string): string{
    return linuxPath.replace(projectFileProvider.winBaseFolder, projectFileProvider.wineBaseFolder).replace(/\\/gi,'/');
}