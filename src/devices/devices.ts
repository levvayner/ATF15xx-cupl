export enum DeviceActionType{
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

export class deviceAction{
    
    constructor(
        public deviceName: string,
        public action: DeviceActionType,
        public jedFile: string | undefined,
    ){

    };
    toString(){
        return `1 4 1 0\n\n${this.deviceName}\n10\n${this.action}\n${this.jedFile}`;
    }

    public deviceActions =Object.keys(DeviceActionType).map(key => DeviceActionType[key as any]).filter(value => typeof value === 'string') as string[];
}