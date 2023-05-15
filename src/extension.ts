import * as vscode from "vscode";
import { registerDeployJedCommand } from "./svc.deploy-jed";
import { 
    registerCloneProjectCommand, registerCloseProjectCommand, registerConfigureProjectCommand, 
    registerCreateProjectCommand, registerDeleteFileCommand, registerImportProjectCommand, registerOpenProjectCommand
} from "./svc.project";
import { registerCompileProjectCommand } from "./svc.build";
import { registerISPCommand } from "./svc.atmisp";
import {
    ProjectFilesProvider,
    VSProjectTreeItem,
} from "./explorer/project-files-provider";
import { registerCheckPrerequisite } from "./explorer/system-files-validation";
import { registerMiniProCommand, registerMiniProDumpCommand, registerMiniProEraseCommand } from "./svc.minipro";
import {
    ProjectTasksProvider,
    projectTasksProvider,
} from "./explorer/project-tasks-provider";
import * as cmd from "./vs.commands";
import { registerOpenInExplorerCommand } from "./explorer/fileFunctions";
import { registerVariableExtensionProvider } from "./editor/variableProvider";
import { registerDeploySvfCommand, registerEraseSvfCommand } from "./svc.deploy-svf";
import { StateProjects } from "./state.projects";
import { registerOpenSettingsCommand, registerEditFileCommand } from "./extension/file-provider";
import { registerSemanticTokenProvider } from "./inspect/sematic-token-provider";
import { registerChipViewPanelProvider } from "./editor/chip-view";
import { registerPinViewPanelProvider } from "./editor/pin-view";
import { registerActiveProjectPanelProvider } from "./editor/active-project-view";


export async function activate(context: vscode.ExtensionContext) {
    console.log("Activating VS VS Programmer extension");

    extensionUri = context.extensionUri;

    await registerProjectViewProviders(context);
    await registerCommands(context);    
    await registerCheckPrerequisite(cmd.checkPrerequisiteCommand, context);
    await registerCodeProvider(context);    
}
export function deactivate() {}
export let extensionUri: vscode.Uri;

async function registerCommands(context: vscode.ExtensionContext){
    await registerOpenInExplorerCommand(cmd.openInExplorerCommand, context);
    await registerOpenSettingsCommand(cmd.openSettingsCommand, context);
    await registerEditFileCommand(cmd.editEntryCommand, context);
    await registerEraseSvfCommand(cmd.eraseSvfCommand, context);
    await registerDeploySvfCommand(cmd.deploySvfCommand, context);
    await registerCreateProjectCommand(cmd.createProjectCommand, context);
    await registerCloneProjectCommand(cmd.cloneProjectCommand, context);
    await registerConfigureProjectCommand(cmd.configureProjectCommand, context);
    await registerOpenProjectCommand(cmd.openProjectCommand, context);
    await registerImportProjectCommand(cmd.importProjectCommand, context);
    await registerCloseProjectCommand(cmd.closeProjectCommand, context);
    await registerCompileProjectCommand(cmd.compileProjectCommand, context);
    await registerDeleteFileCommand(cmd.deleteEntryCommand, context);
    await registerDeployJedCommand(cmd.deployJedCommand, context);
    await registerISPCommand(cmd.runISPCommand, context);
    await registerMiniProCommand(cmd.runMiniProCommand, context);
    await registerMiniProDumpCommand(cmd.runMiniProDumpCommand, context);
    await registerMiniProEraseCommand(cmd.runMiniProEraseChipCommand, context);
}

async function registerProjectViewProviders(context: vscode.ExtensionContext){
    await StateProjects.init();
    await ProjectTasksProvider.init();
    const projectFileProvider = await ProjectFilesProvider.instance();

   

    const rootPath =
        vscode.workspace.workspaceFolders &&
        vscode.workspace.workspaceFolders.length > 0
            ? vscode.workspace.workspaceFolders[0].uri.fsPath
            : undefined;
    if (rootPath !== undefined) {
        projectFileProvider.setWorkspace(rootPath[0]);
        vscode.window.setStatusBarMessage("No open folder found!", 2000);
    }
    vscode.window.registerTreeDataProvider("vs-cupl-project-files", projectFileProvider);
    vscode.window.registerTreeDataProvider("vs-cupl-project-tasks", projectTasksProvider);

    await registerActiveProjectPanelProvider(context);
    await registerChipViewPanelProvider(context);
    await registerPinViewPanelProvider(context);
}

async function registerCodeProvider(context: vscode.ExtensionContext) {
    await registerVariableExtensionProvider(context);
    await registerSemanticTokenProvider(context);
}

