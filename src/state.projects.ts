import { DeviceDeploymentType } from "./devices/devices";
import { providerActiveProject } from "./editor/active-project-view";
import { VSProjectTreeItem } from "./explorer/project-files-provider";
import { Project } from "./project";
import * as vscode from 'vscode';

export let stateProjects:StateProjects;
export class StateProjects{
    
    private _supportsDeployToMiniproCommands:string[] = [];
    private _supportsExportToAtmIspCommands:string[] = [];
    private _supportsCompileCommands:string[] = [];
    private _supportsOpenOCDCCommands:string[] = [];
    private _openProjects: Project[] = [];
    private _activeProject: Project | undefined;

    public get activeProject(){
      return this._activeProject;
    }

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

    public setActiveProject(project: Project | undefined){
      this._activeProject = project;
    }

    public get openProjects(){
        return this._openProjects;
    }
    
    updateProject(updatedProject: Project) {
      this._openProjects = this._openProjects.filter(p => p.projectPath.path !== updatedProject.projectPath.path);
      this._openProjects.push(updatedProject);
      this._activeProject = updatedProject;
      providerActiveProject.openProjectActiveProject(updatedProject);
    }

    public getOpenProject(projectPath: vscode.Uri){
      return this._openProjects.find(p => p.projectPath.fsPath === projectPath.fsPath || p.prjFilePath.fsPath === projectPath.fsPath );
    }
    public static async init(){
        stateProjects = new StateProjects();
        await stateProjects.refreshOpenProjects();
    }

    removeProject(project: Project) {
        this._openProjects = this._openProjects.filter(p => p.projectPath.path !== project.projectPath.path);
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
        const projectFiles = files.filter(f => f.fsPath.endsWith('.prj'));
        for(let i = 0; i < projectFiles.length; i++){
          const project = await Project.openProject(projectFiles[i]);
          await this.loadProjectFilesAndArrays(project, files);
        }
      
           
        
        return this._openProjects;    
      }

      private async loadProjectFilesAndArrays(project: Project, files: vscode.Uri[]){
        const projectFiles = files.filter(p => p.path.toLowerCase().includes(project.projectPath.path.toLowerCase()));
        const deps = projectFiles.filter(p => p.path.toLowerCase().endsWith('.pld'));
        deps.push(... projectFiles.filter(p => p.path.toLowerCase().endsWith('.chn')));
        deps.push(... projectFiles.filter(p => p.path.toLowerCase().endsWith('.svf')));
        deps.push(... projectFiles.filter(p => p.path.toLowerCase().endsWith('.sh')));
        deps.push(... projectFiles.filter(p => p.path.toLowerCase().endsWith('.jed')));
        deps.push(... projectFiles.filter(p => p.path.toLowerCase().endsWith('.prj')));
  
        //add to filters
        if(deps.find(e => e.fsPath.toLowerCase().includes('.pld')) !== undefined){
          this._supportsCompileCommands.push(project.projectName);        
        }
  
        if(deps.find(e => e.fsPath.toLowerCase().includes('.jed')) !== undefined){
          const programmer = project.deviceProgrammer;
          if(programmer === DeviceDeploymentType.minipro){
            this._supportsDeployToMiniproCommands.push(project.projectName);
          }else if(programmer === DeviceDeploymentType.atmisp){
            this._supportsExportToAtmIspCommands.push(project.projectName);
          }        
        }
        
        if(deps.find(e => e.fsPath.toLowerCase().includes('.svf')) !== undefined){
          if((project.deviceProgrammer) === DeviceDeploymentType.atmisp){
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