# Linux_command_simulator
========================================================================
       LINUX COMMAND SIMULATOR (WEB-BASED TERMINAL EMULATOR)
========================================================================

1. OVERVIEW
-----------
An interactive, browser-based Linux terminal emulator built with vanilla 
HTML, CSS, and JavaScript. This project simulates essential Linux shell 
commands and features an in-memory Virtual File System (VFS), providing 
an authentic command-line environment directly in the browser without 
executing commands on the host operating system.


2. KEY FEATURES
---------------
* Virtual File System (VFS): Full hierarchical directory structure 
  (/, /home/user) with dynamic creation and traversal.
* Essential Linux Commands:
  - pwd   : Print working directory path.
  - ls    : List directory contents (color-coded for files vs. directories).
  - cd    : Navigate through directories (supports relative paths, .., /, and ~).
  - mkdir : Create new directories.
  - touch : Create new empty files.
  - cat   : Read and display file contents.
  - echo  : Print text to the terminal output.
  - clear : Clear the terminal screen buffer.
  - help  : Display available commands and usage guide.
* Command History Navigation: Use UP and DOWN arrow keys to cycle 
  through previously executed commands.
* Realistic Terminal UI: Dark mode theme, monospace typography, distinct 
  prompt formatting, and status-based color outputs.


3. FILE STRUCTURE
-----------------
.
|-- index.html   # HTML5 markup defining terminal container & input line
|-- style.css    # Responsive terminal styling, dark theme & color classes
|-- script.js    # Command parsing engine & Virtual File System (VFS) logic
`-- README.txt   # Project documentation


4. GETTING STARTED
------------------
Prerequisites:
  - No external libraries, node packages, or web servers required.

Local Setup:
  1. Clone or download the project files into a single folder.
  2. Open index.html in any modern web browser (Chrome, Firefox, Edge, Safari).


5. USAGE EXAMPLES
-----------------
user@web-terminal:~$ pwd
/home/user

user@web-terminal:~$ ls
documents/
notes.txt

user@web-terminal:~$ mkdir projects
user@web-terminal:~$ cd projects
user@web-terminal:~/projects$ pwd
/home/user/projects

user@web-terminal:~/projects$ touch main.cpp
user@web-terminal:~/projects$ cd ..
user@web-terminal:~$ cat notes.txt
Welcome to the Web-Based Linux Terminal Emulator!


6. TECHNICAL ARCHITECTURE
-------------------------
1. Input Processing: Event listeners on the input element intercept 
   keydown events. Enter key presses trigger command tokenization.
2. Command Tokenizer: Raw input string is parsed into primary command 
   and argument arrays.
3. In-Memory VFS: Nested JavaScript objects represent root '/' and subfolders, 
   dynamically resolving tree nodes upon traversal (cd) or creation (mkdir/touch).


7. LICENSE
----------
This project is open-source and available under the MIT License.
========================================================================
