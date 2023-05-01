import * as vscode from 'vscode';
import { VSProjectTreeItem } from '../explorer/project-files-provider';

export async function registerEditFileCommand(
    command: string,
    context: vscode.ExtensionContext
) {
    const handlerOpenSettings = async (treeItem: VSProjectTreeItem) => {
        vscode.commands.executeCommand(
            "vscode.open",
            vscode.Uri.file(treeItem.file.fsPath)
        );
    };

    await context.subscriptions.push(
        vscode.commands.registerCommand(command, handlerOpenSettings)
    );
}


export async function registerOpenSettingsCommand(
    command: string,
    context: vscode.ExtensionContext
) {
    const handlerOpenSettings = async () => {
        vscode.commands.executeCommand(
            "workbench.action.openSettings",
            "@ext:VaynerSystems.vs-cupl"
        );
    };

    await context.subscriptions.push(
        vscode.commands.registerCommand(command, handlerOpenSettings)
    );
}