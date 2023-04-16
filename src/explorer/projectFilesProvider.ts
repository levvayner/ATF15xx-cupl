import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { setWorkingFileData } from "../svc.deploy";

export let projectFileProvider: ProjectFilesProvider;
export class ProjectFilesProvider
  implements vscode.TreeDataProvider<ProjectFile>
{
  static init(rootPath: string) {
	  projectFileProvider = new ProjectFilesProvider(rootPath);
  }
  constructor(private workspaceRoot: string) {
    
    vscode.commands.registerCommand('atf15xx-project-files.on_item_clicked', item => this.openFile(item));
    vscode.commands.registerCommand('atf15xx-project-files.refreshEntry', () => this.refresh());
    // vscode.commands.registerCommand('ATF15xx-cupl.buildProject', (uri: vscode.Uri) =>{

    // })
  }
  openFile(item: ProjectFile): any {
    if (item.file === undefined) return;
    // first we open the document
    vscode.workspace.openTextDocument(item.file).then( document => {
        // after opening the document, we set the cursor 
        // and here we make use of the line property which makes imo the code easier to read
        vscode.window.showTextDocument(document);
    });
  }

  // children: ProjectFile[] = [];
  getTreeItem(element: ATF15xxProjectTreeItem): vscode.TreeItem {
    let title = element.label;
    let result = new vscode.TreeItem(title,element.collapsibleState);    
    result.contextValue = element.contextValue ? title : 'folder';
    result.command = {command: 'atf15xx-project-files.on_item_clicked', title, arguments: [element]};
    return result;
  }

  getChildren(element?: ATF15xxProjectTreeItem): Thenable<ATF15xxProjectTreeItem[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage("No dependency in empty workspace");
      return Promise.resolve([]);
    }

    // if (element) {
    //   return Promise.resolve(
    //     this.getValidFiles(
    //       path.join(
    //         this.workspaceRoot,
    //         element.label
    //       )
    //     )
    //   );
    // } 
    if (!element) {
      return Promise.resolve(this.getValidProjects());
      
    }
    else {
      return Promise.resolve(this.getProjectFiles(element));        
    }
  }

  private _onDidChangeTreeData: vscode.EventEmitter<ATF15xxProjectTreeItem | undefined | null | void> = new vscode.EventEmitter<ATF15xxProjectTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<ATF15xxProjectTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  public refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  private async getValidProjects(): Promise<ATF15xxProjectTreeItem[]>{
      const projectFiles = await vscode.workspace.findFiles("**.PLD");
      const folders = vscode.workspace.workspaceFolders?.filter(wsf => projectFiles.find(f => f.path.includes(wsf.uri.path)));
      
      return folders?.map(f => new ATF15xxProjectTreeItem(f.name, f.uri.path,vscode.TreeItemCollapsibleState.Expanded)) ?? [];   
  }
  private async getProjectFiles(treeProject: ATF15xxProjectTreeItem): Promise<ATF15xxProjectTreeItem[]> {
    if (this.pathExists(treeProject.file)) {
      const toDep = (moduleName: string): ATF15xxProjectTreeItem => {
        const file = setWorkingFileData(moduleName);
        const projFile = new ATF15xxProjectTreeItem(
          file.wokringFile,
          file.wokringFileUri,
            vscode.TreeItemCollapsibleState.None
          );  ;
        projFile.contextValue = 'file';
        projFile.files.push(projFile);

        return projFile;       
      };

      
      const deps = (await vscode.workspace.findFiles("**/**.PLD")).filter(p => p.path.includes(treeProject.file));
      deps.push(... (await vscode.workspace.findFiles( "**.chn")).filter(p => p.path.includes(treeProject.file)));
      deps.push(... (await vscode.workspace.findFiles( "**.svf")).filter(p => p.path.includes(treeProject.file)));
      deps.push(... (await vscode.workspace.findFiles( "**/**.jed")).filter(p => p.path.includes(treeProject.file)));
      const entries = deps ? Object.values(deps).map((dep) =>
            toDep(dep.path)
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

class ProjectFile{
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
    //private version: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}`;
    //this.description = this.version;
  }
  readonly files: ATF15xxProjectTreeItem[] = [];

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
