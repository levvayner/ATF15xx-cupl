import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { homedir } from "os";
import { DeviceDeploymentType } from "../devices/devices";
import { Project } from "../types";
import { getOSCharSeperator, isWindows } from "../os/platform";
import { atfOutputChannel } from "../os/command";
import { projectTasksProvider } from "./projectTasksProvider";

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
  public readonly miniproPath: string;
  public readonly workingLinuxFolder: string;
  public readonly workingWindowsFolder: string;
  public openProjects: Project[] = [];
  private workspaceRoot: string = '';
  
  private supportsPLDCommands:string[] = [];
  private supportsJEDCommands:string[] = [];
  private supportsATMISPCommands:string[] = [];
  private supportsOpenOCDCommands: string[] = [];

  public projectsWithPLD(){
    return this.supportsPLDCommands;
  }
  public projectsWithJED(){
    return this.supportsJEDCommands;
  }
  public projectsWithATMISP(){
    return this.supportsATMISPCommands;
  }
  public projectsWithOpenOCD(){
    return this.supportsOpenOCDCommands;
  }

  static async init() {
    projectFileProvider = new ProjectFilesProvider();
  }
  constructor() {
     
      this.winBaseFolder = "C:\\";
      const extConfig = vscode.workspace.getConfiguration('vs-cupl');
      this.wineBinPath =  extConfig.get('WinePath') ?? '/usr/lib/wine';
      this.wineBaseFolder = (extConfig.get('WinCPath')as string).replace('~/',homedir + '/') ?? homedir + '/.wine/drive_c/';
      this.cuplBinPath = isWindows() ? `${this.winBaseFolder}${(extConfig.get('CuplBinPath'))}`: `${this.wineBaseFolder}/${(extConfig.get('CuplBinPath'))}`; 
      this.openOcdBinPath = extConfig.get('OpenOCDPath')  ?? '/usr/bin/openocd';
      this.atmSimBinPath = (isWindows() ? this.winBaseFolder : this.wineBaseFolder + getOSCharSeperator()) +  (extConfig.get('AtmIspBinPath') ?? 'ATMEL_PLS_Tools/ATMISP/ATMISP.exe');
      this.winTempPath = extConfig.get('WinTempPath') ?? 'temp';
      this.miniproPath = extConfig.get('MiniproPath') ?? isWindows() ? 'C:\\msys64\\home\\%USERNAME%\\minipro' : 'usr/bin/minipro';
      vscode.commands.registerCommand('vs-cupl-project-files.on_item_clicked', item => this.openFile(item));
      vscode.commands.registerCommand('vs-cupl-project-files.refreshEntry', () => this.refresh());
      this.workingLinuxFolder = this.wineBaseFolder + getOSCharSeperator() + this.winTempPath;
      this.workingWindowsFolder = this.winBaseFolder + this.winTempPath;

      this._onDidChangeTreeData = new vscode.EventEmitter<VSProjectTreeItem | undefined | null | void>();
      this.onDidChangeTreeData = this._onDidChangeTreeData.event;

  }
  openFile(item: ProjectTreeViewEntry): any {
    if (item.file === undefined) 
    {
      return;
    }
    let filePath = item.file;
    if(item.file.fsPath.endsWith('.prj')){
      filePath = vscode.Uri.parse(item.file.path.replace('.prj','.pld'));
    }
    // first we open the document
    vscode.workspace.openTextDocument(filePath).then( document => {
        // after opening the document, we set the cursor 
        // and here we make use of the line property which makes imo the code easier to read
        vscode.window.showTextDocument(document);
    });
  }

  async setWorkspace(workspace: string){
    this.workspaceRoot = workspace;    
  }

  // children: ProjectFile[] = [];
  getTreeItem(element: VSProjectTreeItem): vscode.TreeItem {
    let title = element.label;
    let result = new vscode.TreeItem(title,element.collapsibleState);   
    
    if(element.contextValue){
      result.contextValue = title;
      switch(title.substring(title.lastIndexOf('.') + 1).toLowerCase()){
        case 'pld':
          result.iconPath = new vscode.ThemeIcon('notebook');
          break;
        case 'svf':
          result.iconPath = new vscode.ThemeIcon('cloud-upload');
          break;

        case 'chn':
          result.iconPath = new vscode.ThemeIcon('console');
          break;
        case 'jed':
          result.iconPath = new vscode.ThemeIcon('clone');
          break;
        case 'sh':
            result.iconPath = new vscode.ThemeIcon('loaded-scripts-view-icon');
            break;

        default:
          result.iconPath = new vscode.ThemeIcon('circle-filled');
          break;
      }
       
    } else{
      result.contextValue = 'folder';      
      result.iconPath = new vscode.ThemeIcon('notebook-kernel-select'); 
    }
    result.command = {command: 'vs-cupl-project-files.on_item_clicked', title, arguments: [element]};
    return result;
  }

  getChildren(element?: VSProjectTreeItem): Thenable<VSProjectTreeItem[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage("No dependency in empty workspace");
      return Promise.resolve([]);
    }
    try{
      if (!element) {
        return Promise.resolve(this.getValidProjects());
        
      }
      else if (element.file.fsPath.toLowerCase().endsWith('.prj'))
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

  private _onDidChangeTreeData: vscode.EventEmitter<VSProjectTreeItem | undefined | null | void>;
  readonly onDidChangeTreeData: vscode.Event<VSProjectTreeItem | undefined | null | void>;

  public async refresh(): Promise<void> {
    await this.setWorkspace(this.workspaceRoot);
    this._onDidChangeTreeData.fire();
  }

  //one project per PLD
  public async getValidProjects(): Promise<VSProjectTreeItem[]>{
    //reset filtering arrays
    this.supportsPLDCommands = [];
    this.supportsJEDCommands = [];
    this.supportsATMISPCommands = [];
    this.supportsOpenOCDCommands = [];

    const prjFiles = await vscode.workspace.findFiles('**.prj');
    this.openProjects = [];
    prjFiles.forEach(prjFile => {      
      this.openProjects.push(new Project(prjFile.fsPath));
    });
    const projectTreeItems =  this.openProjects.map(op => this.toTreeItem(op));
    return projectTreeItems;

    // const projectFiles = await vscode.workspace.findFiles("**.pld");
    // const folders = vscode.workspace.workspaceFolders?.filter(wsf => projectFiles.find(f => f.path.includes(wsf.uri.path)));
    
    // return folders?.map(f => new VSProjectTreeItem(f.name, f.uri,new Project(f.uri.path) ,vscode.TreeItemCollapsibleState.Expanded)) ?? [];  
    
      // const projectFiles = await vscode.workspace.findFiles("**.prj");
      // const folders = vscode.workspace.workspaceFolders
      //   ?.filter(wsf => projectFiles
      //     .find(f => f.path.includes(wsf.uri.path))
      //   );
      
      // return folders?.map(f => new VSProjectTreeItem(f.name, f.uri.path,,vscode.TreeItemCollapsibleState.Expanded)) ?? [];   
      
  }
  private toTreeItem(op: Project, filePath: string | undefined = undefined): VSProjectTreeItem {
    const isPrj = !filePath || filePath?.includes('.prj');
    const label = (isPrj ?
      op.projectPath.fsPath.substring(op.projectPath.fsPath.lastIndexOf( getOSCharSeperator()) + 1) :
      filePath?.replace(op.projectPath.fsPath, '').substring(1)/*.split('/').join('')*/) ?? op.projectName;
    return new VSProjectTreeItem(label , filePath ? vscode.Uri.parse(filePath ) : op.prjFilePath, op, isPrj ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None);
  }
  private async getProjectFiles(treeProject: VSProjectTreeItem): Promise<VSProjectTreeItem[]> {
    if (this.pathExists(treeProject.project.prjFilePath.fsPath)) {
      const toProjectFile = (filePath: string): VSProjectTreeItem => {   
        const projFile = this.toTreeItem(treeProject.project, filePath)  ;
        projFile.contextValue = 'file';
        projFile.files.push(projFile);

        return projFile;       
      };

      
      const deps = (await vscode.workspace.findFiles(`**/${treeProject.project.projectName}.pld`)).filter(p => p.path.includes(treeProject.project.projectPath.path));
      deps.push(... (await vscode.workspace.findFiles(`**/${treeProject.project.projectName}.chn`)).filter(p => p.path.includes(treeProject.project.projectPath.path)));
      deps.push(... (await vscode.workspace.findFiles( `**/${treeProject.project.projectName}.svf`)).filter(p => p.path.includes(treeProject.project.projectPath.path)));
    deps.push(... (await vscode.workspace.findFiles( `**/${treeProject.project.projectName/*.substring(0,9)*/}.jed`)).filter(p => p.path.includes(treeProject.project.projectPath.path)));
      deps.push(... (await vscode.workspace.findFiles( `**/${treeProject.project.projectName}.sh`)).filter(p => p.path.includes(treeProject.project.projectPath.path)));
      const entries = deps ? Object.values(deps).map((dep) =>
        toProjectFile(dep.path)
      )
      : [];

      //add to filters
      if(entries.find(e => e.file.fsPath.toLowerCase().includes('.pld')) !== undefined){
        if(!this.supportsPLDCommands.find(pldProject => pldProject === treeProject.project.projectName)){
          this.supportsPLDCommands.push(treeProject.project.projectName);
        }
        
      }
      if(entries.find(e => e.file.fsPath.toLowerCase().includes('.jed')) !== undefined){
        if(!this.supportsJEDCommands.find(pldProject => pldProject === treeProject.project.projectName)){
          this.supportsJEDCommands.push(treeProject.project.projectName);
        }
        
      }
      if(entries.find(e => e.file.fsPath.toLowerCase().includes('.chn')) !== undefined){
        if(!this.supportsATMISPCommands.find(pldProject => pldProject === treeProject.project.projectName)){
          this.supportsATMISPCommands.push(treeProject.project.projectName);
        }
        
      }
      if(entries.find(e => e.file.fsPath.toLowerCase().includes('.svf')) !== undefined){
        if(!this.supportsOpenOCDCommands.find(pldProject => pldProject === treeProject.project.projectName)){
          this.supportsOpenOCDCommands.push(treeProject.project.projectName);
        }
        
      }
      vscode.commands.executeCommand('setContext','vscupl.projectCanBuildPld',this.projectsWithPLD());
      vscode.commands.executeCommand('setContext','vscupl.projectCanDeployJed',this.projectsWithJED());
      vscode.commands.executeCommand('setContext','vscupl.projectCanDeploySvf',this.projectsWithOpenOCD());
      vscode.commands.executeCommand('setContext','vscupl.projectCanRunATMISP',this.projectsWithATMISP());
      await projectTasksProvider.refresh();
      return entries;
     
    } else {
      return [];
    }
  }

  pathExists(p: string): boolean {
    try {
      fs.accessSync(p);
    } catch (err) {
      return false;
    }
    return true;
  }

}

export class ProjectTreeViewEntry{
  readonly label: string;
  readonly file: vscode.Uri;
  constructor(
    label: string,
    file: vscode.Uri   
  ) {
    
    this.label = label;
    this.file = file;
  }
  
}

export class VSProjectTreeItem extends vscode.TreeItem {
  
  constructor(
    public readonly label: string,
    public readonly file: vscode.Uri,
    public readonly project: Project,
    //private version: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}`;
    //this.description = this.version;
  }
  public files: VSProjectTreeItem[] = [];

  iconPath = {
    light: path.join(
      __filename,
      "..",
      "..",
      "assets",
      "images",
      "light",
      "edit.svg"
    ),
    dark: path.join(
      __filename,
      "..",
      "..",
      "assets",
      "images",
      "dark",
      "edit.svg"
    ),
  };
}
