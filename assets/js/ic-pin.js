// @ts-nocheck

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    const oldState = vscode.getState() || { pins: [] };
    coord = {left:0, top: 0};
    
    /** @type {Array<{ value: PinConfiguration }>} */
    let pins = oldState.pins;
    this.selectedPin = undefined;
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
                    this.selectedPin = undefined;
                    updatePinList(message.pins);
                    break;
                }   
            case 'colors':{
                this.colors = message.colors;
                updatePinList(pins);
            }         

        }
    });
    colors = [];
    /**
     * @param {Array<{ value: PinConfiguration }>} pins
     */
    function updatePinList(pinList) {
        pins = pinList;
        if(pins === undefined || pins.length === 0){
            return;
        }
        
        
        const ul = document.querySelector('.pin-list');
        ul.textContent = '';
        for (const pin of pins) {
            const li = document.createElement('div');
            
            li.className = pin.pin === this.selectedPin ? 'pin-entry-selected' : 'pin-entry';
            li.addEventListener('click', () => {
                onPinClicked(pin);
            });
            li.addEventListener('mouseover', () => {
                onPinHover(li,pin);
            });
            li.addEventListener('mouseout', () => {
                onPinLeave(li,pin);
            });

            const pinDiv = document.createElement('div');
            pinDiv.className = 'pin-preview';
            //pinType.style.backgroundColor = `#${pin.value}`;
            
            pinDiv.textContent = `${pin.pin}`;
            li.appendChild(pinDiv);

            if(pin.pinType && pin.pinType.length > 0){
                pin.pinType.forEach(t=> {
                    const pinType = document.createElement('div');
                    pinType.className = 'pin-type';
                    pinType.style.backgroundColor = this.colors.find(c => c.type === 'pin' + t)?.color ?? '#aaa';
                    pinType.style.color = this.colors.find(c => c.type === 'foreground')?.color ?? '#aaa';
                    pinType.textContent = t;
                    li.appendChild(pinType);
                });
                
                
            }            
            
            
            ul.appendChild(li);
            console.log(`Selected pin: ${this.selectedPin}`);
            if(pin.pin === this.selectedPin){
                coord = {left: li.offsetLeft, top: li.offsetTop - 10};
            }
        }
        

        // Update the saved state
        //vscode.setState({ pinId: 1 });
    }

    /** 
     * @param {string} color 
     */
    function onPinClicked(pin) {
        vscode.postMessage({ type: 'pinSelected', value: pin });
        selectPin(pin.pin);
    }

    function selectPin(pin) {
        // pins.push({ pinId: pin });
        this.selectedPin = pin;
        updatePinList(pins);
        if(coord.x !== 0 && coord.y !== 0){
            scroll(coord);
        }
        
        
    }

    function onPinHover(li,pin){
        vscode.postMessage({ type: 'pinPreview', value: pin });
        li.className = 'pin-entry-hover';
    }
    function onPinLeave(li,pin){
        vscode.postMessage({ type: 'pinPreview', value: undefined });
        li.className = this.selectedPin === pin.pin && this.selectedPin !== undefined ? 'pin-entry-selected' : 'pin-entry';
    }

}());


