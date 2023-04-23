import * as vscode from 'vscode';
import { Command, ShellResponse, atfOutputChannel } from '../os/command';
import { VSProjectTreeItem, projectFileProvider } from './projectFilesProvider';
import { getOSCharSeperator } from '../os/platform';

/// source is full path to file
/// Copies selected file to working folder on windows path
/// Cupl generates max of 9 character file name for jed
export async function copyToWindows(sourceFile: string): Promise<ShellResponse>{
    //copy to w`orking folder
    
    const fileToCopy = sourceFile.substring(0,sourceFile.lastIndexOf('/'));
    const cmdCopyFilesToWorkingFolder = `mkdir -p "${projectFileProvider.workingLinuxFolder }" && cp -fR ${sourceFile} ${projectFileProvider.workingLinuxFolder}`;
    const cpResult  = await new Command().runCommand('vs-cupl Build', fileToCopy, cmdCopyFilesToWorkingFolder);
    if(cpResult.responseCode !== 0){
        vscode.window.showErrorMessage(`Error copying to working folder\n${cpResult.responseText}\n** ERROR OCCURED **\n${cpResult.responseError}`);       
    }
    atfOutputChannel.appendLine(`Copy to Windows command for file ${sourceFile} ${cpResult.responseCode === 0? 'completed successfully' : 'failed'}`  );
    return cpResult;
}

export async function copyToLinux(sourceFile: string, destinationPath: string){
    //copy results back
    const fileToCopy = sourceFile.substring(0,sourceFile.lastIndexOf('/'));
    if(fileToCopy.substring(0,fileToCopy.lastIndexOf('.')).length > 9){
        atfOutputChannel.appendLine('Warning: cupl only supports output of max 9 chars for .jed files!');
    }
	sourceFile = sourceFile.split(getOSCharSeperator()).filter(c => c.length > 0).join().trim();
	const cmdCopyFilesFromWorkingFolder = `mkdir -p "${destinationPath + '/build/'}" && cp -fR ${projectFileProvider.workingLinuxFolder}${getOSCharSeperator()}${sourceFile} ${destinationPath}`;
	const cpResult  = await new Command().runCommand('vs-cupl Build', sourceFile.substring(0,sourceFile.lastIndexOf('/')), cmdCopyFilesFromWorkingFolder);
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

export async function registerOpenInExplorerCommand(
    command: string,
    context: vscode.ExtensionContext
  ) {
    const handlerOpenInExplorer = async (treeItem: VSProjectTreeItem) => {
        //for prj files, open folder
        const openUri = (await vscode.workspace.fs.stat(vscode.Uri.parse( treeItem.file))).type === vscode.FileType.Directory?
            treeItem.file :
            treeItem.file.endsWith('.prj') ? 
                treeItem.file.substring(0,treeItem.file.lastIndexOf(getOSCharSeperator())) :
                treeItem.file;
      vscode.env.openExternal(vscode.Uri.parse(openUri));
    };
    await context.subscriptions.push(
        vscode.commands.registerCommand(command, handlerOpenInExplorer)
      );
}