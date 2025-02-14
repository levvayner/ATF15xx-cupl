import * as vscode from "vscode";
import {
    VSProjectTreeItem,
    ProjectFilesProvider,
} from "./explorer/project-files-provider";
import { copyToLinux, copyToWindows } from "./explorer/fileFunctions";
import { Command, atfOutputChannel } from "./os/command";
import { Project } from "./project";
import { isWindows } from "./os/platform";
import { projectFromTreeItem } from "./svc.project";
import { stateProjects } from "./state.projects";
import { getNameFromPldFile } from "./explorer/project-file-functions";
import { homedir } from "os";
import path = require("path");

export async function registerCompileProjectCommand(
    compileProjectCommandName: string,
    context: vscode.ExtensionContext
) {
    const projectFileProvider = await ProjectFilesProvider.instance();
    const cmdCompileProjectHandler = async (
        treeItem: VSProjectTreeItem | vscode.Uri
    ) => {
        let project = await projectFromTreeItem(treeItem);
        if (treeItem === undefined && vscode.window.activeTextEditor) {
            //try get from active window
            const p = vscode.window.activeTextEditor.document.uri.fsPath;
            project = stateProjects.getOpenProject(
                vscode.Uri.parse(p.substring(0, p.lastIndexOf("/")))
            );
        }

        if (!project) {
            atfOutputChannel.appendLine(
                `Failed to deploy JEDEC file. Unable to read project information`
            );
            return;
        }

        const pldFiles = await vscode.workspace.findFiles(
            `**${project.pldFilePath.path.replace(
                project.projectPath.path,
                ""
            )}`
        );

        if (pldFiles === undefined) {
            vscode.window.showErrorMessage("No PLD Files found to build");
            return;
        }
        await vscode.workspace.saveAll();
        await buildProject(project);
        await projectFileProvider.refresh();
    };
    await context.subscriptions.push(
        vscode.commands.registerCommand(
            compileProjectCommandName,
            cmdCompileProjectHandler
        )
    );
}

export async function buildProject(project: Project) {
    let cmdString = "";
    const cmd = new Command();
    const extConfig = vscode.workspace.getConfiguration("vs-cupl");
    const cuplBinPath =
        (extConfig.get("CuplBinPath") as string) ?? isWindows()
            ? "C:\\Wincupl\\shared\\cupl.exe"
            : "~/.wine/drive_c/Wincupl/shared/cupl.exe";
    const cuplDLPath =
        (extConfig.get("CuplDLPath") as string) ?? isWindows()
            ? "C:\\Wincupl\\shared"
            : "~/.wine/drive_c/Wincupl/shared/";
    const cuplOptimization =
        (extConfig.get("CuplOptimization") as number);
    const cuplFittersPath =
        (extConfig.get("CuplFittersPath") as string) ?? isWindows()
            ? "C:\\Wincupl\\WinCupl\\Fitters"
            : "~/.wine/drive_c/Wincupl/WinCupl/Fitters/";
    const projectFileProvider = await ProjectFilesProvider.instance();
    const cuplWindowsBinPath = cuplBinPath
        .replace("~", homedir())
        .replace(
            projectFileProvider.wineBaseFolder,
            projectFileProvider.winBaseFolder
        )
        .replace(/\//gi, "\\");
    const cuplWindowsDLPath = cuplDLPath
        .replace("~", homedir())
        .replace(
            projectFileProvider.wineBaseFolder,
            projectFileProvider.winBaseFolder
        )
        .replace(/\//gi, "\\");
    const libPath = path.join(
        cuplWindowsDLPath,
        (extConfig.get("CuplDefinitions") ?? "Atmel") + ".dl"
    );

    const cuplWindowsFittersPath = cuplFittersPath
        .replace("~", homedir())
        .replace(
            projectFileProvider.wineBaseFolder,
            projectFileProvider.winBaseFolder
        )
        .replace(/\//gi, "\\");

    //copy to working folder
    if (!isWindows()) {
        const cpToWinResponse = await copyToWindows(project.pldFilePath.path);
        if (cpToWinResponse.responseCode !== 0) {
            return;
        }

        //run cupl
        vscode.window.setStatusBarMessage(
            "Updating project " + project.projectName,
            5000
        );
        cmdString = `WINEPATH="${cuplWindowsFittersPath}" wine "${cuplWindowsBinPath}" -m${cuplOptimization}lxfjnabe -u "${libPath}" "${project.windowsPldFilePath}"`;
    } else {
        cmdString = `${cuplWindowsBinPath} -m1lxnfjnabe -u "${libPath}" "${project.pldFilePath.fsPath}"`;
    }

    //execute build command
    const result = await cmd
        .runCommand("vs-cupl Build", `${project.projectPath.fsPath}`, cmdString)
        .then((result) => {
            if (result.responseCode !== 0) {
                atfOutputChannel.appendLine(
                    "** Failed to build: ** " +
                        project.projectName +
                        ". " +
                        result.responseError
                );
            } else {
                atfOutputChannel.appendLine(
                    `** Built module ** ${project.projectName} successfully`
                );
            }
        })
        .catch((err) => {
            atfOutputChannel.appendLine(
                "** Critical Error! Failed to build: ** " +
                    project.projectName +
                    ". " +
                    err.message
            );
        });

    if (!isWindows()) {
        //copy results back
        let fileName = project.device?.usesPldNameFieldForJedFile
            ? await getNameFromPldFile(project.pldFilePath)
            : project.jedFilePath.fsPath.substring(
                  project.jedFilePath.fsPath.lastIndexOf("/")
              );

        await copyToLinux(`${fileName}`, `${project.projectPath.fsPath}`);
    }
    await projectFileProvider.refresh();
    vscode.window.setStatusBarMessage("Compiled " + project.projectName, 2000);
}
