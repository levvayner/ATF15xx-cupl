import { Command, ShellResponse, atfOutputChannel } from "../os/command";
import * as vscode from 'vscode';
import { projectFileProvider } from "./projectFilesProvider";
import { isWindows } from "../os/platform";
export class prerequisiteValidation{
    validOCDFound = false;
    validATMSIMFound = false;
    validCuplFound = false;
}

export async function registerCheckPrerequisite(checkPrerequisiteCommandName: string, context: vscode.ExtensionContext) {
	
	const cmdCheckPrerequisiteHandler = async () => {
        const extConfig = vscode.workspace.getConfiguration('vs-cupl');
        let failedAny = false;
        const command = new Command();
        atfOutputChannel.appendLine('Running Pre-requisite checks');
        var cuplCheck = await command.runCommand('vs-cupl Prerequisites', context.extensionPath, isWindows() ? projectFileProvider.cuplBinPath : `wine ${projectFileProvider.cuplBinPath}`);
        var wineCheck = isWindows() ? {responseCode: 0, responseText:'Bypass. Running on Windows'} as ShellResponse : await command.runCommand('vs-cupl Prerequisites',context.extensionPath, 'wine --version');
        var openOCDCheck = await command.runCommand('vs-cupl Prerequisites',projectFileProvider.openOcdBinPath, 'openocd --version');
        var miniproCheck = await command.runCommand('vs-cupl Prerequisites',projectFileProvider.miniproPath, 'minipro --version');
        if(cuplCheck.responseCode !== 0){
            vscode.window.showErrorMessage('** Failed to load Cupl prerequisite: ** ' + `${projectFileProvider.cuplBinPath}`);
            atfOutputChannel.appendLine('[Read about Pre-requisites](./README.md) ');
            failedAny = true;
        } else { atfOutputChannel.appendLine('Cupl.exe is OK!');}
        if(wineCheck.responseCode !== 0){
            vscode.window.showErrorMessage('** Failed to load Wine prerequisite: **' + wineCheck.responseText);
            failedAny = true;
        } else { atfOutputChannel.appendLine('wine     is OK!');}
        if(openOCDCheck.responseCode !== 0 && !isWindows()){
            vscode.window.showErrorMessage('** Failed to load openOCD prerequisite: **' + openOCDCheck.responseText);
            await command.runCommand('vs-cupl Prerequisites',context.extensionPath, 'sudo apt install openocd');
            failedAny = true;
        } else if(openOCDCheck.responseCode !== 0 && isWindows()){
            vscode.window.showErrorMessage('** Failed to load openOCD prerequisite: **' + openOCDCheck.responseText);
            atfOutputChannel.appendLine(`OpenOCD not found. Verify you've added its path\n e.g.\n\tSETX PATH "%PATH%;C:\\Programs\\xpack-openocd-0.12.0-1-win32-x64\\xpack-openocd-0.12.0-1\\bin"`);
            failedAny = true;
        }
        else { atfOutputChannel.appendLine('openocd  is OK!');}        
        
        if(miniproCheck.responseCode !== 0 && !isWindows()){
            vscode.window.showErrorMessage('** Failed to load minipro prerequisite ** ');
            const cmd = `
sudo apt-get install build-essential pkg-config git libusb-1.0-0-dev fakeroot debhelper dpkg-dev && 
git clone https://gitlab.com/DavidGriffith/minipro.git && 
cd minipro && 
fakeroot dpkg-buildpackage -b -us -uc && 
sudo dpkg -i ../minipro_0.4-1_amd64.deb`;
            await vscode.window.showInformationMessage('Run the following command in your terminal to install minipro:' + cmd);
            //await command.runCommand('vs-cupl Prerequisites',context.extensionPath, cmd);
            failedAny = true;
            //miniproCheck = await command.runCommand('vs-cupl Prerequisites',context.extensionPath, 'minipro --version');
        } 
        else if(miniproCheck.responseCode !== 0 && isWindows()){
            var miniproOk = false;
            vscode.window.showErrorMessage('** Failed to load minipro prerequisite ** ');
            //check path
            atfOutputChannel.appendLine(`Minipro not found. Check if executable is in PATH variable...`);
            var pathResp = await command.runCommand('vs-cupl Prerequisites',projectFileProvider.miniproPath,'echo %PATH%');
            atfOutputChannel.appendLine(`# ------- \n${pathResp.responseText}`);
            if(!pathResp.responseText.includes('minipro')){
                const cmdPathAdd = `cd c:\\msys64\\home\\%USERNAME%\\minipro\nSETX PATH "%PATH%;%cd%;C:\\msys64\\Usr\\bin"`;
                const cmdPathAddResponse = await command.runCommand('',projectFileProvider.miniproPath, cmdPathAdd);
                miniproCheck = await command.runCommand('vs-cupl Prerequisites',context.extensionPath, 'minipro --version');
                if(miniproCheck.responseCode === 0)
                {
                    miniproOk = true;
                }
            }
            if(!miniproOk){
            const cmd = `
# ------------------------------------------------------------------
Install MSYS2 from here: [MSYS2](https://www.msys2.org/)
** In msys2 terminal **
pacman -S mingw-w64-ucrt-x86_64-gcc
pacman -S make
pacman -S pkg-config
pacman -S git
pacman -S gcc


git clone https://gitlab.com/DavidGriffith/minipro.git
cd minipro

#fix errors preventing compilation
echo -e '#include "minipro.h" \n#include "version.h"' > version.c
echo -e '#define VERSION "0.6"\n#ifndef GIT_DATE\n\t#define GIT_DATE "01/01/2001"\n#endif\n#ifndef GIT_BRANCH\n\t#define GIT_BRANCH "main"\n#endif\n#ifndef  GIT_HASH\n\t#define GIT_HASH "blahblahblah"\n#endif' > version.h

make

cd c:\\msys64\\home\\%USERNAME%\\minipro
set PATH=%PATH%;%cd%;

** In command prompt or powershell (NOT MSYS2)
cd [path of where minipro build saved minipro.exe]
e.g.
cd c:\\msys64\\home\\%USERNAME%\\minipro
set PATH=%PATH%;%cd%;C:\\msys64\\Usr\\bin
# ------------------------------------------------------------------
exit`
                await atfOutputChannel.appendLine('Follow these instructions to install minipro on windows:' + cmd);
                //await command.runCommand('vs-cupl Prerequisites',context.extensionPath, cmd);
                failedAny = true;
                //miniproCheck = await command.runCommand('vs-cupl Prerequisites',context.extensionPath, 'minipro --version');
            }
            else { atfOutputChannel.appendLine('minipro  is OK!');}
        } 
        else { atfOutputChannel.appendLine('minipro  is OK!');}
        atfOutputChannel.appendLine(failedAny === true ? '** Failed ** preqrequisite checks! ' : 'Passed Pre-requisite checks');
	};
	await context.subscriptions.push(vscode.commands.registerCommand(checkPrerequisiteCommandName,cmdCheckPrerequisiteHandler));
}