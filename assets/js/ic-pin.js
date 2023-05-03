// @ts-nocheck

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    const oldState = vscode.getState() || { pins: [] };

    /** @type {Array<{ value: PinConfiguration }>} */
    let pins = oldState.pins;

    updatePinList(pins);

    // document.querySelector('.selectPin').addEventListener('click', () => {
    //     selectPin();
    // });

    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent
        switch (message.message) {
            case 'selectPin':
                {
                    selectPin(message.pin);
                    break;
                }    
            case 'setPins':
                {
                    updatePinList(message.pins);
                    break;
                }            

        }
    });

    /**
     * @param {Array<{ value: PinConfiguration }>} pins
     */
    function updatePinList(pins) {
        if(pins === undefined){
            return;
        }
        const ul = document.querySelector('.pin-list');
        ul.textContent = '';
        for (const pin of pins) {
            const li = document.createElement('div');
            li.className = 'pin-entry';
            li.addEventListener('click', () => {
                onPinClicked(pin);
            });

            const pinDiv = document.createElement('div');
            pinDiv.className = 'pin-preview';
            //pinType.style.backgroundColor = `#${pin.value}`;
            
            pinDiv.textContent = `${pin.pin}`;
            li.appendChild(pinDiv);

            if(pin.pinType && pin.pinType.length > 0){
                pin.pinType.forEach(t=> {
                    const pinType = document.createElement('div');
                    pinType.className = t;
                    pinType.textContent = t;
                    li.appendChild(pinType);
                });
                
                
            }            
            
            
            ul.appendChild(li);
        }

        // Update the saved state
        vscode.setState({ pinId: 1 });
    }

    /** 
     * @param {string} color 
     */
    function onPinClicked(pin) {
        vscode.postMessage({ type: 'pinSelected', value: pin });
    }

    function selectPin(pin) {
        // pins.push({ pinId: pin });
        updatePinList(pins);
    }

}());


