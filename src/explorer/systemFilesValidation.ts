import { Command, atfOutputChannel } from "../os/command";
import * as vscode from 'vscode';
import { projectFileProvider } from "./projectFilesProvider";
export class prerequisiteValidation{
    validOCDFound = false;
    validATMSIMFound = false;
    validCuplFound = false;
}

export async function registerCheckPrerequisite(checkPrerequisiteCommandName: string, context: vscode.ExtensionContext) {
	
	const cmdCheckPrerequisiteHandler = async () => {

        let failedAny = false;
        const command = new Command();
        atfOutputChannel.appendLine('Running Pre-requisite checks');
        var cuplCheck = await command.runCommand('VS-Cupl Prerequisites', context.extensionPath,`wine ${projectFileProvider.cuplBinPath}`);
        var wineCheck = await command.runCommand('VS-Cupl Prerequisites',context.extensionPath, 'wine --version');
        var openOCDCheck = await command.runCommand('VS-Cupl Prerequisites',context.extensionPath, 'openocd --version');
        var miniproCheck = await command.runCommand('VS-Cupl Prerequisites',context.extensionPath, 'minipro --version');
        if(cuplCheck.responseCode !== 0){
            vscode.window.showErrorMessage('** Failed to load Cupl prerequisite: ** ' + `${projectFileProvider.cuplBinPath}`);
            atfOutputChannel.appendLine('[Read about Pre-requisites](./README.md) ');
            failedAny = true;
        } else { atfOutputChannel.appendLine('Cupl.exe is OK!');}
        if(wineCheck.responseCode !== 0){
            vscode.window.showErrorMessage('** Failed to load Wine prerequisite: **' + wineCheck.responseText);
            failedAny = true;
        } else { atfOutputChannel.appendLine('wine     is OK!');}
        if(openOCDCheck.responseCode !== 0){
            vscode.window.showErrorMessage('** Failed to load openOCD prerequisite: **' + openOCDCheck.responseText);
            await command.runCommand('VS-Cupl Prerequisites',context.extensionPath, 'sudo apt install openocd');
            failedAny = true;
            openOCDCheck = await command.runCommand('VS-Cupl Prerequisites',context.extensionPath, 'openocd --version');
        } else { atfOutputChannel.appendLine('openocd  is OK!');}        
        if(miniproCheck.responseCode !== 0){
            vscode.window.showErrorMessage('** Failed to load minipro prerequisite: **  Downloading...');
            const cmd = `
sudo apt-get install build-essential pkg-config git libusb-1.0-0-dev fakeroot debhelper dpkg-dev
git clone https://gitlab.com/DavidGriffith/minipro.git
cd minipro
fakeroot dpkg-buildpackage -b -us -uc
sudo dpkg -i ../minipro_0.4-1_amd64.deb`;
            await command.runCommand('VS-Cupl Prerequisites',context.extensionPath, cmd);
            failedAny = true;
            openOCDCheck = await command.runCommand('VS-Cupl Prerequisites',context.extensionPath, 'minipro --version');
        } else { atfOutputChannel.appendLine('minipro  is OK!');}
        atfOutputChannel.appendLine(failedAny ?'** Failed ** preqrequisite checks! ' : 'Passed Pre-requisite checks');
	};
	await context.subscriptions.push(vscode.commands.registerCommand(checkPrerequisiteCommandName,cmdCheckPrerequisiteHandler));
}