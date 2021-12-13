' MIT License

' Copyright (c) 2018 Pishangkumar Ujeniya

' Permission is hereby granted, free of charge, to any person obtaining a copy
' of this software and associated documentation files (the "Software"), to deal
' in the Software without restriction, including without limitation the rights
' to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
' copies of the Software, and to permit persons to whom the Software is
' furnished to do so, subject to the following conditions:

' The above copyright notice and this permission notice shall be included in all
' copies or substantial portions of the Software.

' THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
' IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
' FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
' AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
' LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
' OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
' SOFTWARE.
' Option Explicit

Dim instagramHelperChromeDirectoryPath
Dim shortcutDestinationDirectoryPath
Dim specialArguments
Dim objShortcut
Dim objShell
Set objShell = CreateObject("WScript.Shell")

Const shortCutFileName = "InstagramHelperChrome"
Const chromeInstalledPath = "C:\Program Files\Google\Chrome\Application\chrome.exe" '// Path to the Chrome.exe file installed in your Windows System.

objShell.Popup("Select the temporary directory for Instagram Helper files.")
instagramHelperChromeDirectoryPath = BrowseFolder("",False)

objShell.Popup("Select the directory where you want to create the Instagram Helper shortcut.")
shortcutDestinationDirectoryPath = BrowseFolder("",False)

specialArguments = "--disable-web-security --disable-gpu --user-data-dir=""" & instagramHelperChromeDirectoryPath & """"

' shortcutDestinationDirectoryPath = objShell.SpecialFolders ("Desktop")
Set objShortcut = objShell.CreateShortcut (shortcutDestinationDirectoryPath & "\" & shortCutFileName & ".lnk")
objShortcut.TargetPath = chromeInstalledPath
objShortcut.WorkingDirectory = strWorkDir
objShortcut.Description = shortCutFileName
objShortcut.Arguments = specialArguments
objShortcut.Save

objShell.Popup("See " & shortcutDestinationDirectoryPath & ", a new shortcut " & shortCutFileName & " is created")

WScript.Quit


Function BrowseFolder( myStartLocation, blnSimpleDialog )
' This function generates a Browse Folder dialog
' and returns the selected folder as a string.
'
' Arguments:
' myStartLocation   [string]  start folder for dialog, or "My Computer", or
'                             empty string to open in "Desktop\My Documents"
' blnSimpleDialog   [boolean] if False, an additional text field will be
'                             displayed where the folder can be selected
'                             by typing the fully qualified path
'
' Returns:          [string]  the fully qualified path to the selected folder
'
' Based on the Hey Scripting Guys article
' "How Can I Show Users a Dialog Box That Only Lets Them Select Folders?"
' http://www.microsoft.com/technet/scriptcenter/resources/qanda/jun05/hey0617.mspx
'
' Function written by Rob van der Woude
' http://www.robvanderwoude.com
	Const MY_COMPUTER   = &H11&
	Const WINDOW_HANDLE = 0 ' Must ALWAYS be 0
	
	Dim numOptions, objFolder, objFolderItem
	Dim objPath, objShell, strPath, strPrompt
	
' Set the options for the dialog window
	strPrompt = "Select InstagramHelperTemp Folder :"
	If blnSimpleDialog = True Then
		numOptions = 0      ' Simple dialog
	Else
		numOptions = &H10&  ' Additional text field to type folder path
	End If
	
' Create a Windows Shell object
	Set objShell = CreateObject( "Shell.Application" )
	
' If specified, convert "My Computer" to a valid
' path for the Windows Shell's BrowseFolder method
'   If UCase( myStartLocation ) = "MY COMPUTER" Then
	Set objFolder = objShell.Namespace( myStartLocation )
	Set objFolderItem = objFolder.Self
	strPath = objFolderItem.Path
'    Else
'        strPath = myStartLocation
'    End If
	
	Set objFolder = objShell.BrowseForFolder( WINDOW_HANDLE, strPrompt, _
	numOptions, strPath )
	
' Quit if no folder was selected
	If objFolder Is Nothing Then
'        BrowseFolder = "NO DESTINATION PATH SELECTED"
		Exit Function
	End If
	
' Retrieve the path of the selected folder
	Set objFolderItem = objFolder.Self
	objPath = objFolderItem.Path
	
' Return the path of the selected folder
	BrowseFolder = objPath
End Function
