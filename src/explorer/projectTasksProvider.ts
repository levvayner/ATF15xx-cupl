import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { homedir } from "os";
import { DeviceDeploymentType } from "../devices/devices";
import { Project } from "../types";
import { getOSCharSeperator } from "../os/platform";
import { atfOutputChannel } from "../os/command";
import { ProjectTreeViewEntry, VSProjectTreeItem, projectFileProvider } from "./projectFilesProvider";
export let treeItemProjects: VSProjectTreeItem[] = [];
export let projectTasksProvider: ProjectTasksProvider;
export class ProjectTasksProvider
  implements vscode.TreeDataProvider<ProjectTreeViewEntry>
{
  public openProjects: Project[] = [];
  private workspaceRoot: string = '';
  static async init() {
    projectTasksProvider = new ProjectTasksProvider();
    treeItemProjects = (await projectFileProvider.getValidProjects());
  }
  constructor() {
     
      
      this._onDidChangeTreeData = new vscode.EventEmitter<VSProjectTreeItem | undefined | null | void>();
      this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }
  
  // children: ProjectFile[] = [];
  getTreeItem(element: VSProjectTreeItem): vscode.TreeItem {
    let title = element.label;
    let result = new vscode.TreeItem(title,vscode.TreeItemCollapsibleState.None);    
    if(element.contextValue){
      result.contextValue = title;
    } else{
      result.contextValue = element.project.projectName;      
    }
    result.command = {command: 'vs-cupl-project-files.on_item_clicked', title, arguments: [element]};
    return result;
  }

  getChildren(element?: VSProjectTreeItem): Thenable<VSProjectTreeItem[]> {
    // if (!this.workspaceRoot) {
    //   vscode.window.showInformationMessage("No dependency in empty workspace");
    //   return Promise.resolve([]);
    // }
    try{
      if (!element) {
        return Promise.resolve(treeItemProjects);
        
      }
      // else if (element.file.toLowerCase().endsWith('.prj'))
      // {
      //   return Promise.resolve(this.getProjectFiles(element));    
      // }
      else {
        return Promise.resolve([]);
        //     
      }
    } catch(err: any){
      atfOutputChannel.appendLine('Error getting project children: ' + err.message);
      throw err;
    }
  }

  private _onDidChangeTreeData: vscode.EventEmitter<VSProjectTreeItem | undefined | null | void>;
  readonly onDidChangeTreeData: vscode.Event<VSProjectTreeItem | undefined | null | void>;

  public async refresh(): Promise<void> {
    this._onDidChangeTreeData.fire();
  }

  //one project per PLD
}

