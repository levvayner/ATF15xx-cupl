// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { registerDeployJedCommand } from "./svc.deploy-jed";
import {
    registerCloneProjectCommand,
    registerCloseProjectCommand,
    registerConfigureProjectCommand,
    registerCreateProjectCommand,
    registerDeleteFileCommand,
    registerImportProjectCommand,
    registerOpenProjectCommand,
} from "./svc.project";
import { registerCompileProjectCommand } from "./svc.build";
import { registerISPCommand } from "./svc.atmisp";
import {
    ProjectFilesProvider,
    VSProjectTreeItem,
} from "./explorer/project-files-provider";
import { registerCheckPrerequisite } from "./explorer/system-files-validation";
import { registerMiniProCommand } from "./svc.minipro";
import {
    ProjectTasksProvider,
    projectTasksProvider,
} from "./explorer/project-tasks-provider";
import {
    checkPrerequisiteCommand,
    cloneProjectCommand,
    closeProjectCommand,
    compileProjectCommand,
    configureProjectCommand,
    createProjectCommand,
    deleteEntryCommand,
    deployJedCommand,
    deploySvfCommand,
    editEntryCommand,
    importProjectCommand,
    openInExplorerCommand,
    openProjectCommand,
    openSettingsCommand,
    runISPCommand,
    runMiniProCommand,
} from "./vs.commands";
import { registerOpenInExplorerCommand } from "./explorer/fileFunctions";
import { registerVariableExtensionProvider } from "./editor/variableProvider";
import { registerDeploySvfCommand } from "./svc.deploy-svf";
import { Project } from "./types";
import { StateProjects, stateProjects } from "./state.projects";
import { registerOpenSettingsCommand, registerEditFileCommand } from "./extension/file-provider";
import { registerSemanticTokenProvider } from "./inspect/sematic-token-provider";
import { ChipViewProvider, registerChipViewPanelProvider } from "./editor/chip-view";
import { PinViewProvider, registerPinViewPanelProvider } from "./editor/pin-view";

// import { PldEditorProvider } from './editor/pldEditorProvider.ts.old';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log("Activating VS VS Programmer extension");

    const projectFileProvider = await ProjectFilesProvider.instance();
    await StateProjects.init();
    const rootPath =
        vscode.workspace.workspaceFolders &&
        vscode.workspace.workspaceFolders.length > 0
            ? vscode.workspace.workspaceFolders[0].uri.fsPath
            : undefined;
    if (rootPath !== undefined) {
        projectFileProvider.setWorkspace(rootPath[0]);
        vscode.window.setStatusBarMessage("No open folder found!", 2000);
    }
    //path of executing extension
    context.extensionPath;

    await ProjectTasksProvider.init();

    vscode.window.registerTreeDataProvider(
        "vs-cupl-project-files",
        projectFileProvider
    );
    vscode.window.registerTreeDataProvider(
        "vs-cupl-project-tasks",
        projectTasksProvider
    );
    await registerOpenInExplorerCommand(openInExplorerCommand, context);
    await registerOpenSettingsCommand(openSettingsCommand, context);
    await registerEditFileCommand(editEntryCommand, context);
    await registerDeploySvfCommand(deploySvfCommand, context);
    await registerCreateProjectCommand(createProjectCommand, context);
    await registerCloneProjectCommand(cloneProjectCommand, context);
    await registerConfigureProjectCommand(configureProjectCommand, context);
    await registerOpenProjectCommand(openProjectCommand, context);
    await registerImportProjectCommand(importProjectCommand, context);
    await registerCloseProjectCommand(closeProjectCommand, context);
    await registerCompileProjectCommand(compileProjectCommand, context);
    await registerDeleteFileCommand(deleteEntryCommand, context);
    await registerDeployJedCommand(deployJedCommand, context);
    await registerISPCommand(runISPCommand, context);
    await registerMiniProCommand(runMiniProCommand, context);

    await registerCheckPrerequisite(checkPrerequisiteCommand, context);

    await registerVariableExtensionProvider(context);

    
    await registerChipViewPanelProvider(context);
    await registerPinViewPanelProvider(context);

    await registerSemanticTokenProvider(context);
}
// This method is called when your extension is deactivated
export function deactivate() {}




