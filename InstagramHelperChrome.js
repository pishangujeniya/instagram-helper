/*
MIT License

Copyright (c) 2018 Pishangkumar Ujeniya

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

//#region Special Chrome Shortcut Creation
Shell = new ActiveXObject("WScript.Shell");


var systemDriveLetter = "C"; // Change this letter to your Windows System Drive Letter.
var folderName = "InstagramHelperTemp"; // Change this letter to your folder name which you created in root path of your Windows System drive.
var chromeInstalledPath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"; // Path to the Chrome.exe file installed in your Windows System.
var instagramHelperChromeDirectoryPath = systemDriveLetter + ":\\" + folderName;
var shortCutFileName = "InstagramHelperChrome.lnk";


var tempDirectoryPath = Shell.ExpandEnvironmentStrings("%TEMP%");
instagramHelperChromeDirectoryPath = tempDirectoryPath + "\\" + folderName;
var specialArguments = "--disable-web-security --disable-gpu --user-data-dir=\"" + instagramHelperChromeDirectoryPath + "\"";
DesktopPath = Shell.SpecialFolders("Desktop");
link = Shell.CreateShortcut(DesktopPath + "\\" + shortCutFileName);
link.Arguments = specialArguments;
link.Description = "Instagram Helper Chrome";
link.TargetPath = chromeInstalledPath
link.Save();
//#endregion Special Chrome Shortcut Creation

Shell.Popup("See Desktop, a new shortcut " + shortCutFileName + " is created");
