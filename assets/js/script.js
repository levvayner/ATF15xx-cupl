// @ts-check


const DevicePackageType = {
    "dip" : "dip",
    "plcc" : "plcc",
    "pqfp" : "pqfp",
    "tqfp" : "tqfp",
    "undefined" : "undefined",
  }


const PinType = {

    //GENERAL PINS
    'IN' : 'IN',   
    'OUT' : 'OUT',
    'INOUT' : 'INOUT',
    'GND' : 'GND',
    'VCC' : 'VCC',
    //CHIP CUSTOM PINS
    'CLR' : 'CLR',
    'CLK' : 'CLK',
    'PD' : 'PD',
    'OE' : 'OE',
    //JTAG
    'TDI' : 'TDI',
    'TMS' : 'TMS',
    'TCK' : 'TCK',
    'TDO' : 'TDO',
    //NOT CONNECTED
    'NC' : 'NC'

}

class Pin{
    pin;
    pinType;
}
class PinConfiguration{
    name;
    deviceType;
    pinCount;
    pins;
    

}

const PinLayoutOrientation = {
    horizontal : 'horizontal',
    vertical : 'vertical'
};

class ChipUIPin {x; y; w; h; id; type; orientation;}

// pinConfigurations

// function getDevicePins(name, pinCount, packageType){
//     let pins;
//     try{
//         pins = pinConfigurations.find(d => d && d.name === name && d.pinCount === pinCount && d.deviceType === packageType );
//     }
//     catch(err){
//         console.log(`Error searching device pinmap: ${err.message}`);
//     }
//     return pins;
// } 

const PinNumberingScheme = {
    DownUp : 'DownUp',
    OddEven: 'OddEven',
}

window.addEventListener('resize', () => {
    console.log("RESIZE");
    component.selectedPin = undefined;
    component.updatePinCoordinates();
    component.drawDevice();
});



class PlccChipViewComponent {
    //vscode = acquireVsCodeApi();
    debugMessages = false;
    MIN_WIDTH = 600;
    width  = 0;
    height = 0;
    icMargin = 0;
    layoutName ='';
    packageType = 'dip';
    pinCatalogIndex = 0;
    //icConfigurations = pinConfigurations;
    pinConfiguration = undefined;
    scheme = PinNumberingScheme.DownUp;

    chipHeight = 0;
    chipWidth = 0;
    chipLeft = 0;
    chipRight = 0;
    chipTop = 0;
    chipBottom = 0;
    horizontalPinWidth = 0;
    verticalPinHeight = 0;
    horizontalPinOffset = 0;
    horizontalPinHeight = 0;
    verticalPinOffset = 0;
    verticalPinWidth = 0;
    pinPerSide = 0;

    pins = [];
    previewingPin;
    selectedPin;
    ctx;
    colors = [];

    // get isFirst(){
    //     return this.pinCatalogIndex === 0;
    // }

    // get isLast(){
    //     return this.pinCatalogIndex === this.icConfigurations.length - 1;
    // }
    
   
    init() {
        const ic = document.getElementById("ic");
        if(!ic){
            return;
        }
        ic.onmousemove = function(event) {
            component.previewPin(event);
        }
        // document.getElementById("ic").onmousedown = function(event) {
        //     component.selectPin(event);
        // }
        // document.getElementById('ic').ondblclick = function(event) {
        //     component.addPin(event);
        // }


        var clickHandler = function(e) { /* put click event handling code here */ };
        var doubleclickHandler = function(e) { /* put doubleclick event handling code here */ }

        const maxMsBetweenClicks = 300;
        var clickTimeoutId = null;
        ic.addEventListener("dblclick", handleDoubleClick);
        ic.addEventListener("click",    handleSingleClick);

        function handleSingleClick(e){ 
            clearTimeout(clickTimeoutId);  
            clickTimeoutId = setTimeout( function() { clickHandler(e);}, maxMsBetweenClicks);
            component.selectPin(e); 
        }
            
        function handleDoubleClick(e){ 
            clearTimeout(clickTimeoutId); 
            component.addPin(e);
            
        }

        this.ic = ic;

        this.ic = document.getElementById('ic');
        if(this.ic.getContext){
            this.ctx = this.ic.getContext('2d');
        }
        this.selectedPin = undefined;
        this.previewingPin = undefined;
        this.drawDevice();
    }

    previewPin(event){
        if(event === undefined){
            this.previewingPin = undefined;
            return;
        }
        const testX = event.offsetX / devicePixelRatio ; //not sure why but have to offset after moving into vscode
        const testY = event.offsetY / devicePixelRatio ;

        // this.ctx.clearRect(10,this.chipBottom +  this.verticalPinHeight + 5,120,50);
        // this.ctx.fillText(`Curor: x=${testX.toFixed(1)} y=${testY.toFixed(1)}`,10,this.chipBottom + this.verticalPinHeight + 20,120);
        
        const pin = this.pins.find(p => p.x <= testX  && testX <= p.x + p.w && p.y <= testY  && testY <= p.y + p.h );
        //check if we need to update selected pin after hovering over it
        if(this.selectedPin && this.selectedPin !== this.previewingPin?.id)
        {
            this.drawPin(this.pins.find(p => p.id === this.selectedPin),true,false);
        }

        if(this.previewingPin?.id === pin?.id){
            return;//nothing to do
        }
        
        if(this.previewingPin){
            this.drawPin(this.previewingPin,false);
        }

        let typeYCoord = this.chipBottom + this.verticalPinHeight + 20;
        if(!pin){
            this.previewingPin = undefined;
            this.ctx.clearRect(130,typeYCoord - 18,130,120);
            return;
        }
        
        this.previewingPin = pin;
        this.drawPin( this.previewingPin, false, true);
        
        if(this.previewingPin){
            this.ctx.fillStyle = this.colors.find(c => c.type === 'accent1').color;
           
            this.ctx.fillText(`Selected Pin: ${this.previewingPin.id.toFixed(0)}`,130, typeYCoord,100);
            
            this.previewingPin.type.forEach(t => {
                this.ctx.fillText(`${t}`,130,typeYCoord+=18,100);
            })
        }

        
    }

    selectPin(event){
        if(event === undefined){
            this.selectedPin = undefined;
            return;
        }
        const testX = event.offsetX / devicePixelRatio ; //not sure why but have to offset after moving into vscode
        const testY = event.offsetY / devicePixelRatio ;

        const pin = this.pins.find(p => p.x <= testX  && testX <= p.x + p.w && p.y <= testY  && testY <= p.y + p.h );
        
        if(pin){
            vscode.postMessage({
                type: 'selectPin',
                pin: pin
            });
        }
        //clear old selection
        if(this.selectedPin){
            this.drawPin(this.pins.find(p => p.id === this.selectedPin),false,false);
        }
       
        this.selectedPin = pin;
        return pin;
    }

    addPin(event){
        
        const testX = event.offsetX / devicePixelRatio ; //not sure why but have to offset after moving into vscode
        const testY = event.offsetY / devicePixelRatio ;

        const pin = this.pins.find(p => p.x <= testX  && testX <= p.x + p.w && p.y <= testY  && testY <= p.y + p.h );
        
        if(pin){
            vscode.postMessage({
                type: 'addPin',
                pin: pin
            });
        }
       
        this.selectedPin = pin;
        return pin;
    }


    drawDevice(){
        if(this.pinConfiguration === undefined){
            return;
        }
        this.UpdateDeviceCooridnates();
        this.pins = [];
        
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        /*               DIP IC                                              PLCC, TQFP, PQFP layout
                    +------------------------+           +--------------------------------------+
                    | Text Info ...          |           | Text Info ...                        |
                    | Legend ....            |           | Legend ....                          |
                    |   legend cont...       |           |   legend cont...                     |
                    +------------------------+           +--------------------------------------+
                    | +----------margin---+  |           | +----------margin-----------------+  |
                    | |      IC DRAWING   |  |           | |      IC DRAWING                 |  |
                    | |                   |  |           | |    40 39 38 37 36 35...         |  |
                    | |   +-----+         |  |           | |   +-------------------+         |  |
                    | |  1|     | 20      |  |           | |  1|                   | 29      |  |
                    | |  2|     | 19      |  |           | |  2|                   | 28      |  |
                    | |  3|     | 18      |  |           | |  3|                   | 27      |  |
                    | |  4|     | 17      |  |           | |  4|                   | 26      |  |
                    | |...|     | ...     |  |           | |...|                   | ...     |  |
                    | |   +-----+         |  |           | |   +-------------------+         |  |
                    | |                   |  |           | |    11 12 13 14 15 16...         |  |
                    | |                   |  |           | |                                 |  |
                    | +----------margin---+  |           | +----------margin-----------------+  |
                    +------------------------+           +--------------------------------------+
        */
        if(this.debugMessages)
        {
            this.drawHeader();
        }        
        this.updatePinCoordinates();

        if( this.colors.length === 0){
            setTimeout(this.drawDevice, 300);
            return;
        }
        
        //draw IC
        this.ctx.fillStyle = this.colors.find(c => c.type === 'background').color;
        if(this.pinConfiguration.deviceType === DevicePackageType.plcc){
            this.ctx.fillRect(this.chipLeft - .75*this.horizontalPinWidth,this.chipTop - .75*this.verticalPinHeight,this.chipWidth + 1.5*this.horizontalPinWidth ,this.chipHeight +  1.5*this.verticalPinHeight);
        } else{
            this.ctx.fillRect(this.chipLeft,this.chipTop,this.chipWidth,this.chipHeight);
        }
        this.ctx.strokeStyle = this.ctx.fillStyle = this.colors.find(c => c.type === 'accent2').color;
        if(this.pinConfiguration.deviceType === DevicePackageType.plcc){
            this.ctx.strokeRect(this.chipLeft - .75*this.horizontalPinWidth,this.chipTop - .75*this.verticalPinHeight,this.chipWidth + 1.5*this.horizontalPinWidth ,this.chipHeight +  1.5*this.verticalPinHeight);
        }
        else{
            this.ctx.strokeRect(this.chipLeft,this.chipTop,this.chipWidth,this.chipHeight);
        }
        this.calculatePinPositions();
        this.drawPins();

        this.ctx.beginPath();
        this.ctx.fillStyle = this.colors.find(c => c.type === 'accent3').color;
        this.ctx.arc(this.chipLeft + this.chipWidth/10, this.chipTop +  + this.chipWidth/10, this.chipWidth / 20, 0,2 * Math.PI);
        this.ctx.fill();
        
        this.ctx.strokeStyle = this.colors.find(c => c.type === 'background').color;
        this.ctx.arc(this.chipLeft + this.chipWidth/10, this.chipTop +  + this.chipWidth/10, this.chipWidth / 20, 0,2 * Math.PI);
        this.ctx.stroke();
        
        /*
            chip has 5px padding
            take height of chip, offset from top and bottom by 5% total.
            top to bottom = x number of pins consisting of pinCount*horizontalPinHeight + (pinCount-1*pinSpace)

        */
        console.log('drawDevice called');
        
        

    }
    drawHeader(){
        const fontSize = 14;
        const paragraphWidth = 140;
        this.ctx.fillStyle = this.colors.find(c => c.type === 'foreground').color;
        this.ctx.font = `${fontSize}px Arial`;
        this.ctx.fillText(`Canvas height: ${this.height}`,0,fontSize+2,100);
        this.ctx.fillText(`Canvas width: ${this.width}`,0,(fontSize+2) * 2,100);

        this.ctx.fillText(`Chip height: ${this.chipHeight.toFixed(0)}`,0,(fontSize+2) * 3,100);
        this.ctx.fillText(`Chip margin: ${this.icMargin.toFixed(0)}`,0,(fontSize+2) * 4,100);
        this.ctx.fillText(`Pin count: ${this.pinConfiguration.pinCount.toFixed(0)}`,0,(fontSize+2) * 5,100);
        this.ctx.fillText(`Pixel Ratio: ${window.devicePixelRatio}`,0,(fontSize+2) * 6,100);

        
        this.ctx.fillText(`Horizontal Pin height: ${this.horizontalPinHeight.toFixed(0)}`,paragraphWidth,(fontSize+2),100);
        this.ctx.fillText(`Horizontal Pin width: ${this.horizontalPinWidth.toFixed(0)}`,paragraphWidth,(fontSize+2) * 2,100);
        this.ctx.fillText(`Horizontal Pin offset: ${this.horizontalPinOffset.toFixed(0)}`,paragraphWidth,(fontSize+2) * 3,100);

        this.ctx.fillText(`Vertical Pin height: ${this.verticalPinHeight.toFixed(0)}`,paragraphWidth*2,(fontSize+2) * 1,100);
        this.ctx.fillText(`Vertical Pin width: ${this.verticalPinWidth.toFixed(0)}`,paragraphWidth*2,(fontSize+2) * 2,100);
        this.ctx.fillText(`Vertical Pin offset: ${this.verticalPinOffset.toFixed(0)}`,paragraphWidth*2,(fontSize+2) * 3,100);

        this.ctx.fillText(`Catalog Index: ${this.pinCatalogIndex.toFixed(0)}`,paragraphWidth*3,(fontSize+2) * 1,100);
        this.ctx.fillText(`Name: ${this.pinConfiguration.name}`,paragraphWidth*3,(fontSize+2) * 2,100);
        this.ctx.fillText(`Package: ${this.pinConfiguration.deviceType}`,paragraphWidth*3,(fontSize+2) * 3,100);            
        
    }
    UpdateDeviceCooridnates(){

        if(!this.ic || this.pinConfiguration === undefined){
            return;
        }

        this.height = window.innerHeight / window.devicePixelRatio - 50;
        this.width  = window.innerWidth / window.devicePixelRatio - 50;
        if(!this.height || !this.width){
            return;
        }
        if(this.width < this.MIN_WIDTH)
        {
            this.width = this.MIN_WIDTH;
        }
        this.ic.setAttribute('height', this.height.toFixed(0));
        this.ic.setAttribute('width', this.width.toFixed(0));

        const headerHeight = this.debugMessages ? .2*this.height : 0;
        const icRenderPanelHeight = this.height - headerHeight;
        const icRenderPanelWidth = this.width;

        this.icMargin = icRenderPanelWidth / 50;
        if(icRenderPanelHeight / 50 < this.icMargin){
            this.icMargin = icRenderPanelHeight / 50;
        }        

        this.horizontalPinWidth = this.icMargin + icRenderPanelWidth/20 < 40  ?  this.icMargin + icRenderPanelWidth/20 : 40;
        this.verticalPinHeight = this.icMargin + icRenderPanelHeight/ 20 < 40 ? this.icMargin + icRenderPanelHeight/ 20 : 40;

        if(this.verticalPinHeight > this.horizontalPinWidth){
            this.verticalPinHeight = this.horizontalPinWidth;
        }
        if(this.horizontalPinWidth > this.verticalPinHeight){
            this.horizontalPinWidth = this.verticalPinHeight;
        }

        this.chipHeight = icRenderPanelHeight - (2*this.icMargin) - (4*this.verticalPinHeight);
        this.chipWidth = this.pinConfiguration.deviceType === DevicePackageType.dip ?
            icRenderPanelWidth *.2 :
            (icRenderPanelWidth- (2*this.icMargin) - (4*this.horizontalPinWidth) > this.chipHeight )? 
                this.chipHeight :
                icRenderPanelWidth- (2*this.icMargin) - (4*this.horizontalPinWidth);        

        this.chipLeft = this.horizontalPinWidth + this.icMargin;
        this.chipRight = this.chipWidth + this.horizontalPinWidth + this.icMargin;
        this.chipTop = headerHeight + this.horizontalPinWidth + this.icMargin;
        this.chipBottom = this.chipTop + this.chipHeight;
    }

    updatePinCoordinates(){
        if(!this.ic || this.pinConfiguration === undefined){
            return;
        }
        this.pinPerSide = this.pinConfiguration.deviceType === DevicePackageType.dip ?  this.pinConfiguration.pinCount / 2 : this.pinConfiguration.pinCount / 4;
        
        this.horizontalPinOffset = this.chipHeight / (2*this.pinConfiguration.pinCount + 1);
        this.horizontalPinHeight = ((this.chipHeight - 2*this.horizontalPinOffset) / this.pinPerSide) - this.horizontalPinOffset;
        this.verticalPinOffset = this.chipWidth / (2*this.pinConfiguration.pinCount + 1);
        this.verticalPinWidth = ((this.chipWidth - 2*this.verticalPinOffset) / this.pinPerSide) - this.verticalPinOffset;
    }
    
    calculatePinPositions() {
        if(!this.ic || this.pinConfiguration === undefined){
            return;
        }
        
        const leftPinLeft = this.chipLeft - this.horizontalPinWidth;
        const topPinTop = this.chipTop - this.verticalPinHeight;
        const pinTopOffset = this.chipTop + this.horizontalPinOffset;
        
        for (let idx = 0; idx < this.pinPerSide; idx++) {

            const leftNum = this.pinConfiguration.deviceType === DevicePackageType.dip ? 
                this.scheme === PinNumberingScheme.DownUp ? (idx + 1) : idx * 2 + 1 :
                idx + 1;
            const rightNum = this.pinConfiguration.deviceType === DevicePackageType.dip ? 
                this.scheme === PinNumberingScheme.DownUp ? this.pinConfiguration.pinCount - idx : this.pinConfiguration.pinCount - (idx * 2 - 1) :
                this.pinConfiguration.pinCount / 4 * 3 - idx;
            const topNum = this.pinConfiguration.pinCount - idx;
            const bottomNum = idx + 1 + this.pinConfiguration.pinCount / 4;
            
            this.pins.push({ x: leftPinLeft, y: pinTopOffset + idx * (this.horizontalPinHeight + this.horizontalPinOffset), w: this.horizontalPinWidth, h: this.horizontalPinHeight, id: leftNum , type:this.pinConfiguration.pins[leftNum - 1].pinType, orientation: PinLayoutOrientation.horizontal });
            this.pins.push({ x: this.chipRight, y: pinTopOffset + idx * (this.horizontalPinHeight + this.horizontalPinOffset), w: this.horizontalPinWidth, h: this.horizontalPinHeight, id: rightNum , type:this.pinConfiguration.pins[rightNum - 1].pinType, orientation: PinLayoutOrientation.horizontal });
            if(this.pinConfiguration.deviceType !== DevicePackageType.dip){
                this.pins.push({ x: this.chipLeft + this.verticalPinOffset + idx * (this.verticalPinWidth + this.verticalPinOffset), y: topPinTop, w: this.verticalPinWidth, h: this.verticalPinHeight, id: topNum , type:this.pinConfiguration.pins[topNum - 1].pinType, orientation: PinLayoutOrientation.vertical });
                this.pins.push({ x: this.chipLeft + this.verticalPinOffset + idx * (this.verticalPinWidth + this.verticalPinOffset), y: this.chipBottom, w: this.verticalPinWidth, h: this.verticalPinHeight, id: bottomNum , type:this.pinConfiguration.pins[bottomNum - 1].pinType, orientation: PinLayoutOrientation.vertical });
            }
        }
    }
    
    drawPins() {            
        for (let idx = 0; idx < this.pins.length; idx++) {    
            this.drawPin(this.pins[idx], this.pins[idx].id === this.selectedPin,this.pins[idx].id === this.previewingPin );
        }
    }

    drawPin(pin, selected = false, preview = false){
        const fontSize = this.width < 300 ? 8 : this.width < 600 ? 9 : this.width < 900 ? 10 : this.width < 1200 ? 11 : 12 ;
        this.ctx.font = `${fontSize}px Arial`;
        /*  FILL  */
        let style = this.colors.find(c => c.type === 'background').color;
        if(pin === undefined){
            return;
        }
        
        /*  STOKE  */
        switch(pin.type[0]){
            
            case PinType.GND:
                style = this.colors.find(c => c.type === 'pinGND').color;
            break;
            case PinType.VCC:
                style = this.colors.find(c => c.type === 'pinVCC').color;
            break;
            case PinType.IN:
                style = this.colors.find(c => c.type === 'pinIN').color;
            break;
            case PinType.INOUT:
                style = this.colors.find(c => c.type === 'pinINOUT').color;
            break;
            case PinType.OUT:
                style = this.colors.find(c => c.type === 'pinOUT').color;
            break;
            case PinType.OE:
                style = this.colors.find(c => c.type === 'pinOE').color;
            break;
            case PinType.CLR:
                style = this.colors.find(c => c.type === 'pinCLR').color;
            break;
            case PinType.CLK:
                style =this.colors.find(c => c.type === 'pinCLK').color;
            break;
            case PinType.PD:
                style = this.colors.find(c => c.type === 'pinPD').color;
            break;
            case PinType.TCK:
                style = this.colors.find(c => c.type === 'pinTCK').color;;
                break;
            case PinType.TDI:
                style = this.colors.find(c => c.type === 'pinTDI').color;
            break;
            case PinType.TDO:
                style = this.colors.find(c => c.type === 'pinTDO').color;
            break;
            case PinType.TMS:
                style = this.colors.find(c => c.type === 'pinTMS').color;
            break;
            case PinType.NC:
                style = this.colors.find(c => c.type === 'pinNC').color;
            break;
        }
        this.ctx.fillStyle = selected ? '#a66' : preview ? '#dca' : style;
        this.ctx.strokeStyle = this.colors.find(c => c.type === 'accent1').color;
        this.ctx.fillRect(pin.x, pin.y, pin.w, pin.h);
        this.ctx.strokeRect(pin.x,pin.y, pin.w, pin.h);
        
        this.ctx.fillStyle = this.colors.find(c => c.type === 'foreground').color;
        if(pin.orientation === PinLayoutOrientation.horizontal){
            
            this.ctx.fillText(pin.id.toFixed(0), pin.x + (this.horizontalPinWidth * .3), pin.y + pin.h / 2 + fontSize/2);
        } else {
            this.ctx.save();
            this.ctx.translate(0, 0);
            this.ctx.rotate(-Math.PI * 2 / 4);
            this.ctx.fillText(pin.id.toFixed(0),-pin.y - (pin.h * .5), pin.x + (pin.w * .5) + fontSize/2);
            this.ctx.rotate(Math.PI * 2 / 4);
            this.ctx.restore();
        }
    }
    
    setDevice(configuration){
        if(configuration){
            component.pinConfiguration = configuration;
        }
        this.drawDevice();
    }
}
// @ts-ignore
const vscode = acquireVsCodeApi();


const component = new PlccChipViewComponent();
// Script run within the webview itself.
(function () {

	// Get a reference to the VS Code webview api.
	// We use this API to post messages back to our extension.

	
    
    component.init();

	const pinView = /** @type {HTMLCanvasElement} */ (document.querySelector('.pinView'));

	const addButtonContainer = document.querySelector('.add-button');
	// addButtonContainer?.querySelector('button')?.addEventListener('click', () => {
	// 	vscode.postMessage({
	// 		type: 'add'
	// 	});
	// })

	const errorContainer = document.createElement('div');
	document.body.appendChild(errorContainer);
	errorContainer.className = 'error';
	errorContainer.style.display = 'none';

	
	// Handle messages sent from the extension to the webview
	window.addEventListener('message', event => {
		const message = event.data; // The json data that the extension sent
		switch (message.type) {
            case 'selectedPin':
                // Update our webview's content
				component.selectedPin = message.pin.pin;
                //component.drawPin(component.selectedPin, true);
                component.drawDevice();
				// Then persist state information.
				// This state is returned in the call to `vscode.getState` below when a webview is reloaded.
				vscode.setState({selectedPin: component.selectedPin});
                break;
			case 'selectPin':
				// Update our webview's content
				component.selectedPin = message.pin.pin;
                //component.drawPin(component.selectedPin, true);
                component.drawDevice();
				// Then persist state information.
				// This state is returned in the call to `vscode.getState` below when a webview is reloaded.
				vscode.setState({selectedPin: component.selectedPin});

				return;
            case 'setDevice':
                component.setDevice(message.device);
                vscode.setState({device: message.device.name, pinCount: message.device.pinCount, packageType: message.device.deviceType});
                break;

            case 'clearDevice':
                component.selectPin(undefined);
                component.pinConfiguration = undefined;
                component.drawDevice();
            case 'colors':
                console.log(message.colors);
                component.colors = message.colors;
                component.drawDevice();;
		}
	});

	// Webviews are normally torn down when not visible and re-created when they become visible again.
	// State lets us save information across these re-loads
	const state = vscode.getState();
	if (state) {
		component.setDevice(state.device);
	}
}());



