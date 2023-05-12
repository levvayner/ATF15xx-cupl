// @ts-nocheck

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    const oldState = vscode.getState() || { project: {} };
    
    
    let project = oldState.project;
    updateProjectView();

    // document.querySelector('.selectPin').addEventListener('click', () => {
    //     selectPin();
    // });

    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent
        switch (message.type) {
            case 'setProject':
            {
                updateProjectView(message.project);                    
                break;
            }    
            case 'clearProject':
            {
                updateProjectView(undefined);
                break;
            }                 

        }
    });
    
    /**
     * @param {Array<{ value: Project }>} project
     */
    function updateProjectView(project) {        
        const container = document.querySelector('#project-container');
        container.textContent = '';

        const projName = project?.projectName;
        const projDeviceName = project?.deviceConfiguration?.deviceName;
        const projDevicePackageType = project?.deviceConfiguration?.packageType;
        const projDeviceManufacturer = project?.deviceConfiguration?.manufacturer;
        const projDeviceCode = project?.deviceConfiguration?.deviceCode;

        const divProjName = document.createElement('div');
        const divProjDeviceName = document.createElement('div');
        const divProjDevicePackageType = document.createElement('div');
        const divProjDeviceManufacturer = document.createElement('div');
        const divProjDeviceCode = document.createElement('div');

        divProjName.textContent = projName;
        divProjDeviceName.textContent = projDeviceName;
        divProjDevicePackageType.textContent = projDevicePackageType;
        divProjDeviceManufacturer.textContent = projDeviceManufacturer;
        divProjDeviceCode.textContent = projDeviceCode;

        container.appendChild(divProjName);
        container.appendChild(divProjDeviceName);
        container.appendChild(divProjDevicePackageType);
        container.appendChild(divProjDeviceManufacturer);
        container.appendChild(divProjDeviceCode);

        console.log(`drew active-project component for ${projDeviceName}`);
        

        // Update the saved state
        vscode.setState({ project: project });
    }

   
    function onConfigureClicked() {
        vscode.postMessage({ type: 'configureProject' });
    }
   

}());


