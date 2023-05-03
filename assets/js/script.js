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


const pinConfigurations = [
    {
        name: '16v8',
        deviceType: DevicePackageType.dip,
        pinCount: 20,
        pins:[
            { pin:1, pinType: [PinType.IN, PinType.CLK] },
            { pin:2, pinType: [PinType.IN] },
            { pin:3, pinType: [PinType.IN] },
            { pin:4, pinType: [PinType.IN] },
            { pin:5, pinType: [PinType.IN] },
            { pin:6, pinType: [PinType.IN] },
            { pin:7, pinType: [PinType.IN] },
            { pin:8, pinType: [PinType.IN] },
            { pin:9, pinType: [PinType.IN] },
            { pin:10, pinType: [PinType.GND] },
            { pin:11, pinType: [PinType.IN, PinType.OE] },
            { pin:12, pinType: [PinType.INOUT] },
            { pin:13, pinType: [PinType.INOUT] },
            { pin:14, pinType: [PinType.INOUT] },
            { pin:15, pinType: [PinType.INOUT] },
            { pin:16, pinType: [PinType.INOUT] },
            { pin:17, pinType: [PinType.INOUT] },
            { pin:17, pinType: [PinType.INOUT] },
            { pin:18, pinType: [PinType.INOUT] },
            { pin:19, pinType: [PinType.INOUT] },
            { pin:20, pinType: [PinType.VCC] }
        ]
    },
    {
        name: '16v8',
        deviceType: DevicePackageType.plcc,
        pinCount: 20,
        pins:[
            { pin:1, pinType: [PinType.IN, PinType.CLK] },
            { pin:2, pinType: [PinType.IN] },
            { pin:3, pinType: [PinType.IN] },
            { pin:4, pinType: [PinType.IN] },
            { pin:5, pinType: [PinType.IN] },
            { pin:6, pinType: [PinType.IN] },
            { pin:7, pinType: [PinType.IN] },
            { pin:8, pinType: [PinType.IN] },
            { pin:9, pinType: [PinType.IN] },
            { pin:10, pinType: [PinType.GND] },
            { pin:11, pinType: [PinType.IN, PinType.OE] },
            { pin:12, pinType: [PinType.INOUT] },
            { pin:13, pinType: [PinType.INOUT] },
            { pin:14, pinType: [PinType.INOUT] },
            { pin:15, pinType: [PinType.INOUT] },
            { pin:16, pinType: [PinType.INOUT] },
            { pin:17, pinType: [PinType.INOUT] },
            { pin:17, pinType: [PinType.INOUT] },
            { pin:18, pinType: [PinType.INOUT] },
            { pin:19, pinType: [PinType.INOUT] },
            { pin:20, pinType: [PinType.VCC] }
        ]
    },
    {
        name: '20v8',
        pinCount: 24,
        deviceType: DevicePackageType.dip,
        pins:[
            { pin:1, pinType: [PinType.IN, PinType.CLK] },
            { pin:2, pinType: [PinType.IN] },
            { pin:3, pinType: [PinType.IN] },
            { pin:4, pinType: [PinType.IN] },
            { pin:5, pinType: [PinType.IN] },
            { pin:6, pinType: [PinType.IN] },
            { pin:7, pinType: [PinType.IN] },
            { pin:8, pinType: [PinType.IN] },
            { pin:9, pinType: [PinType.IN] },
            { pin:10, pinType: [PinType.IN] },
            { pin:11, pinType: [PinType.IN] },
            { pin:12, pinType: [PinType.GND] },
            { pin:13, pinType: [PinType.IN, PinType.OE] },
            { pin:14, pinType: [PinType.IN] },
            { pin:15, pinType: [PinType.INOUT] },
            { pin:16, pinType: [PinType.INOUT] },
            { pin:17, pinType: [PinType.INOUT] },
            { pin:18, pinType: [PinType.INOUT] },
            { pin:19, pinType: [PinType.INOUT] },
            { pin:20, pinType: [PinType.INOUT] },
            { pin:21, pinType: [PinType.INOUT] },
            { pin:22, pinType: [PinType.INOUT] },
            { pin:23, pinType: [PinType.IN] },
            { pin:24, pinType: [PinType.VCC] }
        ]
    },
    {
        name: '20v8powerdown',
        deviceType: DevicePackageType.dip,
        pinCount: 24,
        pins:[
            { pin:1, pinType: [PinType.IN, PinType.CLK] },
            { pin:2, pinType: [PinType.IN] },
            { pin:3, pinType: [PinType.IN] },
            { pin:4, pinType: [PinType.IN, PinType.PD] },
            { pin:5, pinType: [PinType.IN] },
            { pin:6, pinType: [PinType.IN] },
            { pin:7, pinType: [PinType.IN] },
            { pin:8, pinType: [PinType.IN] },
            { pin:9, pinType: [PinType.IN] },
            { pin:10, pinType: [PinType.IN] },
            { pin:11, pinType: [PinType.IN] },
            { pin:12, pinType: [PinType.GND] },
            { pin:13, pinType: [PinType.INOUT] },
            { pin:14, pinType: [PinType.INOUT] },
            { pin:15, pinType: [PinType.INOUT] },
            { pin:16, pinType: [PinType.INOUT] },
            { pin:17, pinType: [PinType.INOUT] },
            { pin:18, pinType: [PinType.INOUT] },
            { pin:19, pinType: [PinType.INOUT] },
            { pin:20, pinType: [PinType.INOUT] },
            { pin:21, pinType: [PinType.INOUT] },
            { pin:22, pinType: [PinType.INOUT] },
            { pin:23, pinType: [PinType.INOUT] },
            { pin:24, pinType: [PinType.VCC] }
        ]
    },
    {
        name: '20v8',
        deviceType: DevicePackageType.plcc,
        pinCount: 28,
        pins:[
            { pin:1, pinType: [PinType.NC] },
            { pin:2, pinType: [PinType.IN, PinType.CLK] },
            { pin:3, pinType: [PinType.IN] },
            { pin:4, pinType: [PinType.IN] },
            { pin:5, pinType: [PinType.IN] },
            { pin:6, pinType: [PinType.IN] },
            { pin:7, pinType: [PinType.IN] },
            { pin:8, pinType: [PinType.NC] },
            { pin:9, pinType: [PinType.IN] },
            { pin:10, pinType: [PinType.IN] },
            { pin:11, pinType: [PinType.IN] },
            { pin:12, pinType: [PinType.IN] },
            { pin:13, pinType: [PinType.IN] },
            { pin:14, pinType: [PinType.GND] },
            { pin:15, pinType: [PinType.NC] },
            { pin:16, pinType: [PinType.IN, PinType.OE] },
            { pin:17, pinType: [PinType.IN] },
            { pin:18, pinType: [PinType.INOUT] },
            { pin:19, pinType: [PinType.INOUT] },
            { pin:20, pinType: [PinType.INOUT] },
            { pin:21, pinType: [PinType.INOUT] },
            { pin:22, pinType: [PinType.NC] },
            { pin:23, pinType: [PinType.INOUT] },
            { pin:24, pinType: [PinType.INOUT] },
            { pin:25, pinType: [PinType.INOUT] },
            { pin:26, pinType: [PinType.INOUT] },
            { pin:27, pinType: [PinType.IN] },
            { pin:28, pinType: [PinType.VCC] }
        ]
    },
    {
        name: '20v8powerdown',
        deviceType: DevicePackageType.plcc,
        pinCount: 28,
        pins:[
            { pin:1, pinType: [PinType.NC] },
            { pin:2, pinType: [PinType.IN, PinType.CLK] },
            { pin:3, pinType: [PinType.IN] },
            { pin:4, pinType: [PinType.IN] },
            { pin:5, pinType: [PinType.IN, PinType.PD] },
            { pin:6, pinType: [PinType.IN] },
            { pin:7, pinType: [PinType.IN] },
            { pin:8, pinType: [PinType.NC] },
            { pin:9, pinType: [PinType.IN] },
            { pin:10, pinType: [PinType.IN] },
            { pin:11, pinType: [PinType.IN] },
            { pin:12, pinType: [PinType.IN] },
            { pin:13, pinType: [PinType.IN] },
            { pin:14, pinType: [PinType.GND] },
            { pin:15, pinType: [PinType.NC] },
            { pin:16, pinType: [PinType.IN] },
            { pin:17, pinType: [PinType.INOUT] },
            { pin:18, pinType: [PinType.INOUT] },
            { pin:19, pinType: [PinType.INOUT] },
            { pin:20, pinType: [PinType.INOUT] },
            { pin:21, pinType: [PinType.INOUT] },
            { pin:22, pinType: [PinType.NC] },
            { pin:23, pinType: [PinType.INOUT] },
            { pin:24, pinType: [PinType.INOUT] },
            { pin:25, pinType: [PinType.INOUT] },
            { pin:26, pinType: [PinType.INOUT] },
            { pin:27, pinType: [PinType.INOUT] },
            { pin:28, pinType: [PinType.VCC] }
        ]
    },
    {
        name: '22v10',
        deviceType: DevicePackageType.dip,
        pinCount: 24,
        pins:[
            { pin:1, pinType: [PinType.IN, PinType.CLK] },
            { pin:2, pinType: [PinType.IN] },
            { pin:3, pinType: [PinType.IN] },
            { pin:4, pinType: [PinType.IN] },
            { pin:5, pinType: [PinType.IN] },
            { pin:6, pinType: [PinType.IN] },
            { pin:7, pinType: [PinType.IN] },
            { pin:8, pinType: [PinType.IN] },
            { pin:9, pinType: [PinType.IN] },
            { pin:10, pinType: [PinType.IN] },
            { pin:11, pinType: [PinType.IN] },
            { pin:12, pinType: [PinType.GND] },
            { pin:13, pinType: [PinType.INOUT] },
            { pin:14, pinType: [PinType.INOUT] },
            { pin:15, pinType: [PinType.INOUT] },
            { pin:16, pinType: [PinType.INOUT] },
            { pin:17, pinType: [PinType.INOUT] },
            { pin:18, pinType: [PinType.INOUT] },
            { pin:19, pinType: [PinType.INOUT] },
            { pin:20, pinType: [PinType.INOUT] },
            { pin:21, pinType: [PinType.INOUT] },
            { pin:22, pinType: [PinType.INOUT] },
            { pin:23, pinType: [PinType.INOUT] },
            { pin:24, pinType: [PinType.VCC] }
        ]
    },
    {
        name: '22v10',
        deviceType: DevicePackageType.plcc,
        pinCount: 28,
        pins:[
            { pin:1, pinType: [PinType.NC] },
            { pin:2, pinType: [PinType.IN, PinType.CLK] },
            { pin:3, pinType: [PinType.IN] },
            { pin:4, pinType: [PinType.IN] },
            { pin:5, pinType: [PinType.IN] },
            { pin:6, pinType: [PinType.IN] },
            { pin:7, pinType: [PinType.IN] },
            { pin:8, pinType: [PinType.NC] },
            { pin:9, pinType: [PinType.IN] },
            { pin:10, pinType: [PinType.IN] },
            { pin:11, pinType: [PinType.IN] },
            { pin:12, pinType: [PinType.IN] },
            { pin:13, pinType: [PinType.IN] },
            { pin:14, pinType: [PinType.GND] },
            { pin:15, pinType: [PinType.NC] },
            { pin:16, pinType: [PinType.IN] },
            { pin:17, pinType: [PinType.INOUT] },
            { pin:18, pinType: [PinType.INOUT] },
            { pin:19, pinType: [PinType.INOUT] },
            { pin:20, pinType: [PinType.INOUT] },
            { pin:21, pinType: [PinType.INOUT] },
            { pin:22, pinType: [PinType.NC] },
            { pin:23, pinType: [PinType.INOUT] },
            { pin:24, pinType: [PinType.INOUT] },
            { pin:25, pinType: [PinType.INOUT] },
            { pin:26, pinType: [PinType.INOUT] },
            { pin:27, pinType: [PinType.INOUT] },
            { pin:28, pinType: [PinType.VCC] }
        ]
    },
    {
        name: 'v750',
        deviceType: DevicePackageType.dip,
        pinCount: 24,
        pins:[
            { pin:1, pinType: [PinType.IN] },
            { pin:2, pinType: [PinType.IN] },
            { pin:3, pinType: [PinType.IN] },
            { pin:4, pinType: [PinType.IN] },
            { pin:5, pinType: [PinType.IN] },
            { pin:6, pinType: [PinType.IN] },
            { pin:7, pinType: [PinType.IN] },
            { pin:8, pinType: [PinType.IN] },
            { pin:9, pinType: [PinType.IN] },
            { pin:10, pinType: [PinType.IN] },
            { pin:11, pinType: [PinType.IN] },
            { pin:12, pinType: [PinType.GND] },
            { pin:13, pinType: [PinType.INOUT] },
            { pin:14, pinType: [PinType.INOUT] },
            { pin:15, pinType: [PinType.INOUT] },
            { pin:16, pinType: [PinType.INOUT] },
            { pin:17, pinType: [PinType.INOUT] },
            { pin:18, pinType: [PinType.INOUT] },
            { pin:19, pinType: [PinType.INOUT] },
            { pin:20, pinType: [PinType.INOUT] },
            { pin:21, pinType: [PinType.INOUT] },
            { pin:22, pinType: [PinType.INOUT] },
            { pin:23, pinType: [PinType.INOUT] },
            { pin:24, pinType: [PinType.VCC] }
        ]
    },
    {
        name: 'v750c',
        deviceType: DevicePackageType.plcc,
        pinCount: 28,
        pins:[
            { pin:1, pinType: [PinType.NC] },
            { pin:2, pinType: [PinType.IN] },
            { pin:3, pinType: [PinType.IN] },
            { pin:4, pinType: [PinType.IN] },
            { pin:5, pinType: [PinType.IN] },
            { pin:6, pinType: [PinType.IN] },
            { pin:7, pinType: [PinType.IN] },
            { pin:8, pinType: [PinType.NC] },
            { pin:9, pinType: [PinType.IN] },
            { pin:10, pinType: [PinType.IN] },
            { pin:11, pinType: [PinType.IN] },
            { pin:12, pinType: [PinType.IN] },
            { pin:13, pinType: [PinType.IN] },
            { pin:14, pinType: [PinType.GND] },
            { pin:15, pinType: [PinType.NC] },
            { pin:16, pinType: [PinType.IN] },
            { pin:17, pinType: [PinType.INOUT] },
            { pin:18, pinType: [PinType.INOUT] },
            { pin:19, pinType: [PinType.INOUT] },
            { pin:20, pinType: [PinType.INOUT] },
            { pin:21, pinType: [PinType.INOUT] },
            { pin:22, pinType: [PinType.NC] },
            { pin:23, pinType: [PinType.INOUT] },
            { pin:24, pinType: [PinType.INOUT] },
            { pin:25, pinType: [PinType.INOUT] },
            { pin:26, pinType: [PinType.INOUT] },
            { pin:27, pinType: [PinType.INOUT] },
            { pin:28, pinType: [PinType.VCC] }
        ]
    },
    {
        name: 'v2500',
        pinCount: 40,
        deviceType: DevicePackageType.dip,
        pins:[
            { pin:1, pinType: [PinType.IN, PinType.CLK] },
            { pin:2, pinType: [PinType.IN] },
            { pin:3, pinType: [PinType.IN] },
            { pin:4, pinType: [PinType.INOUT] },
            { pin:5, pinType: [PinType.INOUT] },
            { pin:6, pinType: [PinType.INOUT] },
            { pin:7, pinType: [PinType.INOUT] },
            { pin:8, pinType: [PinType.INOUT] },
            { pin:9, pinType: [PinType.INOUT] },
            { pin:10, pinType: [PinType.VCC] },
            { pin:11, pinType: [PinType.INOUT] },
            { pin:12, pinType: [PinType.INOUT] },
            { pin:13, pinType: [PinType.INOUT] },
            { pin:14, pinType: [PinType.INOUT] },
            { pin:15, pinType: [PinType.INOUT] },
            { pin:16, pinType: [PinType.INOUT] },
            { pin:17, pinType: [PinType.IN] },
            { pin:18, pinType: [PinType.IN] },
            { pin:19, pinType: [PinType.IN] },
            { pin:20, pinType: [PinType.IN] },
            { pin:21, pinType: [PinType.IN] },
            { pin:22, pinType: [PinType.IN] },
            { pin:23, pinType: [PinType.IN] },
            { pin:24, pinType: [PinType.INOUT] },
            { pin:25, pinType: [PinType.INOUT] },
            { pin:26, pinType: [PinType.INOUT] },
            { pin:27, pinType: [PinType.INOUT] },
            { pin:28, pinType: [PinType.INOUT] },
            { pin:29, pinType: [PinType.INOUT] },
            { pin:30, pinType: [PinType.GND] },
            { pin:31, pinType: [PinType.INOUT] },
            { pin:32, pinType: [PinType.INOUT] },
            { pin:33, pinType: [PinType.INOUT] },
            { pin:34, pinType: [PinType.INOUT] },
            { pin:35, pinType: [PinType.INOUT] },
            { pin:36, pinType: [PinType.INOUT] },
            { pin:37, pinType: [PinType.IN] },
            { pin:38, pinType: [PinType.IN] },
            { pin:39, pinType: [PinType.IN] },
            { pin:40, pinType: [PinType.IN] }
        ]
    },
    {
        name: 'v2500',
        pinCount: 44,
        deviceType: DevicePackageType.plcc,
        pins:[
            { pin:1, pinType: [PinType.IN, PinType.CLK] },
            { pin:2, pinType: [PinType.IN] },
            { pin:3, pinType: [PinType.IN] },
            { pin:4, pinType: [PinType.GND] },
            { pin:5, pinType: [PinType.INOUT] },
            { pin:6, pinType: [PinType.INOUT] },
            { pin:7, pinType: [PinType.INOUT] },
            { pin:8, pinType: [PinType.INOUT] },
            { pin:9, pinType: [PinType.INOUT] },
            { pin:10, pinType: [PinType.INOUT] },
            { pin:11, pinType: [PinType.VCC] },
            { pin:12, pinType: [PinType.VCC] },
            { pin:13, pinType: [PinType.INOUT] },
            { pin:14, pinType: [PinType.INOUT] },
            { pin:15, pinType: [PinType.INOUT] },
            { pin:16, pinType: [PinType.INOUT] },
            { pin:17, pinType: [PinType.INOUT] },
            { pin:18, pinType: [PinType.INOUT] },
            { pin:19, pinType: [PinType.IN] },
            { pin:20, pinType: [PinType.IN] },
            { pin:21, pinType: [PinType.IN] },
            { pin:22, pinType: [PinType.IN] },
            { pin:23, pinType: [PinType.IN] },
            { pin:24, pinType: [PinType.IN] },
            { pin:25, pinType: [PinType.IN] },
            { pin:26, pinType: [PinType.GND] },
            { pin:27, pinType: [PinType.INOUT] },
            { pin:28, pinType: [PinType.INOUT] },
            { pin:29, pinType: [PinType.INOUT] },
            { pin:30, pinType: [PinType.INOUT] },
            { pin:31, pinType: [PinType.INOUT] },
            { pin:32, pinType: [PinType.INOUT] },
            { pin:33, pinType: [PinType.GND] },
            { pin:34, pinType: [PinType.GND] },
            { pin:35, pinType: [PinType.INOUT] },
            { pin:36, pinType: [PinType.INOUT] },
            { pin:37, pinType: [PinType.INOUT] },
            { pin:38, pinType: [PinType.INOUT] },
            { pin:39, pinType: [PinType.INOUT] },
            { pin:40, pinType: [PinType.INOUT] },
            { pin:41, pinType: [PinType.IN] },
            { pin:42, pinType: [PinType.IN] },
            { pin:43, pinType: [PinType.IN] },
            { pin:44, pinType: [PinType.IN] }
        ]
    },
    {
        name: 'f1500',
        deviceType: DevicePackageType.plcc,
        pinCount: 44,
        pins:[
            { pin:1, pinType: [PinType.IN, PinType.CLR] },
            { pin:2, pinType: [PinType.IN, PinType.OE] },
            { pin:3, pinType: [PinType.VCC] },
            { pin:4, pinType: [PinType.INOUT, PinType.PD] },
            { pin:5, pinType: [PinType.INOUT] },
            { pin:6, pinType: [PinType.INOUT] },
            { pin:7, pinType: [PinType.INOUT] },
            { pin:8, pinType: [PinType.INOUT] },
            { pin:9, pinType: [PinType.INOUT] },
            { pin:10, pinType: [PinType.GND] },
            { pin:11, pinType: [PinType.INOUT] },
            { pin:12, pinType: [PinType.INOUT] },
            { pin:13, pinType: [PinType.INOUT] },
            { pin:14, pinType: [PinType.INOUT] },
            { pin:15, pinType: [PinType.VCC] },
            { pin:16, pinType: [PinType.INOUT] },
            { pin:17, pinType: [PinType.INOUT] },
            { pin:18, pinType: [PinType.INOUT] },
            { pin:19, pinType: [PinType.INOUT] },
            { pin:20, pinType: [PinType.INOUT] },
            { pin:21, pinType: [PinType.INOUT] },
            { pin:22, pinType: [PinType.GND] },
            { pin:23, pinType: [PinType.VCC] },
            { pin:24, pinType: [PinType.INOUT] },
            { pin:25, pinType: [PinType.INOUT] },
            { pin:26, pinType: [PinType.INOUT] },
            { pin:27, pinType: [PinType.INOUT] },
            { pin:28, pinType: [PinType.INOUT] },
            { pin:29, pinType: [PinType.INOUT] },
            { pin:30, pinType: [PinType.GND] },
            { pin:31, pinType: [PinType.INOUT] },
            { pin:32, pinType: [PinType.INOUT] },
            { pin:33, pinType: [PinType.INOUT] },
            { pin:34, pinType: [PinType.INOUT] },
            { pin:35, pinType: [PinType.VCC] },
            { pin:36, pinType: [PinType.INOUT] },
            { pin:37, pinType: [PinType.INOUT] },
            { pin:38, pinType: [PinType.INOUT] },
            { pin:39, pinType: [PinType.INOUT] },
            { pin:40, pinType: [PinType.INOUT] },
            { pin:41, pinType: [PinType.INOUT] },
            { pin:42, pinType: [PinType.GND] },
            { pin:43, pinType: [PinType.IN, PinType.CLK] },
            { pin:44, pinType: [PinType.IN, PinType.OE] }
        ]
    },
    {
        name: 'f1500',
        deviceType: DevicePackageType.tqfp,
        pinCount: 44,
        pins:[
            { pin:1, pinType: [PinType.IN, PinType.CLR] },
            { pin:2, pinType: [PinType.IN, PinType.OE] },
            { pin:3, pinType: [PinType.VCC] },
            { pin:4, pinType: [PinType.INOUT, PinType.PD] },
            { pin:5, pinType: [PinType.INOUT] },
            { pin:6, pinType: [PinType.INOUT] },
            { pin:7, pinType: [PinType.INOUT] },
            { pin:8, pinType: [PinType.INOUT] },
            { pin:9, pinType: [PinType.INOUT] },
            { pin:10, pinType: [PinType.GND] },
            { pin:11, pinType: [PinType.INOUT] },
            { pin:12, pinType: [PinType.INOUT] },
            { pin:13, pinType: [PinType.INOUT] },
            { pin:14, pinType: [PinType.INOUT] },
            { pin:15, pinType: [PinType.VCC] },
            { pin:16, pinType: [PinType.INOUT] },
            { pin:17, pinType: [PinType.INOUT] },
            { pin:18, pinType: [PinType.INOUT] },
            { pin:19, pinType: [PinType.INOUT] },
            { pin:20, pinType: [PinType.INOUT] },
            { pin:21, pinType: [PinType.INOUT] },
            { pin:22, pinType: [PinType.GND] },
            { pin:23, pinType: [PinType.VCC] },
            { pin:24, pinType: [PinType.INOUT] },
            { pin:25, pinType: [PinType.INOUT] },
            { pin:26, pinType: [PinType.INOUT] },
            { pin:27, pinType: [PinType.INOUT] },
            { pin:28, pinType: [PinType.INOUT] },
            { pin:29, pinType: [PinType.INOUT] },
            { pin:30, pinType: [PinType.GND] },
            { pin:31, pinType: [PinType.INOUT] },
            { pin:32, pinType: [PinType.INOUT] },
            { pin:33, pinType: [PinType.INOUT] },
            { pin:34, pinType: [PinType.INOUT] },
            { pin:35, pinType: [PinType.VCC] },
            { pin:36, pinType: [PinType.INOUT] },
            { pin:37, pinType: [PinType.INOUT] },
            { pin:38, pinType: [PinType.INOUT] },
            { pin:39, pinType: [PinType.INOUT] },
            { pin:40, pinType: [PinType.INOUT] },
            { pin:41, pinType: [PinType.NC] },
            { pin:42, pinType: [PinType.GND] },
            { pin:43, pinType: [PinType.IN, PinType.CLK] },
            { pin:44, pinType: [PinType.IN, PinType.OE] }
        ]
    },
    {
        name: 'f1502',
        deviceType: DevicePackageType.plcc,
        pinCount: 44,
        pins:[
            { pin:1, pinType: [PinType.IN, PinType.CLR] },
            { pin:2, pinType: [PinType.IN, PinType.CLK, PinType.OE] },
            { pin:3, pinType: [PinType.VCC] },
            { pin:4, pinType: [PinType.INOUT, PinType.PD] },
            { pin:5, pinType: [PinType.INOUT] },
            { pin:6, pinType: [PinType.INOUT] },
            { pin:7, pinType: [PinType.INOUT, PinType.TDI] },
            { pin:8, pinType: [PinType.INOUT] },
            { pin:9, pinType: [PinType.INOUT] },
            { pin:10, pinType: [PinType.GND] },
            { pin:11, pinType: [PinType.INOUT, PinType.PD] },
            { pin:12, pinType: [PinType.INOUT] },
            { pin:13, pinType: [PinType.INOUT, PinType.TMS] },
            { pin:14, pinType: [PinType.INOUT] },
            { pin:15, pinType: [PinType.VCC] },
            { pin:16, pinType: [PinType.INOUT] },
            { pin:17, pinType: [PinType.INOUT] },
            { pin:18, pinType: [PinType.INOUT] },
            { pin:19, pinType: [PinType.INOUT] },
            { pin:20, pinType: [PinType.INOUT] },
            { pin:21, pinType: [PinType.INOUT] },
            { pin:22, pinType: [PinType.GND] },
            { pin:23, pinType: [PinType.VCC] },
            { pin:24, pinType: [PinType.INOUT] },
            { pin:25, pinType: [PinType.INOUT, PinType.PD] },
            { pin:26, pinType: [PinType.INOUT] },
            { pin:27, pinType: [PinType.INOUT] },
            { pin:28, pinType: [PinType.INOUT] },
            { pin:29, pinType: [PinType.INOUT] },
            { pin:30, pinType: [PinType.GND] },
            { pin:31, pinType: [PinType.INOUT] },
            { pin:32, pinType: [PinType.INOUT, PinType.TCK] },
            { pin:33, pinType: [PinType.INOUT] },
            { pin:34, pinType: [PinType.INOUT] },
            { pin:35, pinType: [PinType.VCC] },
            { pin:36, pinType: [PinType.INOUT] },
            { pin:37, pinType: [PinType.INOUT] },
            { pin:38, pinType: [PinType.INOUT, PinType.TDO] },
            { pin:39, pinType: [PinType.INOUT] },
            { pin:40, pinType: [PinType.INOUT] },
            { pin:41, pinType: [PinType.INOUT, PinType.CLK] },
            { pin:42, pinType: [PinType.GND] },
            { pin:43, pinType: [PinType.IN, PinType.CLK] },
            { pin:44, pinType: [PinType.IN, PinType.OE] }
        ]
    },
    {
        name: 'f1502',
        deviceType: DevicePackageType.tqfp,
        pinCount: 44,
        pins:[
            { pin:1, pinType: [PinType.INOUT, PinType.TDI] },
            { pin:2, pinType: [PinType.INOUT] },
            { pin:3, pinType: [PinType.INOUT] },
            { pin:4, pinType: [PinType.GND] },
            { pin:5, pinType: [PinType.INOUT, PinType.PD] },
            { pin:6, pinType: [PinType.INOUT] },
            { pin:7, pinType: [PinType.INOUT, PinType.TMS] },
            { pin:8, pinType: [PinType.INOUT] },
            { pin:9, pinType: [PinType.VCC] },
            { pin:10, pinType: [PinType.INOUT] },
            { pin:11, pinType: [PinType.INOUT] },
            { pin:12, pinType: [PinType.INOUT] },
            { pin:13, pinType: [PinType.INOUT] },
            { pin:14, pinType: [PinType.INOUT] },
            { pin:15, pinType: [PinType.INOUT] },
            { pin:16, pinType: [PinType.GND] },
            { pin:17, pinType: [PinType.VCC] },
            { pin:18, pinType: [PinType.INOUT] },
            { pin:19, pinType: [PinType.INOUT, PinType.PD] },
            { pin:20, pinType: [PinType.INOUT] },
            { pin:21, pinType: [PinType.INOUT] },
            { pin:22, pinType: [PinType.INOUT] },
            { pin:23, pinType: [PinType.INOUT] },
            { pin:24, pinType: [PinType.GND] },
            { pin:25, pinType: [PinType.INOUT] },
            { pin:26, pinType: [PinType.INOUT, PinType.TCK] },
            { pin:27, pinType: [PinType.INOUT] },
            { pin:28, pinType: [PinType.INOUT] },
            { pin:29, pinType: [PinType.VCC] },
            { pin:30, pinType: [PinType.INOUT] },
            { pin:31, pinType: [PinType.INOUT] },
            { pin:32, pinType: [PinType.INOUT, PinType.TDO] },
            { pin:33, pinType: [PinType.INOUT] },
            { pin:34, pinType: [PinType.INOUT] },
            { pin:35, pinType: [PinType.CLK] },
            { pin:36, pinType: [PinType.GND] },
            { pin:37, pinType: [PinType.IN, PinType.CLK] },
            { pin:38, pinType: [PinType.OE] },
            { pin:39, pinType: [PinType.IN, PinType.CLR] },
            { pin:40, pinType: [PinType.CLK, PinType.OE] },
            { pin:41, pinType: [PinType.VCC] },
            { pin:42, pinType: [PinType.INOUT] },
            { pin:43, pinType: [PinType.INOUT] },
            { pin:44, pinType: [PinType.INOUT] }
        ]
    },
    {
        name: 'f1504',
        deviceType: DevicePackageType.plcc,
        pinCount: 44,
        pins:[
            { pin:1, pinType: [PinType.IN, PinType.CLR] },
            { pin:2, pinType: [PinType.IN, PinType.CLK, PinType.OE] },
            { pin:3, pinType: [PinType.VCC] },
            { pin:4, pinType: [PinType.INOUT, PinType.PD] },
            { pin:5, pinType: [PinType.INOUT] },
            { pin:6, pinType: [PinType.INOUT] },
            { pin:7, pinType: [PinType.INOUT, PinType.TDI] },
            { pin:8, pinType: [PinType.INOUT] },
            { pin:9, pinType: [PinType.INOUT] },
            { pin:10, pinType: [PinType.GND] },
            { pin:11, pinType: [PinType.INOUT, PinType.PD] },
            { pin:12, pinType: [PinType.INOUT] },
            { pin:13, pinType: [PinType.INOUT, PinType.TMS] },
            { pin:14, pinType: [PinType.INOUT] },
            { pin:15, pinType: [PinType.VCC] },
            { pin:16, pinType: [PinType.INOUT] },
            { pin:17, pinType: [PinType.INOUT] },
            { pin:18, pinType: [PinType.INOUT] },
            { pin:19, pinType: [PinType.INOUT] },
            { pin:20, pinType: [PinType.INOUT] },
            { pin:21, pinType: [PinType.INOUT] },
            { pin:22, pinType: [PinType.GND] },
            { pin:23, pinType: [PinType.VCC] },
            { pin:24, pinType: [PinType.INOUT] },
            { pin:25, pinType: [PinType.INOUT, PinType.PD] },
            { pin:26, pinType: [PinType.INOUT] },
            { pin:27, pinType: [PinType.INOUT] },
            { pin:28, pinType: [PinType.INOUT] },
            { pin:29, pinType: [PinType.INOUT] },
            { pin:30, pinType: [PinType.GND] },
            { pin:31, pinType: [PinType.INOUT] },
            { pin:32, pinType: [PinType.INOUT, PinType.TCK] },
            { pin:33, pinType: [PinType.INOUT] },
            { pin:34, pinType: [PinType.INOUT] },
            { pin:35, pinType: [PinType.VCC] },
            { pin:36, pinType: [PinType.INOUT] },
            { pin:37, pinType: [PinType.INOUT] },
            { pin:38, pinType: [PinType.INOUT, PinType.TDO] },
            { pin:39, pinType: [PinType.INOUT] },
            { pin:40, pinType: [PinType.INOUT] },
            { pin:41, pinType: [PinType.INOUT, PinType.CLK] },
            { pin:42, pinType: [PinType.GND] },
            { pin:43, pinType: [PinType.IN, PinType.CLK] },
            { pin:44, pinType: [PinType.IN, PinType.OE] }
        ]
    },
    {
        name: 'f1504',
        deviceType: DevicePackageType.tqfp,
        pinCount: 44,
        pins:[
            { pin:1, pinType: [PinType.INOUT, PinType.TDI] },
            { pin:2, pinType: [PinType.INOUT] },
            { pin:3, pinType: [PinType.INOUT] },
            { pin:4, pinType: [PinType.GND] },
            { pin:5, pinType: [PinType.INOUT, PinType.PD] },
            { pin:6, pinType: [PinType.INOUT] },
            { pin:7, pinType: [PinType.INOUT, PinType.TMS] },
            { pin:8, pinType: [PinType.INOUT] },
            { pin:9, pinType: [PinType.VCC] },
            { pin:10, pinType: [PinType.INOUT] },
            { pin:11, pinType: [PinType.INOUT] },
            { pin:12, pinType: [PinType.INOUT] },
            { pin:13, pinType: [PinType.INOUT] },
            { pin:14, pinType: [PinType.INOUT] },
            { pin:15, pinType: [PinType.INOUT] },
            { pin:16, pinType: [PinType.GND] },
            { pin:17, pinType: [PinType.VCC] },
            { pin:18, pinType: [PinType.INOUT] },
            { pin:19, pinType: [PinType.INOUT, PinType.PD] },
            { pin:20, pinType: [PinType.INOUT] },
            { pin:21, pinType: [PinType.INOUT] },
            { pin:22, pinType: [PinType.INOUT] },
            { pin:23, pinType: [PinType.INOUT] },
            { pin:24, pinType: [PinType.GND] },
            { pin:25, pinType: [PinType.INOUT] },
            { pin:26, pinType: [PinType.INOUT, PinType.TCK] },
            { pin:27, pinType: [PinType.INOUT] },
            { pin:28, pinType: [PinType.INOUT] },
            { pin:29, pinType: [PinType.VCC] },
            { pin:30, pinType: [PinType.INOUT] },
            { pin:31, pinType: [PinType.NC] },
            { pin:32, pinType: [PinType.INOUT, PinType.TDO] },
            { pin:33, pinType: [PinType.INOUT] },
            { pin:34, pinType: [PinType.INOUT] },
            { pin:35, pinType: [PinType.CLK] },
            { pin:36, pinType: [PinType.GND] },
            { pin:37, pinType: [PinType.IN, PinType.CLK] },
            { pin:38, pinType: [PinType.IN, PinType.OE] },
            { pin:39, pinType: [PinType.IN, PinType.CLR] },
            { pin:40, pinType: [PinType.INOUT, PinType.CLK, PinType.OE] },
            { pin:41, pinType: [PinType.VCC] },
            { pin:42, pinType: [PinType.INOUT] },
            { pin:43, pinType: [PinType.INOUT] },
            { pin:44, pinType: [PinType.INOUT] }
        ]
    },
    {
        name: 'f1504',
        deviceType: DevicePackageType.plcc,
        pinCount: 68,
        pins:[
            { pin:1, pinType: [PinType.IN, PinType.CLR] },
            { pin:2, pinType: [PinType.CLK, PinType.OE] },
            { pin:3, pinType: [PinType.VCC] },
            { pin:4, pinType: [PinType.INOUT] },
            { pin:5, pinType: [PinType.INOUT] },
            { pin:6, pinType: [PinType.GND] },
            { pin:7, pinType: [PinType.INOUT] },
            { pin:8, pinType: [PinType.INOUT] },
            { pin:9, pinType: [PinType.INOUT] },
            { pin:10, pinType: [PinType.INOUT] },
            { pin:11, pinType: [PinType.VCC] },
            { pin:12, pinType: [PinType.INOUT, PinType.TDI] },
            { pin:13, pinType: [PinType.INOUT] },
            { pin:14, pinType: [PinType.INOUT] },
            { pin:15, pinType: [PinType.INOUT] },
            { pin:16, pinType: [PinType.GND] },
            { pin:17, pinType: [PinType.INOUT, PinType.PD] },
            { pin:18, pinType: [PinType.INOUT] },
            { pin:19, pinType: [PinType.INOUT, PinType.TMS] },
            { pin:20, pinType: [PinType.INOUT] },
            { pin:21, pinType: [PinType.VCC] },
            { pin:22, pinType: [PinType.INOUT] },
            { pin:23, pinType: [PinType.INOUT] },
            { pin:24, pinType: [PinType.INOUT] },
            { pin:25, pinType: [PinType.INOUT] },
            { pin:26, pinType: [PinType.GND] },
            { pin:27, pinType: [PinType.INOUT] },
            { pin:28, pinType: [PinType.INOUT] },
            { pin:29, pinType: [PinType.INOUT] },
            { pin:30, pinType: [PinType.INOUT] },
            { pin:31, pinType: [PinType.VCC] },
            { pin:32, pinType: [PinType.INOUT] },
            { pin:33, pinType: [PinType.INOUT] },
            { pin:34, pinType: [PinType.GND] },
            { pin:35, pinType: [PinType.VCC] },
            { pin:36, pinType: [PinType.INOUT] },
            { pin:37, pinType: [PinType.INOUT, PinType.PD] },
            { pin:38, pinType: [PinType.INOUT, PinType.TDO] },
            { pin:39, pinType: [PinType.INOUT] },
            { pin:40, pinType: [PinType.INOUT] },
            { pin:41, pinType: [PinType.INOUT] },
            { pin:42, pinType: [PinType.INOUT] },
            { pin:43, pinType: [PinType.VCC] },
            { pin:44, pinType: [PinType.INOUT] },
            { pin:45, pinType: [PinType.INOUT] },
            { pin:46, pinType: [PinType.INOUT] },
            { pin:47, pinType: [PinType.INOUT] },
            { pin:48, pinType: [PinType.GND] },
            { pin:49, pinType: [PinType.INOUT] },
            { pin:50, pinType: [PinType.INOUT, PinType.TCK] },
            { pin:51, pinType: [PinType.INOUT] },
            { pin:52, pinType: [PinType.INOUT] },
            { pin:53, pinType: [PinType.VCC] },
            { pin:54, pinType: [PinType.INOUT] },
            { pin:55, pinType: [PinType.INOUT] },
            { pin:56, pinType: [PinType.INOUT] },
            { pin:57, pinType: [PinType.INOUT, PinType.TDI] },
            { pin:58, pinType: [PinType.GND] },
            { pin:59, pinType: [PinType.INOUT] },
            { pin:60, pinType: [PinType.INOUT] },
            { pin:61, pinType: [PinType.INOUT] },
            { pin:62, pinType: [PinType.INOUT, PinType.TCK] },
            { pin:63, pinType: [PinType.VCC] },
            { pin:64, pinType: [PinType.INOUT] },
            { pin:65, pinType: [PinType.IN, PinType.CLK] },
            { pin:66, pinType: [PinType.GND] },
            { pin:67, pinType: [PinType.IN, PinType.CLK] },
            { pin:68, pinType: [PinType.IN, PinType.OE] }          
        ]
    },
    {
        name: 'f1504',
        deviceType: DevicePackageType.plcc,
        pinCount: 84,
        pins:[
            { pin:1, pinType: [PinType.IN, PinType.CLR] },
            { pin:2, pinType: [PinType.CLK, PinType.OE] },
            { pin:3, pinType: [PinType.VCC] },
            { pin:4, pinType: [PinType.INOUT] },
            { pin:5, pinType: [PinType.INOUT] },
            { pin:6, pinType: [PinType.INOUT] },
            { pin:7, pinType: [PinType.GND] },
            { pin:8, pinType: [PinType.INOUT] },
            { pin:9, pinType: [PinType.INOUT] },
            { pin:10, pinType: [PinType.INOUT] },
            { pin:11, pinType: [PinType.INOUT] },
            { pin:12, pinType: [PinType.INOUT] },
            { pin:13, pinType: [PinType.VCC] },
            { pin:14, pinType: [PinType.IN, PinType.TDI] },
            { pin:15, pinType: [PinType.INOUT] },
            { pin:16, pinType: [PinType.INOUT] },
            { pin:17, pinType: [PinType.INOUT] },
            { pin:18, pinType: [PinType.INOUT] },
            { pin:19, pinType: [PinType.GND] },
            { pin:20, pinType: [PinType.IN, PinType.PD] },
            { pin:21, pinType: [PinType.INOUT] },
            { pin:22, pinType: [PinType.INOUT] },
            { pin:23, pinType: [PinType.INOUT, PinType.TMS] },
            { pin:24, pinType: [PinType.INOUT] },
            { pin:25, pinType: [PinType.NC] },
            { pin:26, pinType: [PinType.VCC] },
            { pin:27, pinType: [PinType.INOUT] },
            { pin:28, pinType: [PinType.INOUT] },
            { pin:29, pinType: [PinType.INOUT] },
            { pin:30, pinType: [PinType.INOUT] },
            { pin:31, pinType: [PinType.INOUT] },
            { pin:32, pinType: [PinType.GND] },
            { pin:33, pinType: [PinType.INOUT] },
            { pin:34, pinType: [PinType.INOUT] },
            { pin:35, pinType: [PinType.INOUT] },
            { pin:36, pinType: [PinType.INOUT] },
            { pin:37, pinType: [PinType.INOUT] },
            { pin:38, pinType: [PinType.VCC] },
            { pin:39, pinType: [PinType.INOUT] },
            { pin:40, pinType: [PinType.INOUT] },
            { pin:41, pinType: [PinType.INOUT] },
            { pin:42, pinType: [PinType.GND] },
            { pin:43, pinType: [PinType.VCC] },
            { pin:44, pinType: [PinType.INOUT] },
            { pin:45, pinType: [PinType.INOUT] },
            { pin:46, pinType: [PinType.INOUT, PinType.PD] },
            { pin:47, pinType: [PinType.GND] },
            { pin:48, pinType: [PinType.INOUT] },
            { pin:49, pinType: [PinType.INOUT] },
            { pin:50, pinType: [PinType.INOUT] },
            { pin:51, pinType: [PinType.INOUT] },
            { pin:52, pinType: [PinType.INOUT] },
            { pin:53, pinType: [PinType.VCC] },
            { pin:54, pinType: [PinType.INOUT] },
            { pin:55, pinType: [PinType.INOUT] },
            { pin:56, pinType: [PinType.INOUT] },
            { pin:57, pinType: [PinType.INOUT] },
            { pin:58, pinType: [PinType.INOUT] },
            { pin:59, pinType: [PinType.GND] },
            { pin:60, pinType: [PinType.INOUT] },
            { pin:61, pinType: [PinType.INOUT] },
            { pin:62, pinType: [PinType.INOUT, PinType.TCK] },
            { pin:63, pinType: [PinType.INOUT] },
            { pin:64, pinType: [PinType.INOUT] },
            { pin:65, pinType: [PinType.INOUT] },
            { pin:66, pinType: [PinType.VCC] },
            { pin:67, pinType: [PinType.INOUT] },
            { pin:68, pinType: [PinType.INOUT] },
            { pin:69, pinType: [PinType.INOUT] },
            { pin:70, pinType: [PinType.INOUT] },
            { pin:71, pinType: [PinType.IN, PinType.TDO] },
            { pin:72, pinType: [PinType.GND] },
            { pin:73, pinType: [PinType.INOUT] }, 
            { pin:74, pinType: [PinType.INOUT] },
            { pin:75, pinType: [PinType.INOUT] },
            { pin:76, pinType: [PinType.INOUT] },
            { pin:77, pinType: [PinType.INOUT] },
            { pin:78, pinType: [PinType.VCC] },
            { pin:79, pinType: [PinType.INOUT] },
            { pin:80, pinType: [PinType.INOUT] },
            { pin:81, pinType: [PinType.IN, PinType.CLK] },
            { pin:82, pinType: [PinType.GND] },
            { pin:83, pinType: [PinType.IN, PinType.CLK] },
            { pin:84, pinType: [PinType.IN, PinType.OE] }        
        ]
    },
    {
        name: 'f1508',
        deviceType: DevicePackageType.plcc,
        pinCount: 84,
        pins:[
            { pin:1, pinType: [PinType.IN, PinType.CLR] },
            { pin:2, pinType: [PinType.IN, PinType.CLK, PinType.OE] },
            { pin:3, pinType: [PinType.VCC] },
            { pin:4, pinType: [PinType.INOUT] },
            { pin:5, pinType: [PinType.INOUT] },
            { pin:6, pinType: [PinType.INOUT] },
            { pin:7, pinType: [PinType.GND] },
            { pin:8, pinType: [PinType.INOUT] },
            { pin:9, pinType: [PinType.INOUT] },
            { pin:10, pinType: [PinType.INOUT] },
            { pin:11, pinType: [PinType.INOUT] },
            { pin:12, pinType: [PinType.INOUT, PinType.PD] },
            { pin:13, pinType: [PinType.VCC] },
            { pin:14, pinType: [PinType.IN, PinType.TDI] },
            { pin:15, pinType: [PinType.INOUT] },
            { pin:16, pinType: [PinType.INOUT] },
            { pin:17, pinType: [PinType.INOUT] },
            { pin:18, pinType: [PinType.INOUT] },
            { pin:19, pinType: [PinType.GND] },
            { pin:20, pinType: [PinType.IN] },
            { pin:21, pinType: [PinType.INOUT] },
            { pin:22, pinType: [PinType.INOUT] },
            { pin:23, pinType: [PinType.INOUT, PinType.TMS] },
            { pin:24, pinType: [PinType.INOUT] },
            { pin:25, pinType: [PinType.INOUT] },
            { pin:26, pinType: [PinType.VCC] },
            { pin:27, pinType: [PinType.INOUT] },
            { pin:28, pinType: [PinType.INOUT] },
            { pin:29, pinType: [PinType.INOUT] },
            { pin:30, pinType: [PinType.INOUT] },
            { pin:31, pinType: [PinType.INOUT] },
            { pin:32, pinType: [PinType.GND] },
            { pin:33, pinType: [PinType.INOUT] },
            { pin:34, pinType: [PinType.INOUT] },
            { pin:35, pinType: [PinType.INOUT] },
            { pin:36, pinType: [PinType.INOUT] },
            { pin:37, pinType: [PinType.INOUT] },
            { pin:38, pinType: [PinType.VCC] },
            { pin:39, pinType: [PinType.INOUT] },
            { pin:40, pinType: [PinType.INOUT] },
            { pin:41, pinType: [PinType.INOUT] },
            { pin:42, pinType: [PinType.GND] },
            { pin:43, pinType: [PinType.VCC] },
            { pin:44, pinType: [PinType.INOUT] },
            { pin:45, pinType: [PinType.INOUT, PinType.PD] },
            { pin:46, pinType: [PinType.INOUT] },
            { pin:47, pinType: [PinType.GND] },
            { pin:48, pinType: [PinType.INOUT] },
            { pin:49, pinType: [PinType.INOUT] },
            { pin:50, pinType: [PinType.INOUT] },
            { pin:51, pinType: [PinType.INOUT] },
            { pin:52, pinType: [PinType.INOUT] },
            { pin:53, pinType: [PinType.VCC] },
            { pin:54, pinType: [PinType.INOUT] },
            { pin:55, pinType: [PinType.INOUT] },
            { pin:56, pinType: [PinType.INOUT] },
            { pin:57, pinType: [PinType.INOUT] },
            { pin:58, pinType: [PinType.INOUT] },
            { pin:59, pinType: [PinType.GND] },
            { pin:60, pinType: [PinType.INOUT] },
            { pin:61, pinType: [PinType.INOUT] },
            { pin:62, pinType: [PinType.INOUT, PinType.TCK] },
            { pin:63, pinType: [PinType.INOUT] },
            { pin:64, pinType: [PinType.INOUT] },
            { pin:65, pinType: [PinType.INOUT] },
            { pin:66, pinType: [PinType.VCC] },
            { pin:67, pinType: [PinType.INOUT] },
            { pin:68, pinType: [PinType.INOUT] },
            { pin:69, pinType: [PinType.INOUT] },
            { pin:70, pinType: [PinType.INOUT] },
            { pin:71, pinType: [PinType.INOUT, PinType.TDO] },
            { pin:72, pinType: [PinType.GND] },
            { pin:73, pinType: [PinType.INOUT] }, 
            { pin:74, pinType: [PinType.INOUT] },
            { pin:75, pinType: [PinType.INOUT] },
            { pin:76, pinType: [PinType.INOUT] },
            { pin:77, pinType: [PinType.INOUT] },
            { pin:78, pinType: [PinType.VCC] },
            { pin:79, pinType: [PinType.INOUT] },
            { pin:80, pinType: [PinType.INOUT] },
            { pin:81, pinType: [PinType.INOUT, PinType.CLK] },
            { pin:82, pinType: [PinType.GND] },
            { pin:83, pinType: [PinType.IN, PinType.CLK] },
            { pin:84, pinType: [PinType.IN, PinType.CLR] }       
        ]
    },
    {
        name: 'f1504',
        deviceType: DevicePackageType.tqfp,
        pinCount: 100,
        pins:[
            { pin:1, pinType: [PinType.NC] },
            { pin:2, pinType: [PinType.NC] },
            { pin:3, pinType: [PinType.VCC] },
            { pin:4, pinType: [PinType.INOUT, PinType.TDI] },
            { pin:5, pinType: [PinType.NC] },
            { pin:6, pinType: [PinType.INOUT] },
            { pin:7, pinType: [PinType.NC] },
            { pin:8, pinType: [PinType.INOUT] },
            { pin:9, pinType: [PinType.INOUT] },
            { pin:10, pinType: [PinType.INOUT] },
            { pin:11, pinType: [PinType.GND] },
            { pin:12, pinType: [PinType.INOUT, PinType.PD] },
            { pin:13, pinType: [PinType.INOUT] },
            { pin:14, pinType: [PinType.INOUT] },
            { pin:15, pinType: [PinType.INOUT, PinType.TMS] },
            { pin:16, pinType: [PinType.INOUT] },
            { pin:17, pinType: [PinType.INOUT] },
            { pin:18, pinType: [PinType.VCC] },
            { pin:19, pinType: [PinType.INOUT] },
            { pin:20, pinType: [PinType.INOUT] },
            { pin:21, pinType: [PinType.INOUT] },
            { pin:22, pinType: [PinType.NC] },
            { pin:23, pinType: [PinType.INOUT] },
            { pin:24, pinType: [PinType.NC] },
            { pin:25, pinType: [PinType.INOUT] },
            { pin:26, pinType: [PinType.GND] },
            { pin:27, pinType: [PinType.NC] },
            { pin:28, pinType: [PinType.NC] },
            { pin:29, pinType: [PinType.INOUT] },
            { pin:30, pinType: [PinType.INOUT] },
            { pin:31, pinType: [PinType.INOUT] },
            { pin:32, pinType: [PinType.INOUT] },
            { pin:33, pinType: [PinType.INOUT] },
            { pin:34, pinType: [PinType.VCC] },
            { pin:35, pinType: [PinType.INOUT] },
            { pin:36, pinType: [PinType.INOUT] },
            { pin:37, pinType: [PinType.INOUT] },
            { pin:38, pinType: [PinType.GND] },
            { pin:39, pinType: [PinType.VCC] },
            { pin:40, pinType: [PinType.INOUT] },
            { pin:41, pinType: [PinType.INOUT] },
            { pin:42, pinType: [PinType.INOUT, PinType.PD] },
            { pin:43, pinType: [PinType.GND] },
            { pin:44, pinType: [PinType.INOUT] },
            { pin:45, pinType: [PinType.INOUT] },
            { pin:46, pinType: [PinType.INOUT] },
            { pin:47, pinType: [PinType.INOUT] },
            { pin:48, pinType: [PinType.INOUT] },
            { pin:49, pinType: [PinType.NC] },
            { pin:50, pinType: [PinType.NC] },
            { pin:51, pinType: [PinType.VCC] },
            { pin:52, pinType: [PinType.INOUT] },
            { pin:53, pinType: [PinType.NC] },
            { pin:54, pinType: [PinType.INOUT] },
            { pin:55, pinType: [PinType.NC] },
            { pin:56, pinType: [PinType.INOUT] },
            { pin:57, pinType: [PinType.INOUT] },
            { pin:58, pinType: [PinType.INOUT] },
            { pin:59, pinType: [PinType.GND] },
            { pin:60, pinType: [PinType.INOUT] },
            { pin:61, pinType: [PinType.INOUT] },
            { pin:62, pinType: [PinType.INOUT, PinType.TCK] },
            { pin:63, pinType: [PinType.INOUT] },
            { pin:64, pinType: [PinType.INOUT] },
            { pin:65, pinType: [PinType.INOUT] },
            { pin:66, pinType: [PinType.VCC] },
            { pin:67, pinType: [PinType.INOUT] },
            { pin:68, pinType: [PinType.INOUT] },
            { pin:69, pinType: [PinType.INOUT] },
            { pin:70, pinType: [PinType.NC] },
            { pin:71, pinType: [PinType.INOUT] },
            { pin:72, pinType: [PinType.NC] },
            { pin:73, pinType: [PinType.INOUT, PinType.TDO] }, 
            { pin:74, pinType: [PinType.GND] },
            { pin:75, pinType: [PinType.INOUT] },
            { pin:76, pinType: [PinType.INOUT] },
            { pin:77, pinType: [PinType.NC] },
            { pin:78, pinType: [PinType.NC] },
            { pin:79, pinType: [PinType.INOUT] },
            { pin:80, pinType: [PinType.INOUT] },
            { pin:81, pinType: [PinType.INOUT] },
            { pin:82, pinType: [PinType.VCC] },
            { pin:83, pinType: [PinType.INOUT] },
            { pin:84, pinType: [PinType.INOUT] },   
            { pin:85, pinType: [PinType.INOUT, PinType.CLK] },  
            { pin:86, pinType: [PinType.GND] },  
            { pin:87, pinType: [PinType.IN, PinType.CLK] },  
            { pin:88, pinType: [PinType.IN, PinType.OE] },  
            { pin:89, pinType: [PinType.IN, PinType.CLR] },  
            { pin:90, pinType: [PinType.IN, PinType.CLR, PinType.OE] },  
            { pin:91, pinType: [PinType.VCC] },  
            { pin:92, pinType: [PinType.INOUT] },  
            { pin:93, pinType: [PinType.INOUT] },  
            { pin:94, pinType: [PinType.INOUT] },  
            { pin:95, pinType: [PinType.GND] },  
            { pin:96, pinType: [PinType.INOUT] },  
            { pin:97, pinType: [PinType.INOUT] },  
            { pin:98, pinType: [PinType.INOUT] },  
            { pin:99, pinType: [PinType.INOUT] },  
            { pin:100, pinType: [PinType.INOUT] }     
        ]
    },
    {
        name: 'f1504',
        deviceType: DevicePackageType.pqfp,
        pinCount: 100,
        pins:[
            { pin:1, pinType: [PinType.NC] },
            { pin:2, pinType: [PinType.NC] },
            { pin:3, pinType: [PinType.INOUT] },
            { pin:4, pinType: [PinType.INOUT] },
            { pin:5, pinType: [PinType.VCC] },
            { pin:6, pinType: [PinType.INOUT] },
            { pin:7, pinType: [PinType.NC] },
            { pin:8, pinType: [PinType.INOUT] },
            { pin:9, pinType: [PinType.NC] },
            { pin:10, pinType: [PinType.INOUT] },
            { pin:11, pinType: [PinType.INOUT] },
            { pin:12, pinType: [PinType.INOUT] },
            { pin:13, pinType: [PinType.GND] },
            { pin:14, pinType: [PinType.INOUT, PinType.PD] },
            { pin:15, pinType: [PinType.INOUT] },
            { pin:16, pinType: [PinType.INOUT] },
            { pin:17, pinType: [PinType.INOUT, PinType.TMS] },
            { pin:18, pinType: [PinType.INOUT] },
            { pin:19, pinType: [PinType.INOUT] },
            { pin:20, pinType: [PinType.VCC] },
            { pin:21, pinType: [PinType.INOUT] },
            { pin:22, pinType: [PinType.INOUT] },
            { pin:23, pinType: [PinType.INOUT] },
            { pin:24, pinType: [PinType.NC] },
            { pin:25, pinType: [PinType.INOUT] },
            { pin:26, pinType: [PinType.NC] },
            { pin:27, pinType: [PinType.INOUT] },
            { pin:28, pinType: [PinType.GND] },
            { pin:29, pinType: [PinType.NC] },
            { pin:30, pinType: [PinType.NC] },
            { pin:31, pinType: [PinType.INOUT] },
            { pin:32, pinType: [PinType.INOUT] },
            { pin:33, pinType: [PinType.INOUT] },
            { pin:34, pinType: [PinType.INOUT] },
            { pin:35, pinType: [PinType.INOUT] },
            { pin:36, pinType: [PinType.VCC] },
            { pin:37, pinType: [PinType.INOUT] },
            { pin:38, pinType: [PinType.INOUT] },
            { pin:39, pinType: [PinType.INOUT] },
            { pin:40, pinType: [PinType.GND] },
            { pin:41, pinType: [PinType.VCC] },
            { pin:42, pinType: [PinType.INOUT] },
            { pin:43, pinType: [PinType.INOUT] },
            { pin:44, pinType: [PinType.INOUT, PinType.PD] },
            { pin:45, pinType: [PinType.GND] },
            { pin:46, pinType: [PinType.INOUT] },
            { pin:47, pinType: [PinType.INOUT] },
            { pin:48, pinType: [PinType.INOUT] },
            { pin:49, pinType: [PinType.INOUT] },
            { pin:50, pinType: [PinType.INOUT] },
            { pin:51, pinType: [PinType.NC] },
            { pin:52, pinType: [PinType.NC] },
            { pin:53, pinType: [PinType.VCC] },
            { pin:54, pinType: [PinType.INOUT] },
            { pin:55, pinType: [PinType.NC] },
            { pin:56, pinType: [PinType.INOUT] },
            { pin:57, pinType: [PinType.NC] },
            { pin:58, pinType: [PinType.INOUT] },
            { pin:59, pinType: [PinType.INOUT] },
            { pin:60, pinType: [PinType.INOUT] },
            { pin:61, pinType: [PinType.GND] },
            { pin:62, pinType: [PinType.INOUT] },
            { pin:63, pinType: [PinType.INOUT] },
            { pin:64, pinType: [PinType.INOUT, PinType.TCK] },
            { pin:65, pinType: [PinType.INOUT] },
            { pin:66, pinType: [PinType.INOUT] },
            { pin:67, pinType: [PinType.INOUT] },
            { pin:68, pinType: [PinType.VCC] },
            { pin:69, pinType: [PinType.INOUT] },
            { pin:70, pinType: [PinType.INOUT] },
            { pin:71, pinType: [PinType.INOUT] },
            { pin:72, pinType: [PinType.NC] },
            { pin:73, pinType: [PinType.INOUT] }, 
            { pin:74, pinType: [PinType.NC] },
            { pin:75, pinType: [PinType.INOUT, PinType.TDO] },
            { pin:76, pinType: [PinType.GND] },
            { pin:77, pinType: [PinType.INOUT] },
            { pin:78, pinType: [PinType.INOUT] },
            { pin:79, pinType: [PinType.NC] },
            { pin:80, pinType: [PinType.NC] },
            { pin:81, pinType: [PinType.INOUT] },
            { pin:82, pinType: [PinType.INOUT] },
            { pin:83, pinType: [PinType.INOUT] },
            { pin:84, pinType: [PinType.VCC] },   
            { pin:85, pinType: [PinType.INOUT] },  
            { pin:86, pinType: [PinType.INOUT] },  
            { pin:87, pinType: [PinType.INOUT, PinType.CLK] },  
            { pin:88, pinType: [PinType.GND] },
            { pin:89, pinType: [PinType.IN, PinType.CLK] }, 
            { pin:90, pinType: [PinType.IN, PinType.OE] },  
            { pin:91, pinType: [PinType.IN, PinType.CLR] },  
            { pin:92, pinType: [PinType.IN, PinType.CLR, PinType.OE] },  
            { pin:93, pinType: [PinType.VCC] },  
            { pin:94, pinType: [PinType.INOUT] },  
            { pin:95, pinType: [PinType.INOUT] },  
            { pin:96, pinType: [PinType.INOUT] },  
            { pin:97, pinType: [PinType.GND] },  
            { pin:98, pinType: [PinType.INOUT] },  
            { pin:99, pinType: [PinType.INOUT] },  
            { pin:100, pinType: [PinType.INOUT] }
        ]
    },
    
    {
        name: 'f1508',
        deviceType: DevicePackageType.tqfp,
        pinCount: 100,
        pins:[
            { pin:1, pinType: [PinType.IN, PinType.PD] },
            { pin:2, pinType: [PinType.INOUT] },
            { pin:3, pinType: [PinType.VCC] },
            { pin:4, pinType: [PinType.IN, PinType.PD] },
            { pin:5, pinType: [PinType.INOUT] },
            { pin:6, pinType: [PinType.INOUT] },
            { pin:7, pinType: [PinType.INOUT] },
            { pin:8, pinType: [PinType.INOUT] },
            { pin:9, pinType: [PinType.INOUT] },
            { pin:10, pinType: [PinType.INOUT] },
            { pin:11, pinType: [PinType.GND] },
            { pin:12, pinType: [PinType.INOUT] },
            { pin:13, pinType: [PinType.INOUT] },
            { pin:14, pinType: [PinType.INOUT] },
            { pin:15, pinType: [PinType.INOUT, PinType.TMS] },
            { pin:16, pinType: [PinType.INOUT] },
            { pin:17, pinType: [PinType.INOUT] },
            { pin:18, pinType: [PinType.VCC] },
            { pin:19, pinType: [PinType.INOUT] },
            { pin:20, pinType: [PinType.INOUT] },
            { pin:21, pinType: [PinType.INOUT] },
            { pin:22, pinType: [PinType.INOUT] },
            { pin:23, pinType: [PinType.INOUT] },
            { pin:24, pinType: [PinType.INOUT] },
            { pin:25, pinType: [PinType.INOUT] },
            { pin:26, pinType: [PinType.GND] },
            { pin:27, pinType: [PinType.INOUT] },
            { pin:28, pinType: [PinType.INOUT] },
            { pin:29, pinType: [PinType.INOUT] },
            { pin:30, pinType: [PinType.INOUT] },
            { pin:31, pinType: [PinType.INOUT] },
            { pin:32, pinType: [PinType.INOUT] },
            { pin:33, pinType: [PinType.INOUT] },
            { pin:34, pinType: [PinType.VCC] },
            { pin:35, pinType: [PinType.INOUT] },
            { pin:36, pinType: [PinType.INOUT] },
            { pin:37, pinType: [PinType.INOUT] },
            { pin:38, pinType: [PinType.GND] },
            { pin:39, pinType: [PinType.VCC] },
            { pin:40, pinType: [PinType.INOUT] },
            { pin:41, pinType: [PinType.INOUT, PinType.PD] },
            { pin:42, pinType: [PinType.INOUT] },
            { pin:43, pinType: [PinType.GND] },
            { pin:44, pinType: [PinType.INOUT] },
            { pin:45, pinType: [PinType.INOUT] },
            { pin:46, pinType: [PinType.INOUT] },
            { pin:47, pinType: [PinType.INOUT] },
            { pin:48, pinType: [PinType.INOUT] },
            { pin:49, pinType: [PinType.INOUT] },
            { pin:50, pinType: [PinType.INOUT] },
            { pin:51, pinType: [PinType.VCC] },
            { pin:52, pinType: [PinType.INOUT] },
            { pin:53, pinType: [PinType.INOUT] },
            { pin:54, pinType: [PinType.INOUT] },
            { pin:55, pinType: [PinType.INOUT] },
            { pin:56, pinType: [PinType.INOUT] },
            { pin:57, pinType: [PinType.INOUT] },
            { pin:58, pinType: [PinType.INOUT] },
            { pin:59, pinType: [PinType.GND] },
            { pin:60, pinType: [PinType.INOUT] },
            { pin:61, pinType: [PinType.INOUT] },
            { pin:62, pinType: [PinType.INOUT, PinType.TCK] },
            { pin:63, pinType: [PinType.INOUT] },
            { pin:64, pinType: [PinType.INOUT] },
            { pin:65, pinType: [PinType.INOUT] },
            { pin:66, pinType: [PinType.VCC] },
            { pin:67, pinType: [PinType.INOUT] },
            { pin:68, pinType: [PinType.INOUT] },
            { pin:69, pinType: [PinType.INOUT] },
            { pin:70, pinType: [PinType.INOUT] },
            { pin:71, pinType: [PinType.INOUT] },
            { pin:72, pinType: [PinType.INOUT] },
            { pin:73, pinType: [PinType.INOUT, PinType.TDO] }, 
            { pin:74, pinType: [PinType.GND] },
            { pin:75, pinType: [PinType.INOUT] },
            { pin:76, pinType: [PinType.INOUT] },
            { pin:77, pinType: [PinType.INOUT] },
            { pin:78, pinType: [PinType.INOUT] },
            { pin:79, pinType: [PinType.INOUT] },
            { pin:80, pinType: [PinType.INOUT] },
            { pin:81, pinType: [PinType.INOUT] },
            { pin:82, pinType: [PinType.VCC] },
            { pin:83, pinType: [PinType.INOUT] },
            { pin:84, pinType: [PinType.INOUT] },   
            { pin:85, pinType: [PinType.INOUT, PinType.CLK] },  
            { pin:86, pinType: [PinType.GND] },  
            { pin:87, pinType: [PinType.IN, PinType.CLK] },  
            { pin:88, pinType: [PinType.IN, PinType.OE] },  
            { pin:89, pinType: [PinType.IN, PinType.CLR] },  
            { pin:90, pinType: [PinType.IN, PinType.CLR, PinType.OE] },  
            { pin:91, pinType: [PinType.VCC] },  
            { pin:92, pinType: [PinType.INOUT] },  
            { pin:93, pinType: [PinType.INOUT] },  
            { pin:94, pinType: [PinType.INOUT] },  
            { pin:95, pinType: [PinType.GND] },  
            { pin:96, pinType: [PinType.INOUT] },  
            { pin:97, pinType: [PinType.INOUT] },  
            { pin:98, pinType: [PinType.INOUT] },  
            { pin:99, pinType: [PinType.INOUT] },  
            { pin:100, pinType: [PinType.INOUT] },      
        ]
    },
    {
        name: 'f1508',
        deviceType: DevicePackageType.pqfp,
        pinCount: 100,
        pins:[
            { pin:1, pinType: [PinType.INOUT] },
            { pin:2, pinType: [PinType.INOUT] },
            { pin:3, pinType: [PinType.INOUT, PinType.PD] },
            { pin:4, pinType: [PinType.INOUT] },
            { pin:5, pinType: [PinType.VCC] },
            { pin:6, pinType: [PinType.INOUT, PinType.TDI] },
            { pin:7, pinType: [PinType.INOUT] },
            { pin:8, pinType: [PinType.INOUT] },
            { pin:9, pinType: [PinType.INOUT] },
            { pin:10, pinType: [PinType.INOUT] },
            { pin:11, pinType: [PinType.INOUT] },
            { pin:12, pinType: [PinType.INOUT] },
            { pin:13, pinType: [PinType.GND] },
            { pin:14, pinType: [PinType.INOUT] },
            { pin:15, pinType: [PinType.INOUT] },
            { pin:16, pinType: [PinType.INOUT] },
            { pin:17, pinType: [PinType.INOUT, PinType.TMS] },
            { pin:18, pinType: [PinType.INOUT] },
            { pin:19, pinType: [PinType.INOUT] },
            { pin:20, pinType: [PinType.VCC] },
            { pin:21, pinType: [PinType.INOUT] },
            { pin:22, pinType: [PinType.INOUT] },
            { pin:23, pinType: [PinType.INOUT] },
            { pin:24, pinType: [PinType.INOUT] },
            { pin:25, pinType: [PinType.INOUT] },
            { pin:26, pinType: [PinType.INOUT] },
            { pin:27, pinType: [PinType.INOUT] },
            { pin:28, pinType: [PinType.GND] },
            { pin:29, pinType: [PinType.INOUT] },
            { pin:30, pinType: [PinType.INOUT] },
            { pin:31, pinType: [PinType.INOUT] },
            { pin:32, pinType: [PinType.INOUT] },
            { pin:33, pinType: [PinType.INOUT] },
            { pin:34, pinType: [PinType.INOUT] },
            { pin:35, pinType: [PinType.INOUT] },
            { pin:36, pinType: [PinType.VCC] },
            { pin:37, pinType: [PinType.INOUT] },
            { pin:38, pinType: [PinType.INOUT] },
            { pin:39, pinType: [PinType.INOUT] },
            { pin:40, pinType: [PinType.GND] },
            { pin:41, pinType: [PinType.VCC] },
            { pin:42, pinType: [PinType.INOUT] },
            { pin:43, pinType: [PinType.INOUT, PinType.PD] },
            { pin:44, pinType: [PinType.INOUT] },
            { pin:45, pinType: [PinType.GND] },
            { pin:46, pinType: [PinType.INOUT] },
            { pin:47, pinType: [PinType.INOUT] },
            { pin:48, pinType: [PinType.INOUT] },
            { pin:49, pinType: [PinType.INOUT] },
            { pin:50, pinType: [PinType.INOUT] },
            { pin:51, pinType: [PinType.INOUT] },
            { pin:52, pinType: [PinType.INOUT] },
            { pin:53, pinType: [PinType.VCC] },
            { pin:54, pinType: [PinType.INOUT] },
            { pin:55, pinType: [PinType.INOUT] },
            { pin:56, pinType: [PinType.INOUT] },
            { pin:57, pinType: [PinType.INOUT] },
            { pin:58, pinType: [PinType.INOUT] },
            { pin:59, pinType: [PinType.INOUT] },
            { pin:60, pinType: [PinType.INOUT] },
            { pin:61, pinType: [PinType.GND] },
            { pin:62, pinType: [PinType.INOUT] },
            { pin:63, pinType: [PinType.INOUT] },
            { pin:64, pinType: [PinType.INOUT, PinType.TCK] },
            { pin:65, pinType: [PinType.INOUT] },
            { pin:66, pinType: [PinType.INOUT] },
            { pin:67, pinType: [PinType.INOUT] },
            { pin:68, pinType: [PinType.VCC] },
            { pin:69, pinType: [PinType.INOUT] },
            { pin:70, pinType: [PinType.INOUT] },
            { pin:71, pinType: [PinType.INOUT] },
            { pin:72, pinType: [PinType.INOUT] },
            { pin:73, pinType: [PinType.INOUT] }, 
            { pin:74, pinType: [PinType.INOUT] },
            { pin:75, pinType: [PinType.INOUT, PinType.TDO] },
            { pin:76, pinType: [PinType.GND] },
            { pin:77, pinType: [PinType.INOUT] },
            { pin:78, pinType: [PinType.INOUT] },
            { pin:79, pinType: [PinType.INOUT] },
            { pin:80, pinType: [PinType.INOUT] },
            { pin:81, pinType: [PinType.INOUT] },
            { pin:82, pinType: [PinType.INOUT] },
            { pin:83, pinType: [PinType.INOUT] },
            { pin:84, pinType: [PinType.VCC] },   
            { pin:85, pinType: [PinType.INOUT] },  
            { pin:86, pinType: [PinType.INOUT] },  
            { pin:87, pinType: [PinType.INOUT, PinType.CLK] },  
            { pin:88, pinType: [PinType.GND] },
            { pin:89, pinType: [PinType.IN, PinType.CLK] }, 
            { pin:90, pinType: [PinType.IN, PinType.OE] },  
            { pin:91, pinType: [PinType.IN, PinType.CLR] },  
            { pin:92, pinType: [PinType.IN, PinType.CLR, PinType.OE] },  
            { pin:93, pinType: [PinType.VCC] },  
            { pin:94, pinType: [PinType.INOUT] },  
            { pin:95, pinType: [PinType.INOUT] },  
            { pin:96, pinType: [PinType.INOUT] },  
            { pin:97, pinType: [PinType.GND] },  
            { pin:98, pinType: [PinType.INOUT] },  
            { pin:99, pinType: [PinType.INOUT] },  
            { pin:100, pinType: [PinType.INOUT] }
        ]
    }
];

function getDevicePins(name, pinCount, packageType){
    let pins;
    try{
        pins = pinConfigurations.find(d => d && d.name === name && d.pinCount === pinCount && d.deviceType === packageType );
    }
    catch(err){
        console.log(`Error searching device pinmap: ${err.message}`);
    }
    return pins;
} 

const PinNumberingScheme = {
    DownUp : 'DownUp',
    OddEven: 'OddEven',
}

window.addEventListener('resize', () => {
    console.log("RESIZE");
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
    icConfigurations = pinConfigurations;
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
    selectedPin;
    ctx;

    get isFirst(){
        return this.pinCatalogIndex === 0;
    }

    get isLast(){
        return this.pinCatalogIndex === this.icConfigurations.length - 1;
    }
    
   
    init() {
        
        document.getElementById("ic").onmousemove = function(event) {
            component.previewPin(event);
        }
        document.getElementById("ic").onmousedown = function(event) {
            component.selectPin(event);
        }

        this.ic = document.getElementById('ic');
        if(this.ic.getContext){
            this.ctx = this.ic.getContext('2d');
        }
        this.selectedPin = undefined;
        this.drawDevice();
    }

    previewPin(event){
        const testX = event.offsetX / devicePixelRatio * .94; //not sure why but have to offset after moving into vscode
        const testY = event.offsetY / devicePixelRatio * .94;

        // this.ctx.clearRect(10,this.chipBottom +  this.verticalPinHeight + 5,120,50);
        // this.ctx.fillText(`Curor: x=${testX.toFixed(1)} y=${testY.toFixed(1)}`,10,this.chipBottom + this.verticalPinHeight + 20,120);
        
        const pin = this.pins.find(p => p.x <= testX  && testX <= p.x + p.w && p.y <= testY  && testY <= p.y + p.h );
        if(this.selectedPin?.id === pin?.id){
            return;//nothing to do
        }
        
        if(this.selectedPin){
            this.drawPin(this.selectedPin,false);
        }

        let typeYCoord = this.chipBottom + this.verticalPinHeight + 20;
        if(!pin){
            this.selectedPin = undefined;
            this.ctx.clearRect(130,typeYCoord - 18,130,120);
            return;
        }
        
        this.selectedPin = pin;
        this.drawPin( this.selectedPin, true);
        
        if(this.selectedPin){
            this.ctx.fillStyle = '#999';
           
            this.ctx.fillText(`Selected Pin: ${this.selectedPin.id.toFixed(0)}`,130, typeYCoord,100);
            
            this.selectedPin.type.forEach(t => {
                this.ctx.fillText(`${t}`,130,typeYCoord+=18,100);
            })
        }
    }

    selectPin(event){
        const testX = event.offsetX / devicePixelRatio * .94; //not sure why but have to offset after moving into vscode
        const testY = event.offsetY / devicePixelRatio * .94;

        const pin = this.pins.find(p => p.x <= testX  && testX <= p.x + p.w && p.y <= testY  && testY <= p.y + p.h );
        
        if(pin){
            vscode.postMessage({
                type: 'selectPin',
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
        
        //draw IC
        this.ctx.fillStyle = '#ccc';
        if(this.pinConfiguration.deviceType === DevicePackageType.plcc){
            this.ctx.fillRect(this.chipLeft - .75*this.horizontalPinWidth,this.chipTop - .75*this.verticalPinHeight,this.chipWidth + 1.5*this.horizontalPinWidth ,this.chipHeight +  1.5*this.verticalPinHeight);
        } else{
            this.ctx.fillRect(this.chipLeft,this.chipTop,this.chipWidth,this.chipHeight);
        }
        this.ctx.strokeStyle = '#000';
        if(this.pinConfiguration.deviceType === DevicePackageType.plcc){
            this.ctx.strokeRect(this.chipLeft - .75*this.horizontalPinWidth,this.chipTop - .75*this.verticalPinHeight,this.chipWidth + 1.5*this.horizontalPinWidth ,this.chipHeight +  1.5*this.verticalPinHeight);
        }
        else{
            this.ctx.strokeRect(this.chipLeft,this.chipTop,this.chipWidth,this.chipHeight);
        }
        this.calculatePinPositions();
        this.drawPins();

        this.ctx.beginPath();
        this.ctx.fillStyle = '#999';
        this.ctx.arc(this.chipLeft + this.chipWidth/10, this.chipTop +  + this.chipWidth/10, this.chipWidth / 20, 0,2 * Math.PI);
        this.ctx.fill();
        
        this.ctx.strokeStyle = '#000';
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
        this.ctx.fillStyle = '#999';
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
        this.pinPerSide = this.pinConfiguration.deviceType === DevicePackageType.dip ?  this.pinConfiguration.pinCount / 2 : this.pinConfiguration.pinCount / 4;
        
        this.horizontalPinOffset = this.chipHeight / (2*this.pinConfiguration.pinCount + 1);
        this.horizontalPinHeight = ((this.chipHeight - 2*this.horizontalPinOffset) / this.pinPerSide) - this.horizontalPinOffset;
        this.verticalPinOffset = this.chipWidth / (2*this.pinConfiguration.pinCount + 1);
        this.verticalPinWidth = ((this.chipWidth - 2*this.verticalPinOffset) / this.pinPerSide) - this.verticalPinOffset;
    }
    
    calculatePinPositions() {
        
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
            this.drawPin(this.pins[idx], this.pins[idx].id === this.selectedPin?.id);
        }
    }

    drawPin(pin, selected = false){
        const fontSize = this.width < 300 ? 8 : this.width < 600 ? 9 : this.width < 900 ? 10 : this.width < 1200 ? 11 : 12 ;
        this.ctx.font = `${fontSize}px Arial`;
        /*  FILL  */
        let style = '#000';
        
        /*  STOKE  */
        switch(pin.type[0]){
            
            case PinType.GND:
                style = '#333';
            break;
            case PinType.VCC:
                style = '#F22';
            break;
            case PinType.IN:
                style = '#22A';
            break;
            case PinType.INOUT:
                style = '#0d9292';
            break;
            case PinType.OUT:
                style = '#2A2';
            break;
            case PinType.OE:
                style = '#C4BF36';
            break;
            case PinType.CLR:
                style = '#C70039';
            break;
            case PinType.CLK:
                style = '#D314F5';
            break;
            case PinType.PD:
                style = '#E815BF';
            break;
            case PinType.TCK:
                style = '#2f5511';
                break;
            case PinType.TDI:
                style = '#204107';
            break;
            case PinType.TDO:
                style = '#19641f';
            break;
            case PinType.TMS:
                style = '#3B8901';
            break;
            case PinType.NC:
                style = '#999';
            break;
        }
        this.ctx.fillStyle = selected ? '#a66' : style;
        this.ctx.strokeStyle = style;
        this.ctx.fillRect(pin.x, pin.y, pin.w, pin.h);
        this.ctx.strokeRect(pin.x,pin.y, pin.w, pin.h);
        
        this.ctx.fillStyle = '#fff';
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
    previousCofiguration(){
        this.pinCatalogIndex--;
        this.pinConfiguration = this.icConfigurations[this.pinCatalogIndex];
        this.drawDevice();
    }
    nextConfigurataion(){
        this.pinCatalogIndex++;
        this.pinConfiguration = this.icConfigurations[this.pinCatalogIndex];
        this.drawDevice();
    }

    setDevice(name, pinCount, packageType){
        const pins = getDevicePins(name, pinCount, packageType);
        if(pins){
            component.pinConfiguration = pins;
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
			case 'selectPin':
				// Update our webview's content
				component.selectedPin = component.pins.find(p => p.id === message.pin.pin);
                //component.drawPin(component.selectedPin, true);
                component.drawDevice();
				// Then persist state information.
				// This state is returned in the call to `vscode.getState` below when a webview is reloaded.
				vscode.setState({selectedPin: component.selectedPin});

				return;
            case 'setDevice':
                component.setDevice(message.device.name, message.device.pinCount, message.device.deviceType);
                vscode.setState({device: message.device.name, pinCount: message.device.pinCount, packageType: message.device.deviceType});
                break;

            case 'clearDevice':
                component.selectPin(undefined);
                component.pinConfiguration = undefined;
                component.drawDevice();
		}
	});

	// Webviews are normally torn down when not visible and re-created when they become visible again.
	// State lets us save information across these re-loads
	const state = vscode.getState();
	if (state) {
		component.setDevice(state.device, state.pinCount, state.packageType);
	}
}());



