import * as cp from "child_process";
import * as vscode from 'vscode';
import { wineBaseFolder } from "../explorer/fileFunctions";
export let errorChannel: vscode.OutputChannel;
export let runInIntegratedTerminal = false;
export class Command{
    constructor(){
        if(!errorChannel){
            errorChannel = vscode.window.createOutputChannel('ATF15xx Output');
        }
    }
    
    async runCommand(title: string, workingPath: string | undefined, buildCommand: string): Promise<ShellResponse> {
        if(runInIntegratedTerminal){
            // call terminal to run md file
            var t = vscode.window.terminals.find(t => t.name === title);
            if(t === undefined){
                t = vscode.window.createTerminal( title);		            
            }
            if(workingPath !== undefined){          
                t.sendText(`cd "${workingPath}"`);
            }
            else if(workingPath === undefined){
                t.sendText(`cd "${wineBaseFolder}"`);
            }
            t.show();
            t.sendText(buildCommand);
            return {responseCode: 0, responseError: undefined, responseText:'Terminal feedback is unavailable in integrated terminal mode.'};
        } else {
            try{
                const cmdResponse = await this.execShell(`${buildCommand}`);	
                vscode.window.showInformationMessage(cmdResponse.responseText.replace('\r\n', '\n'));
                return cmdResponse;
            } catch(err: any){	
                vscode.window.showErrorMessage(err.responseError.message, err.responseError.stack);	
                return err;
            }
        }
        
        
    }
    
    
    execShell = (cmd: string) =>
        new Promise<ShellResponse>((resolve, reject) => {
            cp.exec(cmd, (err, out) => {
                if (err) {				
                    if(errorChannel){
                        errorChannel.appendLine(`Error executing: ${cmd}\nOutput:\n${out}\nError Details:\n${err.message}`);
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




