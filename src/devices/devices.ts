import { TextDecoder } from 'util';
import * as vscode from 'vscode';
import { atfOutputChannel } from '../os/command';
export enum AtmIspDeviceActionType{
    ProgramAndVerify = 1,
    Erase = 2,
    BlankCheck = 3,
    Verify = 4, //
    Load = 5, //
    Secure = 6,
    ProgramVerifySecure = 7, //
    VerifySecure = 8,
    ReadUES = 9

}
export enum AtmIspDeploymentCableType{
    ATDH1150USB = 0
}

export class AtmIspDeviceAction{
    
    constructor(
        public deviceName: string,
        public action: AtmIspDeviceActionType,
        public deploymentCableType : AtmIspDeploymentCableType,
        public jedFile: string | undefined,
    ){

    };
    toString(){
        return `1 4 1 ${this.deploymentCableType}\n\n${this.deviceName}\n10\n${this.action}\n${this.jedFile}`;
    }

    public atmIspDeviceActions =Object.keys(AtmIspDeviceActionType).map(key => AtmIspDeviceActionType[key as any]).filter(value => typeof value === 'string') as string[];
}

export enum DeviceManufacturer{
    'atmel' = 'atmel',
    'lettice' =  'lettice',
    'undefined' = 'undefined'
}
export enum DevicePackageType{
    'DIP' = 'DIP',
    'PLCC' = 'PLCC',
    'PQFP' = 'PQFP',
    'TQFP' = 'TQFP',
    'undefined' = 'undefined'
}

export enum DeviceDeploymentType{
    'undefined' = 'undefined',
    'ATMSIM' = 'ATMSIM',
    'miniPro' = 'miniPro'
}

export class DeviceConfiguration{
    manufacturer: DeviceManufacturer =  DeviceManufacturer.atmel;
    packageType: DevicePackageType = DevicePackageType.DIP;
    pinCount: number = 20;
    deviceCode: string = '';
    deviceName:string = ''; // ATF1504AS, ATF1504ASL, ATF1504ASV, ATF1504ASVL | ISP,programmer:
    programmer: string ='';
    deviceUniqueName: string = '';
}

//TODO: move out into config file
export const deviceList = [
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.DIP, pinCount: 24, deviceCode: "v750", deviceName: "ATF750C, ATF750CL, ATF750LVC, ATF750LVCL", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.DIP, pinCount: 24, deviceCode: "v750b", deviceName: " ATF750C, ATF750CL, ATF750LVC, ATF750LVCL", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.DIP, pinCount: 24, deviceCode: "v750c", deviceName: "ATF750C, ATF750CL, ATF750LVC, ATF750LVCL", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.DIP, pinCount: 24, deviceCode: "v750cppk", deviceName: " ATF750C, ATF750CL, ATF750LVC, ATF750LVCL | PPK", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.DIP, pinCount: 28, deviceCode: "v750cext", deviceName: " ATF750C, ATF750CL, ATF750LVC, ATF750LVCL | powerdown", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.DIP, pinCount: 24, deviceCode: "v750cextppk", deviceName: "ATF750C, ATF750LVC | powerdown, PPK", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.TQFP, pinCount: 28, deviceCode: "v750lcc", deviceName: "ATF750, ATF750L", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.TQFP, pinCount: 28, deviceCode: "v750blcc", deviceName: "ATV750B, ATV750BL", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.TQFP, pinCount: 28, deviceCode: "v750clcc", deviceName: "ATF750C, ATF750CL, ATF750VCL, ATF750LVC", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.TQFP, pinCount: 28, deviceCode: "v750cextlcc", deviceName: "ATF750C, ATF750LVC | powerdown", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.TQFP, pinCount: 28, deviceCode: "v750cextppklcc", deviceName: "ATF750C, ATF750LVC | powerdown, PPK", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.TQFP, pinCount: 28, deviceCode: "v750cextlcc", deviceName: "ATF750C, ATF750LVC | powerdown", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.TQFP, pinCount: 28, deviceCode: "v750cppklcc", deviceName: "ATF750C, ATF750LVC | PPK", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.PLCC, pinCount: 44, deviceCode: "f1500", deviceName: "ATF1500, ATF1500L", programmer: "atmsim" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.PLCC, pinCount: 44, deviceCode: "f1500t", deviceName: "f1500t", programmer: "atmsim" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.PLCC, pinCount: 44, deviceCode: "f1500a", deviceName: "ATF1500A, ATF1500ABV, ATF1500AL", programmer: "atmsim" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.PLCC, pinCount: 44, deviceCode: "f1500at", deviceName: "f1500at", programmer: "atmsim" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.PLCC, pinCount: 44, deviceCode: "f1502plcc44", deviceName: "ATF1502AS, ATF1502ASL, ATF1502ASV, ATF1502SE, ATF1502SEL", programmer: "atmsim" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.PLCC, pinCount: 44, deviceCode: "f1502ispplcc44", deviceName: "ATF1502AS, ATF1502ASL, ATF1502ASV, ATF1502SE, ATF1502SEL | ISP", programmer: "atmsim" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.TQFP, pinCount: 44, deviceCode: "f1502tqfp44", deviceName: "ATF1502AS, ATF1502ASL, ATF1502ASV, ATF1502SE, ATF1502SEL", programmer: "atmsim" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.TQFP, pinCount: 44, deviceCode: "f1502isptqfp44", deviceName: "ATF1502AS, ATF1502ASL, ATF1502ASV, ATF1502SE, ATF1502SEL | ISP", programmer: "atmsim" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.PLCC, pinCount: 44, deviceCode: "f1504plcc44", deviceName: "ATF1504AS, ATF1504ASL, ATF1504ASV, ATF1504ASVL", programmer: "atmsim" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.PLCC, pinCount: 44, deviceCode: "f1504ispplcc44", deviceName: "ATF1504AS, ATF1504ASL, ATF1504ASV, ATF1504ASVL | ISP", programmer: "atmsim" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.TQFP, pinCount: 44, deviceCode: "f1504tqfp44", deviceName: "ATF1504AS, ATF1504ASL, ATF1504ASV, ATF1504ASVL", programmer: "atmsim" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.TQFP, pinCount: 44, deviceCode: "f1504isptqfp44", deviceName: "ATF1504AS, ATF1504ASL, ATF1504ASV, ATF1504ASVL | ISP", programmer: "atmsim" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.PLCC, pinCount: 68, deviceCode: "f1504plcc68", deviceName: "ATF1504AS, ATF1504ASL, ATF1504ASV, ATF1504ASVL", programmer: "atmsim" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.PLCC, pinCount: 68, deviceCode: "f1504ispplcc68", deviceName: "ATF1504AS, ATF1504ASL, ATF1504ASV, ATF1504ASVL | ISP", programmer: "atmsim" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.PLCC, pinCount: 84, deviceCode: "f1504plcc84", deviceName: "ATF1504AS, ATF1504ASL, ATF1504ASV, ATF1504ASVL", programmer: "atmsim" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.PLCC, pinCount: 84, deviceCode: "f1504ispplcc84", deviceName: "ATF1504AS, ATF1504ASL, ATF1504ASV, ATF1504ASVL | ISP", programmer: "atmsim" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.PQFP, pinCount: 100, deviceCode: "f1504qfp100", deviceName: "ATF1504AS, ATF1504ASL, ATF1504ASV, ATF1504ASVL", programmer: "atmsim" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.TQFP, pinCount: 100, deviceCode: "f1504tqfp100", deviceName: "ATF1504AS, ATF1504ASL, ATF1504ASV, ATF1504ASVL", programmer: "atmsim" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.PQFP, pinCount: 100, deviceCode: "f1504ispqfp100", deviceName: "ATF1504AS, ATF1504ASL, ATF1504ASV, ATF1504ASVL | ISP", programmer: "atmsim" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.TQFP, pinCount: 100, deviceCode: "f1504isptqfp100", deviceName: "ATF1504AS, ATF1504ASL, ATF1504ASV, ATF1504ASVL | ISP", programmer: "atmsim" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.PLCC, pinCount: 84, deviceCode: "f1508plcc84", deviceName: "ATF1504AS, ATF1504ASL, ATF1504ASV, ATF1504ASVL", programmer: "atmsim" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.PLCC, pinCount: 84, deviceCode: "f1508ispplcc84", deviceName: "ATF1504AS, ATF1504ASL, ATF1504ASV, ATF1504ASVL | ISP", programmer: "atmsim" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.PQFP, pinCount: 100, deviceCode: "f1508qfp100", deviceName: "ATF1508AS, ATF1508ASL, ATF1508ASV, ATF1508ASVL", programmer: "atmsim" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.PQFP, pinCount: 100, deviceCode: "f1508ispqfp100", deviceName: "ATF1508AS, ATF1508ASL, ATF1508ASV, ATF1508ASVL | ISP", programmer: "atmsim" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.TQFP, pinCount: 100, deviceCode: "f1508tqfp100", deviceName: "ATF1508AS, ATF1508ASL, ATF1508ASV, ATF1508ASVL", programmer: "atmsim" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.TQFP, pinCount: 100, deviceCode: "f1508isptqfp100", deviceName: "ATF1508AS, ATF1508ASL, ATF1508ASV, ATF1508ASVL | ISP", programmer: "atmsim" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.PQFP, pinCount: 160, deviceCode: "f1508pqfp160", deviceName: "ATF1508AS, ATF1508ASL, ATF1508ASV, ATF1508ASVL", programmer: "atmsim" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.PQFP, pinCount: 160, deviceCode: "f1508isppqfp160", deviceName: "ATF1508AS, ATF1508ASL, ATF1508ASV, ATF1508ASVL | ISP", programmer: "atmsim" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.DIP, pinCount: 40, deviceCode: "v2500", deviceName: " ATF2500CL, ATF2500CQ, ATF2500CQL", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.DIP, pinCount: 40, deviceCode: "v2500b", deviceName: "v2500b", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.DIP, pinCount: 40, deviceCode: "v2500c", deviceName: "ATF2500C, ATF2500CL, ATF2500CQ, ATF2500CQL", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.DIP, pinCount: 40, deviceCode: "v2500cppk", deviceName: "ATF22LV10C, ATF22V10C | PPK", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.PLCC, pinCount: 44, deviceCode: "v2500lcc", deviceName: "ATF2500C, ATF2500CL, ATF2500CQ, ATF2500CQL", programmer: "atmsim" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.PLCC, pinCount: 44, deviceCode: "v2500blcc", deviceName: "v2500blcc", programmer: "atmsim" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.PLCC, pinCount: 44, deviceCode: "v2500clcc", deviceName: "ATF2500C, ATF2500CL, ATF2500CQ, ATF2500CQL", programmer: "atmsim" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.PLCC, pinCount: 44, deviceCode: "v2500cppklcc", deviceName: "ATF2500C, ATF2500CL, ATF2500CQ, ATF2500CQL | PPK", programmer: "atmsim" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.DIP, pinCount: 20, deviceCode: "g16v8", deviceName: "g16v8", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.DIP, pinCount: 24, deviceCode: "g16v8cp", deviceName: "ATF16LV8C, ATF16V8C, ATF16V8CZ | powerdown", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.DIP, pinCount: 20, deviceCode: "g16v8ma", deviceName: "g16v8ma", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.DIP, pinCount: 20, deviceCode: "g16v8ms", deviceName: "g16v8ms", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.DIP, pinCount: 20, deviceCode: "g16v8a", deviceName: "ATF16V8B, ATF16V8BQ, ATF16V8BQL, ATF16LV8C, ATF16V8C, ATF16V8CZ", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.DIP, pinCount: 20, deviceCode: "g16v8as", deviceName: "g16v8as", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.DIP, pinCount: 20, deviceCode: "g16v8s", deviceName: "g16v8s", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.DIP, pinCount: 24, deviceCode: "g20v8", deviceName: "g20v8", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.DIP, pinCount: 24, deviceCode: "g20v8ma", deviceName: "g20v8ma", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.DIP, pinCount: 24, deviceCode: "g20v8ms", deviceName: "g20v8ms", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.DIP, pinCount: 24, deviceCode: "g20v8a", deviceName: "ATF20V8B, ATF20V8BQ, ATF20V8BQL, ATF20V8C, ATF20V8CQ, ATF20V8CQZ", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.DIP, pinCount: 24, deviceCode: "g20v8as", deviceName: "g20v8as", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.DIP, pinCount: 24, deviceCode: "g20v8c", deviceName: "g20v8c", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.DIP, pinCount: 24, deviceCode: "g20v8cs", deviceName: "g20v8cs", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.DIP, pinCount: 24, deviceCode: "g20v8cma", deviceName: "g20v8cma", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.DIP, pinCount: 24, deviceCode: "g20v8cms", deviceName: "g20v8cms", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.DIP, pinCount: 24, deviceCode: "g20v8cp", deviceName: "g20v8cp", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.DIP, pinCount: 24, deviceCode: "g20v8cps", deviceName: "g20v8cps", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.DIP, pinCount: 24, deviceCode: "g20v8cpma", deviceName: "g20v8cpma", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.DIP, pinCount: 24, deviceCode: "g20v8cpms", deviceName: "g20v8cpms", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.DIP, pinCount: 24, deviceCode: "g22v10", deviceName: "ATF22V10B, ATF22V10BQ, ATF22V10BQL, ATF22LV10C, ATF22LV10CQZ, ATF22V10C, ATF22V10CQ, ATF22V10CQZ, ATF22V10CZ", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.PLCC, pinCount: 28, deviceCode: "g20v8lcc", deviceName: "g20v8lcc", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.PLCC, pinCount: 28, deviceCode: "g20v8alcc", deviceName: "g20v8alcc", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.PLCC, pinCount: 28, deviceCode: "g20v8aslcc", deviceName: "g20v8aslcc", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.PLCC, pinCount: 28, deviceCode: "g20v8malcc", deviceName: "g20v8malcc", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.PLCC, pinCount: 28, deviceCode: "g20v8mslcc", deviceName: "g20v8mslcc", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.PLCC, pinCount: 28, deviceCode: "g20v8slcc", deviceName: "g20v8slcc", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.PLCC, pinCount: 28, deviceCode: "g20v8clcc", deviceName: "g20v8clcc", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.PLCC, pinCount: 28, deviceCode: "g20v8cslcc", deviceName: "g20v8cslcc", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.PLCC, pinCount: 28, deviceCode: "g20v8cmalcc", deviceName: "g20v8cmalcc", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.PLCC, pinCount: 28, deviceCode: "g20v8cmslcc", deviceName: "g20v8cmslcc", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.PLCC, pinCount: 28, deviceCode: "g20v8cplcc", deviceName: "g20v8cplcc", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.PLCC, pinCount: 24, deviceCode: "g20v8cpslcc", deviceName: "g20v8cpslcc", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.PLCC, pinCount: 24, deviceCode: "g20v8cpmalcc", deviceName: "g20v8cpmalcc", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.PLCC, pinCount: 24, deviceCode: "g20v8cpmslcc", deviceName: "g20v8cpmslcc", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.lettice, packageType: DevicePackageType.PLCC, pinCount: 24, deviceCode: "g22v10lcc", deviceName: "g22v10lcc", programmer: "minipro" },
    { manufacturer: DeviceManufacturer.atmel, packageType: DevicePackageType.DIP, pinCount: 24, deviceCode: "g22v10cp", deviceName: "ATF22LV10C, ATF22V10C | powerdown", programmer: "minipro" }
    
] as DeviceConfiguration[];
// export class devices{
//     public deviceList: deviceConfiguration[] = [];
//     constructor(){
//        this.deviceList = deviceList;
//     }
//     // public async init(deviceFilePath: string){      
        
//     //     if(deviceList === undefined || deviceList.length === 0){
//     //         atfOutputChannel.appendLine('Failed to find devices in configuration');
//     //     }

//     // }
// }

