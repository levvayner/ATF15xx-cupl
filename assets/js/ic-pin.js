// @ts-nocheck

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    const oldState = vscode.getState() || { pins: [1,2,3,4,5,6,7,8,9,10] };

    /** @type {Array<{ value: string }>} */
    let pins = oldState.pins;

    updatePinList(pins);

    document.querySelector('.selectPin').addEventListener('click', () => {
        selectPin();
    });

    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent
        switch (message.type) {
            case 'selectPin':
                {
                    selectPin();
                    break;
                }           

        }
    });

    /**
     * @param {Array<{ value: string }>} pins
     */
    function updatePinList(pins) {
        const ul = document.querySelector('.pin-list');
        ul.textContent = '';
        for (const pin of pins) {
            const li = document.createElement('li');
            li.className = 'pin-entry';

            const pinType = document.createElement('div');
            pinType.className = 'pin-preview';
            pinType.style.backgroundColor = `#${pin.value}`;
            pinType.addEventListener('click', () => {
                onPinClicked(pin.value);
            });
            li.appendChild(pinType);

            const input = document.createElement('input');
            input.className = 'pin-input';
            input.type = 'text';
            input.value = pin.value;
            input.addEventListener('change', (e) => {
                const value = e.target.value;
                if (!value) {
                    // Treat empty value as delete
                    pins.splice(pins.indexOf(pin), 1);
                } else {
                    pin.value = pin;
                }
                updatePinList(pin);
            });
            li.appendChild(input);

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
        pins.push({ pinId: 1 });
        updateColorList(colors);
    }

}());


