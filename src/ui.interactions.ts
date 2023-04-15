import * as vscode from 'vscode';


export async function uiIntentDeployQuestion(){
	var selectedProjectOption = await vscode.window.showQuickPick(
		['No', 'Yes'],{
			canPickMany: false,
			title: 'Execute Deployment'
		}
	);
	
		if(!selectedProjectOption || selectedProjectOption?.length === 0 ){
			vscode.window.showErrorMessage('Must select option if to deploy or not');
			return;
		}
		return selectedProjectOption === 'Yes';
}

export async function uiEnterProjectName(): Promise<string> {
	var selectProjectName = await vscode.window.showInputBox({
			title: 'Specify Project Name'
		}
	);
    return selectProjectName ?? '';
}
