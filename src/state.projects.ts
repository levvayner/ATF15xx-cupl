import { DeviceDeploymentType } from "./devices/devices";
import { Project } from "./types";
import * as vscode from 'vscode';

export let stateProjects:StateProjects;
export class StateProjects{
    private _supportsDeployToMiniproCommands:string[] = [];
    private _supportsExportToAtmIspCommands:string[] = [];
    private _supportsCompileCommands:string[] = [];
    private _supportsOpenOCDCCommands:string[] = [];
    private _openProjects: Project[] = [];

    public projectsCanCompile(){
        return this._supportsCompileCommands;
    }
    public projectsCanDeployToMinipro(){
        return this._supportsDeployToMiniproCommands;
    }
    public projectsCanExportToAtmIsp(){
        return this._supportsExportToAtmIspCommands;
    }
    public projectsCanDeployToOpenOcd(){
        return this._supportsOpenOCDCCommands;
    }

    public get openProjects(){
        return this._openProjects;
    }

    public static async init(){
        stateProjects = new StateProjects();
        await stateProjects.refreshOpenProjects();
    }

    public async refreshOpenProjects(): Promise<Project[]>{
        //reset filtering arrays
        this._supportsDeployToMiniproCommands = [];
        this._supportsExportToAtmIspCommands = [];
        this._supportsCompileCommands = [];
        this._supportsOpenOCDCCommands = [];
     
        this._openProjects = [];
        if(!vscode.workspace.workspaceFolders){
            return [];
        }
        for(let i = 0; i < vscode.workspace.workspaceFolders.length; i++){
            await this.loadProjectFilesAndArrays(new Project(vscode.workspace.workspaceFolders[i].uri));
        }
        
        return this._openProjects;    
    
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

      private async loadProjectFilesAndArrays(project: Project){
        const deps = (await vscode.workspace.findFiles(`**/${project.projectName}.pld`)).filter(p => p.path.includes(project.projectPath.path));
        deps.push(... (await vscode.workspace.findFiles(`**/${project.projectName}.chn`)).filter(p => p.path.includes(project.projectPath.path)));
        deps.push(... (await vscode.workspace.findFiles( `**/${project.projectName}.svf`)).filter(p => p.path.includes(project.projectPath.path)));
        deps.push(... (await vscode.workspace.findFiles( `**/${project.projectName/*.substring(0,9)*/}.jed`)).filter(p => p.path.includes(project.projectPath.path)));
        deps.push(... (await vscode.workspace.findFiles( `**/${project.projectName}.sh`)).filter(p => p.path.includes(project.projectPath.path)));
        // const entries = deps ? Object.values(deps).map((dep) =>
        //   toProjectFile(dep.path)
        // )
        // : [];
  
        //add to filters
        if(deps.find(e => e.fsPath.toLowerCase().includes('.pld')) !== undefined){
          this._supportsCompileCommands.push(project.projectName);        
        }
  
        if(deps.find(e => e.fsPath.toLowerCase().includes('.jed')) !== undefined){
          if((await project.deviceProgrammer()) === DeviceDeploymentType.miniPro){
            this._supportsDeployToMiniproCommands.push(project.projectName);
          }else{
            this._supportsExportToAtmIspCommands.push(project.projectName);
          }        
        }
        
        if(deps.find(e => e.fsPath.toLowerCase().includes('.svf')) !== undefined){
          if((await project.deviceProgrammer()) === DeviceDeploymentType.atmisp){
            this._supportsOpenOCDCCommands.push(project.projectName);
          }
          
        }
  
        vscode.commands.executeCommand('setContext','vscupl.projectCanBuildPld',this.projectsCanCompile());
        vscode.commands.executeCommand('setContext','vscupl.projectCanDeployToMinipro',this.projectsCanDeployToMinipro());
        vscode.commands.executeCommand('setContext','vscupl.projectCanExportToAtmIsp',this.projectsCanExportToAtmIsp());
        vscode.commands.executeCommand('setContext','vscupl.projectCanDeployToOpenOcd',this.projectsCanDeployToOpenOcd());

        this._openProjects.push(project);
      }
}