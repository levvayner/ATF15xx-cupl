import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { homedir } from "os";
import { DeviceDeploymentType } from "../devices/devices";
import { Project } from "../types";
import { getOSCharSeperator } from "../os/platform";
import { atfOutputChannel } from "../os/command";

export let projectFileProvider: ProjectFilesProvider;
export class ProjectFilesProvider
  implements vscode.TreeDataProvider<ProjectTreeViewEntry>
{
  public readonly winBaseFolder: string;
  public readonly wineBaseFolder: string;
  public readonly wineBinPath: string;
  public readonly cuplBinPath: string; 
  public readonly openOcdBinPath: string;
  public readonly atmSimBinPath: string;
  public readonly winTempPath: string;
  public readonly workingLinuxFolder: string;
  public readonly workingWindowsFolder: string;
  public openProjects: Project[] = [];
  private workspaceRoot: string = '';
  static async init() {
    projectFileProvider = new ProjectFilesProvider();
  }
  constructor() {
     
      this.winBaseFolder = "C:\\";
      const extConfig = vscode.workspace.getConfiguration('ATF15xx-Cupl');
      this.wineBinPath =  extConfig.get('WinePath') ?? '/usr/lib/wine';
      this.wineBaseFolder = extConfig.get('WinCPath') ?? homedir + '/.wine/drive_c/';
      this.cuplBinPath = `${this.wineBaseFolder}${(extConfig.get('CuplBinPath') ?? 'WinCupl/shared/cupl.exe')}`; 
      this.openOcdBinPath = extConfig.get('OpenOCDPath')  ?? '/usr/bin/openocd';
      this.atmSimBinPath = this.wineBaseFolder + (extConfig.get('AtmIspBinPath') ?? 'ATMEL_PLS_Tools/ATMISP/ATMISP.exe');
      this.winTempPath = extConfig.get('WinTempPath') ?? 'temp';
      
      vscode.commands.registerCommand('atf15xx-project-files.on_item_clicked', item => this.openFile(item));
      vscode.commands.registerCommand('atf15xx-project-files.refreshEntry', () => this.refresh());
      this.workingLinuxFolder = this.wineBaseFolder + this.winTempPath;
      this.workingWindowsFolder = this.winBaseFolder + this.winTempPath;

      this._onDidChangeTreeData = new vscode.EventEmitter<ATF15xxProjectTreeItem | undefined | null | void>();
      this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }
  openFile(item: ProjectTreeViewEntry): any {
    if (item.file === undefined) return;
    // first we open the document
    vscode.workspace.openTextDocument(item.file).then( document => {
        // after opening the document, we set the cursor 
        // and here we make use of the line property which makes imo the code easier to read
        vscode.window.showTextDocument(document);
    });
  }

  async setWorkspace(workspace: string){
    this.workspaceRoot = workspace;    
  }

  // children: ProjectFile[] = [];
  getTreeItem(element: ATF15xxProjectTreeItem): vscode.TreeItem {
    let title = element.label;
    let result = new vscode.TreeItem(title,element.collapsibleState);    
    if(element.contextValue){
      result.contextValue = title;
    } else{
      result.contextValue = 'folder';      
    }
    result.command = {command: 'atf15xx-project-files.on_item_clicked', title, arguments: [element]};
    return result;
  }

  getChildren(element?: ATF15xxProjectTreeItem): Thenable<ATF15xxProjectTreeItem[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage("No dependency in empty workspace");
      return Promise.resolve([]);
    }
    try{
      if (!element) {
        return Promise.resolve(this.getValidProjects());
        
      }
      else if (element.file.toLowerCase().endsWith('.prj'))
      {
        return Promise.resolve(this.getProjectFiles(element));    
      }
      else {
        return Promise.resolve([]);
        //     
      }
    } catch(err: any){
      atfOutputChannel.appendLine('Error getting project children: ' + err.message);
      throw err;
    }
  }

  private _onDidChangeTreeData: vscode.EventEmitter<ATF15xxProjectTreeItem | undefined | null | void>;
  readonly onDidChangeTreeData: vscode.Event<ATF15xxProjectTreeItem | undefined | null | void>;

  public async refresh(): Promise<void> {
    await this.setWorkspace(this.workspaceRoot);
    this._onDidChangeTreeData.fire();
  }

  //one project per PLD
  private async getValidProjects(): Promise<ATF15xxProjectTreeItem[]>{
    const prjFiles = await vscode.workspace.findFiles('**.prj');
    this.openProjects = [];
    prjFiles.forEach(prjFile => {      
      this.openProjects.push(new Project(prjFile.path));
    });
    const projectTreeItems =  this.openProjects.map(op => this.toTreeItem(op));
    return projectTreeItems;

    const projectFiles = await vscode.workspace.findFiles("**.pld");
    const folders = vscode.workspace.workspaceFolders?.filter(wsf => projectFiles.find(f => f.path.includes(wsf.uri.path)));
    
    return folders?.map(f => new ATF15xxProjectTreeItem(f.name, f.uri.path,new Project(f.uri.path) ,vscode.TreeItemCollapsibleState.Expanded)) ?? [];  
    
      // const projectFiles = await vscode.workspace.findFiles("**.prj");
      // const folders = vscode.workspace.workspaceFolders
      //   ?.filter(wsf => projectFiles
      //     .find(f => f.path.includes(wsf.uri.path))
      //   );
      
      // return folders?.map(f => new ATF15xxProjectTreeItem(f.name, f.uri.path,,vscode.TreeItemCollapsibleState.Expanded)) ?? [];   
      
  }
  private toTreeItem(op: Project, filePath: string | undefined = undefined): ATF15xxProjectTreeItem {
    const isPrj = !filePath || filePath?.includes('.prj');
    const label = (isPrj ? op.projectName : filePath?.replace(op.projectPath.path, '').split('/').join('')) ?? op.projectName;
    return new ATF15xxProjectTreeItem(label , filePath ?? op.prjFilePath.path, op, isPrj ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None);
  }
  private async getProjectFiles(treeProject: ATF15xxProjectTreeItem): Promise<ATF15xxProjectTreeItem[]> {
    if (this.pathExists(treeProject.project.prjFilePath.path)) {
      const toProjectFile = (filePath: string): ATF15xxProjectTreeItem => {   
        const projFile = this.toTreeItem(treeProject.project, filePath)  ;
        projFile.contextValue = 'file';
        projFile.files.push(projFile);

        return projFile;       
      };

      
      const deps = (await vscode.workspace.findFiles(`**/${treeProject.project.projectName}.pld`)).filter(p => p.path.includes(treeProject.project.projectPath.path));
      deps.push(... (await vscode.workspace.findFiles(`**/${treeProject.project.projectName}.chn`)).filter(p => p.path.includes(treeProject.project.projectPath.path)));
      deps.push(... (await vscode.workspace.findFiles( `**/${treeProject.project.projectName}.svf`)).filter(p => p.path.includes(treeProject.project.projectPath.path)));
      deps.push(... (await vscode.workspace.findFiles( `**/${treeProject.project.projectName}.jed`)).filter(p => p.path.includes(treeProject.project.projectPath.path)));
      deps.push(... (await vscode.workspace.findFiles( `**/${treeProject.project.projectName}.sh`)).filter(p => p.path.includes(treeProject.project.projectPath.path)));
      const entries = deps ? Object.values(deps).map((dep) =>
        toProjectFile(dep.path)
      )
      : [];

      return entries;
     
    } else {
      return [];
    }
  }

  private pathExists(p: string): boolean {
    try {
      fs.accessSync(p);
    } catch (err) {
      return false;
    }
    return true;
  }

}

class ProjectTreeViewEntry{
  readonly label: string;
  readonly file: string;
  constructor(
    label: string,
    file: string   
  ) {
    
    this.label = label;
    this.file = file;
  }
  
}

export class ATF15xxProjectTreeItem extends vscode.TreeItem {
  
  constructor(
    public readonly label: string,
    public readonly file: string,
    public readonly project: Project,
    //private version: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}`;
    //this.description = this.version;
  }
  public files: ATF15xxProjectTreeItem[] = [];

  iconPath = {
    light: path.join(
      this.label,
      "..",
      "..",
      "src",
      "assets",
      "light",
      "edit.svg"
    ),
    dark: path.join(
      this.label,
      "..",
      "..",
      "src",
      "assets",
      "resources",
      "dark",
      "edit.svg"
    ),
  };
}
