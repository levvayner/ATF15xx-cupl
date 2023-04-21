# VS-Cupl README
## Features

-![Preview](assets/images/preview.png)
> VS Project veiwer with functionality to automate build, convert, and deploy tasks.
---

Extension to work with `Cupl` (.PLD_ files)

Supports deployment paths to TL886+ for DIP and other 24 and 28 pin CPLDs and homebrew programmer for QFP chips.

** SO FAR, ONLY TESTED ON ATF1504AS, ATF1504ASLV and g20v10

**Read more about [Cupl syntax](assets/docs/CUPL.md)**

- Allows to create a project

![Preview](assets/images/vs-cupl-create-project.gif)
- Edit ``PLD`` file
- Compile ``PLD`` to ``jed`` format

![Preview](assets/images/vs-cupl-compile.gif)
- Call ATMISP to convert ``jed`` to ``svf`` format
- Program ``svf`` file to an ISP homebrew ATF1500 family chip programmer

![Preview](assets/images/vs-cupl-deploy-openocd.gif)
---
## Workspace folders

Use VS Code workspace feature to keep your projects organized.
Structure should be

 - ```/workspace``` folder - when creating a project, use this folder as your root folder.

- ```/workspace/PROJECT1``` - creating a project named PROJECT1 would create the folder

- ```/workspace/PROJECT1\PROJECT1.pld``` - creating a project named PROJECT1 would create the default cupl file

> For multiple projects, the same root folder wiil have several project folders

- ```/workspace``` 

- ```/workspace/PROJECT1```

- ```/workspace/PROJECT1\PROJECT1.pld``` 

- ```/workspace/PROJECT2```

- ```/workspace/PROJECT2\PROJECT2.pld```


Save your Code Workspace file to the workspace folder.
This folder can represent one product that has seceral chips or projects.
- ```/workspace/my-widget-project.code-workspace``` 

---

## Requirements
### **Wine**
```sudo apt update```

```sudo apt install wine64```

#### Updated winetricks
```sudo winetricks --self-update```


#### Wine must have MFC42.DLL installed
```./winetricks mfc40```

```./winetricks mfc42```

### Download and copy to wine windows folder
>[Dwsbc32.ocx](assets/bin/Dwsbc32.ocx) to ~/.wine/drive_c/windows/system32

>[ftd2xx.dll](assets/bin/ftd2xx.dll) to ~/.wine/drive_c/windows/syswow64

### **Prochip 5.0.1**
Need to have Atmel ProChip (5.0.1) installed [Download ProChip 5.0.1](https://www.microchip.com/prochiplicensing/#/)
### **ATMISP**
  Need to have Atmel ATMISP (v7.3) [Download ATMISP](http://ww1.microchip.com/downloads/en/DeviceDoc/ATMISP7.zip)
  Need to have FTD2xx.dll file in ATMISP folder

### **Minipro**
  Used for programming jed files using TL866II programmer
```shell
sudo apt-get install build-essential pkg-config git libusb-1.0-0-dev fakeroot debhelper dpkg-dev

git clone https://gitlab.com/DavidGriffith/minipro.git

cd minipro

fakeroot dpkg-buildpackage -b -us -uc

sudo dpkg -i ../minipro_0.4-1_amd64.deb
```
---
## Extension Settings

This extension contributes the following settings:

*Can be configured in File > Preferences > Settings `` |`` Extensions > VS Cupl*

* `VS.WinePath`: Set wine binary path (default: /usr/bin/wine).
* `VS.OpenOCDPath`: Set OpenOCD binary path (default: /usr/bin/openocd).
* `VS.MiniproPath`: Set minipro binary path (default: /usr/bin/minipro).
* `VS.WinCPath`: Set Windows C:\ path (default: /home/user1/.wine/drive_c).
*  `VS.CuplBinPath`: Cupl executable path relative to WinePath 
  (default: Wincupl/Shared/ for c:\\Wincupl\\Shared\\cupl.exe)
* `VS.AtmIspBinPath`: ATMISP executable path (default: ATMEL_PLS_Tools/ATMISP/ATMISP.exe)
* `VS.WinTempPath"`: Temp path on C:\ drive (default: temp)

---
## Known Issues

HAS NOT BEEN TESTED ON WINDOWS

---
## Release Notes

Initial version. Supports full basic process from creating a project to deploying SVF file.
ATMISP is a manual process. User must select "Write SVF file"
![](assets/images/atmisp-svf.png)
### 0.0.5
> Adding support for minipro and GAL22V10/ATF22V10 chips

> Refactor project file naming and parsing

> Refactor Tree View (soltion folder => projects folder => project files)


### 0.0.2

Initial release of VS-Cupl
> Support for ATF1504AS chip only!

---

# For developers

## Requirements
You may need to install resolve-cwd npm package

``npm install resolve-cwd``
## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)


## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

