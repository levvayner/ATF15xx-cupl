import * as vscode from "vscode";
import {
    deviceList,
    DeviceManufacturer,
    DevicePackageType,
} from "./devices/devices";

export async function uiIntentDeployQuestion() {
    var selectedProjectOption = await vscode.window.showQuickPick(
        ["No", "Yes"],
        {
            canPickMany: false,
            title: "Execute Deployment",
        }
    );

    if (!selectedProjectOption || selectedProjectOption?.length === 0) {
        vscode.window.showErrorMessage(
            "Must select option if to deploy or not"
        );
        return;
    }
    return selectedProjectOption === "Yes";
}

export async function uiIntentSelectManufacturer() {
    var selectedOption = await vscode.window.showQuickPick(
        Object.values(DeviceManufacturer).filter(
            (v) => typeof v !== "number"
        ) as [],
        {
            canPickMany: false,
            title: "Device Manufacturer",
        }
    );
    const mfg = selectedOption as DeviceManufacturer;
    return mfg;
}

export async function uiIntentSelectPackageType(
    manufacturer: DeviceManufacturer
) {
    var pckType =
        manufacturer === DeviceManufacturer.any
            ? (Object.values(DevicePackageType) as [])
            : (Object.values(DevicePackageType) as []).filter(
                  (pck) =>
                      deviceList.filter(
                          (dli) => dli.manufacturer === manufacturer
                      ).length > 0
              );
    var selectedOption = await vscode.window.showQuickPick(pckType, {
        canPickMany: false,
        title: "Device Package Type",
    });
    const packageType = selectedOption as DevicePackageType;
    return packageType;
}

export async function uiIntentSelectPinCount(
    manufacturer: DeviceManufacturer,
    packageType: DevicePackageType
) {
    const pinCounts = [
        ...new Set(
            deviceList
                .filter(
                    (dli) =>
                        (manufacturer === DeviceManufacturer.any ||
                            dli.manufacturer === manufacturer) &&
                        (packageType === DevicePackageType.any ||
                            dli.packageType === packageType)
                )
                .map((dl) => dl.pinCount.toFixed(0))
        ),
    ];
    var selectedOption = await vscode.window.showQuickPick(
        pinCounts.sort((a, b) => (parseInt(a, 0) < parseInt(b, 0) ? -1 : 1)),
        {
            canPickMany: false,
            title: "Device Pin Count",
        }
    );

    return selectedOption;
}

export async function uiIntentSelectDevice(
    manufacturer: DeviceManufacturer,
    packageType: DevicePackageType,
    pinCount: string
) {
    const mfgDefined = manufacturer !== DeviceManufacturer.any;
    const pckTypeDefined = packageType !== DevicePackageType.any;
    const pinCountDefined = pinCount !== "0";
    const filteredSet = [
        ...new Set(
            deviceList
                .filter(
                    (d) =>
                        (!mfgDefined || d.manufacturer === manufacturer) &&
                        (!pckTypeDefined || d.packageType === packageType) &&
                        (!pinCountDefined || d.pinCount.toFixed(0) === pinCount)
                )
                .sort((a, b) => (a < b ? -1 : 1))
        ),
    ];
    const noSeperator = mfgDefined && pckTypeDefined && pinCountDefined;
    const deviceName = filteredSet.map(
        (dl) =>
            `${dl.deviceName}${noSeperator ? "" : " || "}${
                mfgDefined ? "" : "| Mfg: " + dl.manufacturer.toString()
            }${
                pckTypeDefined ? "" : "| Package: " + dl.packageType.toString()
            }${pinCountDefined ? "" : "Pins: " + dl.pinCount.toFixed(0)}`
    );
    var selectedProjectOption = await vscode.window.showQuickPick(deviceName, {
        canPickMany: false,
        title: "Device",
    });

    const device = filteredSet.find(
        (d) =>
            d.deviceName ===
            (noSeperator
                ? selectedProjectOption
                : selectedProjectOption?.substring(
                      0,
                      selectedProjectOption?.indexOf(" || ")
                  ))
    );
    if (!device) {
        // atfOutputChannel.appendLine('Cannot create prj file. No device specified!');
        return;
    }
    //need to get friendly name
    let deviceFeature = "";
    if (device?.deviceName?.indexOf("|") > 0) {
        deviceFeature = device.deviceName
            .substring(device.deviceName.indexOf("|") + 1)
            .trim();
        device.deviceName = device.deviceName.substring(
            0,
            device.deviceName.indexOf("|")
        );
    }
    const hasMultipleValues = device.deviceName?.indexOf(",") ?? 0 > 0;
    let deviceNames = hasMultipleValues
        ? device?.deviceName?.split(",")
        : [device?.deviceName?.trim()];

    if (!deviceNames || deviceNames.length === 0 || !deviceNames[0]) {
        // atfOutputChannel.appendLine('Cannot create prj file. Unknown device!');
        return;
    }
    if (deviceNames?.length > 1) {
        const devName = await uiIntentSelectTextFromArray(
            deviceNames.map((d) => d + " " + deviceFeature) as string[]
        );
        if (devName.trim().includes(" ")) {
            device.deviceUniqueName = devName.trim().split(" ")[0];
        } else {
            device.deviceUniqueName = devName;
        }
    } else {
        device.deviceUniqueName = deviceNames[0];
    }
    return device;
}

export async function uiIntentSelectTextFromArray(
    selections: string[],
    title: string | undefined = undefined
): Promise<string> {
    var selectedOption = await vscode.window.showQuickPick(
        selections.map((s) => s.trim()),
        {
            canPickMany: false,
            title: title,
        }
    );

    return selectedOption ?? "";
}

export async function uiEnterProjectName(): Promise<string> {
    var selectProjectName = await vscode.window.showInputBox({
        title: "Specify Project Name",
    });
    return selectProjectName ?? "";
}

export async function getDeviceConfiguration() {
    const mfg = await uiIntentSelectManufacturer();
    if (mfg === undefined || mfg?.length === 0) {
        vscode.window.showErrorMessage("Must select manufacturer");
        return;
    }

    const pkg = await uiIntentSelectPackageType(mfg);
    if (pkg === undefined || pkg?.length === 0) {
        vscode.window.showErrorMessage("Must select package type");
        return;
    }

    const pinCount = await uiIntentSelectPinCount(mfg, pkg);
    if (pinCount === undefined || pinCount?.length === 0) {
        vscode.window.showErrorMessage("Must select pin count");
        return;
    }

    const device = await uiIntentSelectDevice(mfg, pkg, pinCount);
    if (device === undefined) {
        vscode.window.showErrorMessage("Must select device");
        return;
    }
    return device;
}
