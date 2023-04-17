# atf15xx-cupl README

This is the README for your extension "atf15xx-cupl". After writing up a brief description, we recommend including the following sections.

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.
For example, if there is an image subfolder under your extension project workspace:


<picture>  
  <img alt="YOUR-ALT-TEXT" src="src/assets/preview.png">
</picture>

> ATF15xx Project veiwer with functionality to automate build, convert, and deploy tasks.

## Requirements
### Wine
```sudo apt update```

```sudo apt install wine64```

### Updated winetricks
```sudo winetricks --self-update```


### Wine must have MFC42.DLL installed
```./winetricks mfc40```

```./winetricks mfc42```

### Download and copy to wine windows folder
>Dwsbc32.ocx to ~/.wine/drive_c/windows/system32

### Prochip 5.0.1
Need to have Atmel ProChip (5.0.1) installed [Download ProChip 5.0.1](https://www.microchip.com/prochiplicensing/#/)
### ATMISP
  Need to have Atmel ATMISP (v7.3) [Download ATMISP](http://ww1.microchip.com/downloads/en/DeviceDoc/ATMISP7.zip)
  Need to have FTD2xx.dll file in ATMISP folder


## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `ATF15xx.WinePath`: Set wine binary path (e.g. /usr/bin/wine).
* `ATF15xx.OpenOCDPath`: Set OpenOCD binary path (e.g. /usr/bin/openocd).
* `ATF15xx.WinCPath`: Set Windows C:\ path (e.g. /home/user1/.wine/drive_c).
*  `ATF15xx.CuplBinPath`: Cupl executable path relative to WinePath 
  (e.g. Wincupl/Shared/ for c:\\Wincupl\\Shared\\cupl.exe)
* `ATF15xx.AtmIspBinPath`: ATMISP executable path (e.g. ATMEL_PLS_Tools/ATMISP/ATMISP.exe)
* `ATF15xx.WinTempPath"`: Temp path on C:\ drive (e.g. temp)


## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
