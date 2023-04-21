
import * as vscode from 'vscode';
import { TextEncoder } from 'util';
import { VSProjectTreeItem } from './explorer/projectFilesProvider';
import { runMiniPro } from './svc.minipro';
import { runISP } from './svc.atmisp';

export async function registerDeployJedCommand(cmdDeployJed:  string, context: vscode.ExtensionContext) {

	//if project type is minipro, deploy using minipro, otherwise run aspisp
	const cmdRegisterDeployJdecHandler = async (treeItem: VSProjectTreeItem) => {
		if(treeItem){
			if(await treeItem.project.deviceProgrammer() === "minipro"){
				runMiniPro(treeItem.project);
			}
			else{
				runISP(treeItem.project);
			}
		}else{

		}
	}
	await context.subscriptions.push(vscode.commands.registerCommand(cmdDeployJed, cmdRegisterDeployJdecHandler));
}






