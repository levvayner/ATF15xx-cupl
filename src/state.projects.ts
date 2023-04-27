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
        const files = await vscode.workspace.findFiles('**/*.*');
        for(let i = 0; i < vscode.workspace.workspaceFolders.length; i++){
            await this.loadProjectFilesAndArrays(new Project(vscode.workspace.workspaceFolders[i].uri), files);
        }
        
        return this._openProjects;    
      }

      private async loadProjectFilesAndArrays(project: Project, files: vscode.Uri[]){
        const deps = files.filter(p => p.path.includes(project.projectPath.path) && p.path.endsWith('.pld'));
        deps.push(... files.filter(p => p.path.includes(project.projectPath.path) && p.path.endsWith('.chn')));
        deps.push(... files.filter(p => p.path.includes(project.projectPath.path) && p.path.endsWith('.svf')));
        deps.push(... files.filter(p => p.path.includes(project.projectPath.path) && p.path.endsWith('.sh')));
        deps.push(... files.filter(p => p.path.includes(project.projectPath.path) && p.path.endsWith('.jed')));
        deps.push(... files.filter(p => p.path.includes(project.projectPath.path) && p.path.endsWith('.prj')));
        // const entries = deps ? Object.values(deps).map((dep) =>
        //   toProjectFile(dep.path)
        // )
        // : [];
  
        //add to filters
        if(deps.find(e => e.fsPath.toLowerCase().includes('.pld')) !== undefined){
          this._supportsCompileCommands.push(project.projectName);        
        }
  
        if(deps.find(e => e.fsPath.toLowerCase().includes('.jed')) !== undefined){
          const programmer = await project.deviceProgrammer();
          if(programmer === DeviceDeploymentType.minipro){
            this._supportsDeployToMiniproCommands.push(project.projectName);
          }else if(programmer === DeviceDeploymentType.atmisp){
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