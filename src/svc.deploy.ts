
import * as vscode from 'vscode';
import { WorkingCompileData, WorkingData } from './types';
import { runUpdate } from './svc.project';
import { TextEncoder } from 'util';
import { projectFileProvider } from './explorer/projectFilesProvider';

export async function registerDeploySvfCommand(cmdDeploySvf:  string, context: vscode.ExtensionContext) {
	
	const cmdDeploySvfHandler = async (fileName: string) => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		
		//const rootUrl = vscode.workspace.workspaceFolders;
		const svfFiles = await vscode.workspace.findFiles('**.svf');
		let workingFile = new WorkingCompileData();

		if(svfFiles === undefined){
			vscode.window.showErrorMessage('No SVF Files found to deploy');
			return;
		}
		//get pld file opened
		if(svfFiles.length > 1){
			var selectProjectWindowResponse = await vscode.window.showQuickPick(
				svfFiles.map( ru => ru.path),{
					canPickMany: false,
					title: 'Select Project File to compile'
				}
			);
			if(selectProjectWindowResponse === undefined){
				vscode.window.setStatusBarMessage('Did not select a project file',5000);
				return;
			}

			
			
			if(!selectProjectWindowResponse || selectProjectWindowResponse?.length === 0 ){
				vscode.window.showErrorMessage('No project selected to deploy');
				return;
			}
			workingFile = setWorkingFileData(selectProjectWindowResponse) as WorkingCompileData;
			
		} else{
			//run update
			workingFile = setWorkingFileData(svfFiles[0].path) as WorkingCompileData;			
		}	
		
		workingFile.buildFileName = `build/${workingFile.workingFileNameWithoutExtension}.sh`;
		workingFile.buildFileUri = workingFile.projectPath + '/' + workingFile.buildFileName;

		runUpdate(workingFile);

		projectFileProvider.refresh();
	};
	await context.subscriptions.push(vscode.commands.registerCommand(cmdDeploySvf, cmdDeploySvfHandler));
	//register channel
	

}

export async function createDeployFile(deployData: WorkingCompileData){
	const buildFileHeader = '# VS ATF1504 Builder file\n';
	//if first build file	
	await vscode.workspace.fs.writeFile(vscode.Uri.parse( deployData.buildFileUri) , new TextEncoder().encode(buildFileHeader));
	var d = await vscode.workspace.openTextDocument(deployData.buildFileUri);

	var runDate = new Date();
	var editor = await vscode.window.showTextDocument(d);
	editor.edit(document => {
		const startLine = d.lineCount === 0 ? 0 : 1;
		document.insert(new vscode.Position(startLine,0), `#  Deployment file created at ${runDate.toLocaleString()}\n`);
	});		
}



export async function editLast(svfData: WorkingCompileData): Promise<boolean>{
	const editDocumentUri = vscode.Uri.parse(svfData.buildFileUri);		
	var d = await vscode.workspace.openTextDocument(editDocumentUri);
			
	var runDate = new Date();
	var editor = await vscode.window.showTextDocument(d);		
	
			
	var startWritingLineIdx = 0;
	for(startWritingLineIdx; startWritingLineIdx < d.lineCount;startWritingLineIdx++){
		//find last ExecutedOn
		var found = d.lineAt(startWritingLineIdx).text.includes('Executed on');
		if(found){
			break;
		}
	}
	var editBuilder = await editor.edit(
		editBuilder => {	
			
			var range = new vscode.Range(new vscode.Position(startWritingLineIdx,0), new vscode.Position(d.lineCount,0));
			var text = '#  Executed on ' + runDate.toLocaleString() + '\n';
			text += `openocd -f /usr/share/openocd/scripts/interface/ftdi/um232h.cfg  -c 'adapter_khz 400' -c 'transport select jtag' -c 'jtag newtap ATF1504AS tap -irlen 3 -expected-id 0x0151403f' -c init -c 'svf "${svfData.wokringFileUri}"'  -c 'sleep 200' -c shutdown \n`;
			editBuilder.replace(range, text);

		});

	var saved = await d.save();
	
	return saved;
}





export function setWorkingFileData(workingFile: string, trimPath: string | undefined = undefined): WorkingData{
	var workingFileName = workingFile.substring(workingFile.lastIndexOf('/') + 1);
	var workingFileNameWithoutExtension = workingFileName.substring(0,workingFileName.indexOf('.'));
	if(trimPath !== undefined){
		workingFile = workingFile.replace(trimPath,'');
	}
	var projectPath =  workingFile.substring(0, workingFile.lastIndexOf('/') );
	// if build folder, project path and name are one level up
	if(projectPath.endsWith('/build')){
		projectPath = projectPath.substring(0, projectPath.lastIndexOf('/') );
	}
	// var buildFileName = `build/${workingFileNameWithoutExtension}.sh`;
	return {
		wokringFileUri: workingFile,
		wokringFile: workingFileName,
		projectPath: projectPath,
		projectName: projectPath.substring(projectPath.lastIndexOf('/')+ 1),
		// buildFileName: buildFileName,
		// buildFileUri: projectPath + '/' + buildFileName,
        workingFileNameWithoutExtension: workingFileNameWithoutExtension
	};
}

