import * as cp from "child_process";
import * as vscode from 'vscode';
import { projectFileProvider } from "../explorer/projectFilesProvider";
import { isWindows } from "./platform";
export let atfOutputChannel: vscode.OutputChannel;
export let runInIntegratedTerminal = false;
export class Command{
    private debugMessages: boolean = false;
    constructor(){
        if(!atfOutputChannel){
            atfOutputChannel = vscode.window.createOutputChannel('VS Output');
        }
        const extConfig = vscode.workspace.getConfiguration('vs-cupl');
        this.debugMessages = extConfig.get('DebugLevel') as boolean;
    }
    
    async runCommand(title: string, workingPath: string | undefined, buildCommand: string): Promise<ShellResponse> {
        const extConfig = vscode.workspace.getConfiguration('vs-cupl');
        this.debugMessages = extConfig.get('DebugLevel') as boolean;
        if(runInIntegratedTerminal){
            // call terminal to run md file
            var t = vscode.window.terminals.find(t => t.name === title);
            if(t === undefined){
                t = vscode.window.createTerminal( title);		            
            }
            
            //set folder
            if(workingPath !== undefined){          
                t.sendText(`cd "${workingPath}"`);
            }
            else if(workingPath === undefined){
                t.sendText(`cd "${ isWindows() ? projectFileProvider.winBaseFolder : projectFileProvider.wineBaseFolder}"`);
            }

            t.show();
            t.sendText(buildCommand);
            return {responseCode: 0, responseError: undefined, responseText:'Terminal feedback is unavailable in integrated terminal mode.'};
        } else {
            try{
                atfOutputChannel.show();
                if(this.debugMessages){
                    atfOutputChannel.appendLine(`Executing Command [ ${buildCommand} ] @ ${new Date().toLocaleString()}`);
                }
                
                //set folder                
                buildCommand = (workingPath !== undefined && workingPath.length > 0 ? `cd "${workingPath}"` : `cd "${isWindows() ? projectFileProvider.winBaseFolder : projectFileProvider.wineBaseFolder}"` ) + ' && ' + buildCommand;
                const cmdResponse = await this.execShell(`${buildCommand}`);	
                if(this.debugMessages){
                    atfOutputChannel.appendLine('>>' + cmdResponse.responseText.replace('\r\n', '\n') + ' @ ' + new Date().toLocaleString());
                }
                //vscode.window.showInformationMessage(cmdResponse.responseText.replace('\r\n', '\n'));
                return cmdResponse;
            } catch(err: any){	
                atfOutputChannel.appendLine(' @ ' + new Date().toLocaleString() + ':' + err.responseText.replace('\r\n', '\n'));
                //vscode.window.showErrorMessage(err.responseError.message, err.responseError.stack);	
                return err;
            }
        }
        
        
    }
    
    
    private execShell = (cmd: string) =>
        new Promise<ShellResponse>((resolve, reject) => {
            cp.exec(cmd, (err, out) => {
                if (err) {				
                    if(atfOutputChannel && this.debugMessages){
                        atfOutputChannel.appendLine(`Error executing: ${cmd}\nOutput:\n${out}\nError Details:\n${err.message}`);
                    }
                    
                    return reject(
                        new ShellResponse((err as any).code, out, err)) ;
                }
                return resolve(new ShellResponse(0, out, undefined) );
            });
        });
    
    } 

    export class ShellResponse{
        
        constructor(
            readonly responseCode: number,
            readonly responseText: string,
            readonly responseError: any | undefined
        ){
    
        }
    }




