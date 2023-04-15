import * as vscode from 'vscode';

export function stateManager (context: vscode.ExtensionContext) {
    return {
      read,
      write
    }
  
    function read (paramName: string): string{
      return context.globalState.get(paramName) as string;
    }
  
    async function write (paramName: string, value: string) {
      await context.globalState.update(paramName, value);
    }
  }
  