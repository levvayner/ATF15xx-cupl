export class WorkingData {
	wokringFile: string = "";
	projectPath: string = "";
	projectName: string = "";
	// buildFileName: string = "";
	// buildFileUri: string = "";
	wokringFileUri : string = "";
	workingFileNameWithoutExtension: string = "";
}
export class WorkingCompileData extends WorkingData{
	buildFileName: string = "";
	buildFileUri: string = "";
}