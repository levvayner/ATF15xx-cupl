
import * as vscode from 'vscode';
import { TextEncoder } from 'util';
import { VSProjectTreeItem, projectFileProvider } from './explorer/projectFilesProvider';
import { runMiniPro } from './svc.minipro';
import { runISP } from './svc.atmisp';
import { Project } from './types';
import { projectFromTreeItem } from './svc.project';
import { atfOutputChannel } from './os/command';

export async function registerDeployJedCommand(cmdDeployJed:  string, context: vscode.ExtensionContext) {

	//if project type is minipro, deploy using minipro, otherwise run aspisp
	const cmdRegisterDeployJdecHandler = async (treeItem: VSProjectTreeItem | vscode.Uri) => {
		const project = await projectFromTreeItem(treeItem);
		if(!project){
			atfOutputChannel.appendLine(`Failed to deploy JEDEC file. Unable to read project information`);
			return;
		}
		if(await project.deviceProgrammer() === "minipro"){
			runMiniPro(project);
		}
		else{
			runISP(project);
		}
	}
	await context.subscriptions.push(vscode.commands.registerCommand(cmdDeployJed, cmdRegisterDeployJdecHandler));
}






