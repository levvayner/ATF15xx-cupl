// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { registerDeployJedCommand } from "./svc.deploy";
import {
  registerCloseProjectCommand,
  registerConfigureProjectCommand,
  registerCreateProjectCommand,
  registerDeleteFileCommand,
  registerImportProjectCommand,
  registerOpenProjectCommand,
} from "./svc.project";
import { registerCompileProjectCommand } from "./svc.build";
import {
  registerDeploySvfCommand,
  registerISPCommand,
} from "./svc.atmisp";
import {
  ProjectFilesProvider,
  VSProjectTreeItem,
  projectFileProvider,
} from "./explorer/projectFilesProvider";
import { registerCheckPrerequisite } from "./explorer/systemFilesValidation";
import { registerMiniProCommand } from "./svc.minipro";
import {
  ProjectTasksProvider,
  projectTasksProvider,
} from "./explorer/projectTasksProvider";
import {
  checkPrerequisiteCommand,
  closeProjectCommand,
  compileProjectCommand,
  configureProjectCommand,
  createProjectCommand,
  deleteEntryCommand,
  deployJedCommand,
  deploySvfCommand,
  editEntryCommand,
  importProjectCommand,
  openProjectCommand,
  openSettingsCommand,
  runISPCommand,
  runMiniProCommand,
} from "./vs.commands";
// import { PldEditorProvider } from './editor/pldEditorProvider.ts.old';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log("Activating VS VS Programmer extension");
  await ProjectFilesProvider.init();

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
    "VS-Cupl-project-files",
    projectFileProvider
  );
  vscode.window.registerTreeDataProvider(
    "VS-Cupl-project-tasks",
    projectTasksProvider
  );

  await registerOpenSettingsCommand(openSettingsCommand, context);
  await registerEditFileCommand(editEntryCommand, context);
  await registerDeploySvfCommand(deploySvfCommand, context);
  await registerCreateProjectCommand(createProjectCommand, context);
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

  // supportedDevices = new devices();
  // supportedDevices.init(path.join(
  //   ".",
  //   "src",
  //   "devices",
  //   "device-list.json"));
  // context.subscriptions.push(PldEditorProvider.register(context));
}

// This method is called when your extension is deactivated
export function deactivate() {}

async function registerEditFileCommand(
  command: string,
  context: vscode.ExtensionContext
) {
  const handlerOpenSettings = async (treeItem: VSProjectTreeItem) => {
    vscode.commands.executeCommand(
      "vscode.open",
      vscode.Uri.parse(treeItem.file)
    );
  };

  await context.subscriptions.push(
    vscode.commands.registerCommand(command, handlerOpenSettings)
  );
}

async function registerOpenSettingsCommand(
  command: string,
  context: vscode.ExtensionContext
) {
  const handlerOpenSettings = async () => {
    vscode.commands.executeCommand(
      "workbench.action.openSettings",
      "@ext:VaynerSystems.VS-Cupl"
    );
  };

  await context.subscriptions.push(
    vscode.commands.registerCommand(command, handlerOpenSettings)
  );
}
