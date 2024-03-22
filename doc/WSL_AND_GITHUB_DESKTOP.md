# Installing Windows Subsystem for Linux and Connecting WSL to GitHub Desktop

## URL Reference

The following instructions are based off the following resource:

- [https://learn.microsoft.com/en-us/windows/wsl/install](https://learn.microsoft.com/en-us/windows/wsl/install)

## Setting Up WSL with Visual Studio Code

1. Open Windows PowerShell or Windows Command Prompt in Administrator Mode<br>
   <img src="images\WSL_AND_GITHUB_DESKTOP\00_Windows_PowerShell_Admin.png" alt="Windows Powershell Search Containing Run as Adminastrator" style="width:40%; height:auto;">
   <img src="images\WSL_AND_GITHUB_DESKTOP\01_Command_Prompt_Admin.png" alt="Command Prompt Search Containing Run as Adminastrator" style="width:40%; height:auto;"><br>
   This is found by using the start button and searching for the above

2. In the Shell/Command Line, paste. By default, it should install Ubuntu:

```bash
wsl --install
```

Linux will ask you to create a new UNIX username and password. Use whatever username and password as you see fit but remember the credentials for using sudo privileges in Linux.<br>
**Note**: The following error if there was an issue setting up Ubuntu: “Failed to attach disk 'LocalState\\ext4.vhdx' to WSL2: The system cannot find the file specified.”<br>
To resolve this:

```bash
wsl --unregister ubuntu
wsl --install
```

**Note**: If WSL is already installed, to ensure that Ubuntu is installed, paste the following:

```bash
wsl – install -d Ubuntu
```

3. Restart your computer to allow WSL to setup.

4. Go to VSCode and install the following Extension: WSL

<img src="images\WSL_AND_GITHUB_DESKTOP\02_WSL_VSCode_Extension.png" alt="WSL Extensions Found in Extensions" style="width:50%; height:auto;"><br>

5. Once installation is completed, on the Bottom Left Corner of the VSCode window select the option to Open a Remote Window.<br>
   On the Center of the Top Screen, it will ask which remote windows to open.<br>
   Select “Connect to WSL to Distro” > “Ubuntu”.<br>
   <img src="images\WSL_AND_GITHUB_DESKTOP\03_Open_Remote_Window.png" alt="WSL Extensions Found in Extensions" style="width:20%; height:auto;"><br>
   <img src="images\WSL_AND_GITHUB_DESKTOP\04_Connect_to_WSL.png" alt="WSL Extensions Found in Extensions" style="width:100%; height:auto;"><br>
   <img src="images\WSL_AND_GITHUB_DESKTOP\05_Connect_to_Ubuntu.png" alt="WSL Extensions Found in Extensions" style="width:100%; height:auto;"><br>

6. Once the new Window is finished loading, check the Bottom Left Corner to confirm you are using WSL.<br>
   ALL OPERATIONS for the project is done faster through WSL. If you do not see “WSL:Ubuntu,” then that means that you are editing using Windows, which is hundreds of times slower than using WSL<br>
   <img src="images\WSL_AND_GITHUB_DESKTOP\06_Running_in_Ubuntu_WSL_2.png" alt="WSL Extensions Found in Extensions" style="width:40%; height:auto;">

7. Open the Explorer Tab (Found on the Left Taskbar) and click “Open Folder.”<br>
   Open Folder to just default “/home/UNIXUsername/”<br>
   <img src="images\WSL_AND_GITHUB_DESKTOP\07_Open_Folder.png" alt="WSL Extensions Found in Extensions" style="width:80%; height:auto;"><br>
   You are now in the home directory of your Linux Environment.

## Connecting WSL and GitHub Desktop

To be able to work using GitHub Desktop with WSL to have a better experience of pushing and pulling with the remote repository, it is best to just connect directly over.

1. Open GitHub Desktop

2. On the Top Taskbar, Select “File”>”Clone repository”<br>
   <img src="images\WSL_AND_GITHUB_DESKTOP\08_Clone_Repository.png" alt="WSL Extensions Found in Extensions" style="width:50%; height:auto;"><br>
   On the Pop Up Window “Clone a repository”, select URL<br>
   Fill in the following;<br>
   Repository URL: [https://github.com/POOSDSpring2024/LargeProject](https://github.com/POOSDSpring2024/LargeProject)<br>
   Local path: [\\\\wsl.localhost\\Ubuntu\\home\\UNIXUsername\\FolderName](about:blank)<br>
   (UNIXUsername is the Username that you made when you setup WSL)<br>
   (FolderName is your choice of folder to that will hold your Local Repo)
   <img src="images\WSL_AND_GITHUB_DESKTOP\09_Clone_Repository_by_URL.png" alt="WSL Extensions Found in Extensions" style="width:50%; height:auto;">

3. Once Cloned, the repo is now set up. You can access it through selecting “Open in Visual Studio Code”
   <img src="images\WSL_AND_GITHUB_DESKTOP\10_Repository_Central_Page.png" alt="WSL Extensions Found in Extensions" style="width:50%; height:auto;">

4. Once opened, you will notice that GitHub Desktop has open the Default Visual Studio Window, not WSL.<br>
   To fix this, there should be an option to “Reopen Folder in WSL”
   <img src="doc\images\WSL_AND_GITHUB_DESKTOP\11_Reopen_Folder_Pop_Up.png" alt="WSL Extensions Found in Extensions" style="width:50%; height:auto;"><br>
   Otherwise, on the Bottom Left Corner of the VSCode window select the option to Open a Remote Window.<br>
   On the Center of the Top Screen, it will ask which remote windows to open.<br>
   Select “Connect to WSL to Distro” > “Ubuntu”.<br>
   <img src="images\WSL_AND_GITHUB_DESKTOP\12_Alternative_Open_Remote_Window.png" alt="WSL Extensions Found in Extensions" style="width:20%; height:auto;"><br>
   <img src="images\WSL_AND_GITHUB_DESKTOP\13_Alternative_Connect_to_WSL.png" alt="WSL Extensions Found in Extensions" style="width:100%; height:auto;"><br>
   <img src="images\WSL_AND_GITHUB_DESKTOP\14_Alternative_Connect_to_Ubuntu.png" alt="WSL Extensions Found in Extensions" style="width:100%; height:auto;">

5. Open the Explorer Tab (Found on the Left Taskbar) and click “Open Folder.”<br>
   Open Folder to just default “/home/ UNIXUsername/FolderName”
   <img src="images\WSL_AND_GITHUB_DESKTOP\15_Open_LargeProject.png" alt="WSL Extensions Found in Extensions" style="width:100%; height:auto;"><br>
   You are now in your Local Repository.

- **Any actions you do in the Local Repository will be shown in GitHub Desktop & any changes you do in GitHub Desktop will shown in the Local Repository.**
- **Once you Push to Origin (So Data From GitHub Desktop Pushed to GitHub Website), GitHub Desktop (Local Repository) will Update GitHub Website (Remote Repository)**
- **Once you Fetch fetch from Origin (So Data From GitHub Website Fetched to GitHub Desktop), GitHub Website (Remote Repository) will Update GitHub Desktop (Local Repository)**
