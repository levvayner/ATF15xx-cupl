
import * as vscode from 'vscode';
import { TextEncoder } from 'util';
import { VSProjectTreeItem } from './explorer/projectFilesProvider';
import { runMiniPro } from './svc.minipro';
import { runISP, updateDeploySVFScript } from './svc.atmisp';

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







// export function openProject(workingFile: string, ){
// 	var workingFileName = workingFile.substring(workingFile.lastIndexOf('/') + 1);
// 	var workingFileNameWithoutExtension = workingFileName.substring(0,workingFileName.indexOf('.'));
// 	var workingFileExtension = workingFile.substring(workingFile.lastIndexOf('.'));
// 	if(trimPath !== undefined){
// 		workingFile = workingFile.replace(trimPath,'');
// 	}
// 	var projectPath =  workingFile.substring(0, workingFile.lastIndexOf('/') );
// 	// if build folder, project path and name are one level up
// 	if(projectPath.endsWith('/build')){
// 		projectPath = projectPath.substring(0, projectPath.lastIndexOf('/') );
// 	}
// 	// var buildFileName = `build/${workingFileNameWithoutExtension}.sh`;
// 	return {
// 		wokringFileUri: workingFile,
// 		wokringFile: workingFileName,
// 		projectPath,
// 		projectName: projectPath.substring(projectPath.lastIndexOf('/')+ 1),
// 		// buildFileName: buildFileName,
// 		// buildFileUri: projectPath + '/' + buildFileName,
//         workingFileNameWithoutExtension,
// 		workingFileExtension

// 	};
// }

// export function setWorkingFileData(workingFile: string, trimPath: string | undefined = undefined): WorkingData{
// 	var workingFileName = workingFile.substring(workingFile.lastIndexOf('/') + 1);
// 	var workingFileNameWithoutExtension = workingFileName.substring(0,workingFileName.indexOf('.'));
// 	var workingFileExtension = workingFile.substring(workingFile.lastIndexOf('.'));
// 	if(trimPath !== undefined){
// 		workingFile = workingFile.replace(trimPath,'');
// 	}
// 	var projectPath =  workingFile.substring(0, workingFile.lastIndexOf('/') );
// 	// if build folder, project path and name are one level up
// 	if(projectPath.endsWith('/build')){
// 		projectPath = projectPath.substring(0, projectPath.lastIndexOf('/') );
// 	}
// 	// var buildFileName = `build/${workingFileNameWithoutExtension}.sh`;
// 	return {
// 		wokringFileUri: workingFile,
// 		wokringFile: workingFileName,
// 		projectPath,
// 		projectName: projectPath.substring(projectPath.lastIndexOf('/')+ 1),
// 		// buildFileName: buildFileName,
// 		// buildFileUri: projectPath + '/' + buildFileName,
//         workingFileNameWithoutExtension,
// 		workingFileExtension

// 	};
// }

