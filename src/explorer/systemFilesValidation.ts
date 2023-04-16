import { Command, errorChannel } from "../os/command";
import { cuplBinPath, wineBaseFolder } from "./fileFunctions";
import * as vscode from 'vscode';
export class prerequisiteValidation{
    validOCDFound = false;
    validATMSIMFound = false;
    validCuplFound = false;
}

export async function registerCheckPrerequisite(checkPrerequisiteCommandName: string, context: vscode.ExtensionContext) {
	
	const cmdCheckPrerequisiteHandler = async () => {

        const command = new Command();
        var cuplCheck = await command.runCommand('ATF1504 Prerequisites', context.extensionPath,`wine ${cuplBinPath}cupl.exe`);
        var wineCheck = await command.runCommand('ATF1504 Prerequisites',context.extensionPath, 'wine --version');
        var openOCDCheck = await command.runCommand('ATF1504 Prerequisites',context.extensionPath, 'openocd --version');
        if(cuplCheck.responseCode !== 0){
            vscode.window.showErrorMessage('Failed to load Cupl prerequisite: ' + `${cuplBinPath}cupl.exe`);
            errorChannel.appendLine('[Read about Pre-requisites](./README.md) ');
        }
        if(wineCheck.responseCode !== 0){
            vscode.window.showErrorMessage('Failed to load Wine prerequisite: ' + wineCheck.responseText);
        }
        if(openOCDCheck.responseCode !== 0){
            vscode.window.showErrorMessage('Failed to load openOCD prerequisite: ' + openOCDCheck.responseText);
            await command.runCommand('ATF1504 Prerequisites',context.extensionPath, 'sudo apt install openocd');
            openOCDCheck = await command.runCommand('ATF1504 Prerequisites',context.extensionPath, 'openocd --version');
        }
	};
	await context.subscriptions.push(vscode.commands.registerCommand(checkPrerequisiteCommandName,cmdCheckPrerequisiteHandler));
}