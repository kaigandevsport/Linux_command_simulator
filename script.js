// --- Virtual File System (VFS) Setup ---
const fileSystem = {
    "/": {
        type: "dir",
        children: {
            "home": {
                type: "dir",
                children: {
                    "user": {
                        type: "dir",
                        children: {
                            "documents": {
                                type: "dir",
                                children: {
                                    "project_info.txt": { type: "file", content: "Linux Command Simulator Web Project\nTRL Level: 4" }
                                }
                            },
                            "notes.txt": { type: "file", content: "Welcome to the Web-Based Linux Terminal Emulator!" }
                        }
                    }
                }
            }
        }
    }
};

let currentPath = ["home", "user"]; // Default path: /home/user
let commandHistory = [];
let historyIndex = -1;

const inputField = document.getElementById('cmd-input');
const outputContainer = document.getElementById('terminal-output');
const promptLabel = document.getElementById('prompt-label');

// Resolve current directory object from currentPath array
function getCurrentDir() {
    let current = fileSystem["/"];
    for (let dir of currentPath) {
        current = current.children[dir];
    }
    return current;
}

// Update terminal prompt string
function updatePrompt() {
    let displayPath = "";
    if (currentPath.join("/") === "home/user") {
        displayPath = "~";
    } else if (currentPath.length === 0) {
        displayPath = "/";
    } else {
        displayPath = "/" + currentPath.join("/");
    }
    promptLabel.innerHTML = `user@web-terminal:<span class="path">${displayPath}</span>$`;
}

// Input Key Listeners
inputField.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const commandText = this.value.trim();
        const currentPromptText = promptLabel.innerText;
        
        appendLine(`${currentPromptText} ${commandText}`, 'system');

        if (commandText !== '') {
            commandHistory.push(commandText);
            historyIndex = commandHistory.length;
            processCommand(commandText);
        }

        this.value = '';
        scrollToBottom();
    } 
    else if (e.key === 'ArrowUp') {
        if (historyIndex > 0) {
            historyIndex--;
            this.value = commandHistory[historyIndex];
        }
        e.preventDefault();
    } 
    else if (e.key === 'ArrowDown') {
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            this.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            this.value = '';
        }
        e.preventDefault();
    }
});

function appendLine(text, className = '') {
    const line = document.createElement('div');
    line.className = `output-line ${className}`;
    line.textContent = text;
    outputContainer.appendChild(line);
}

// --- Command Execution Engine ---
function processCommand(cmdLine) {
    const parts = cmdLine.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    const currentDir = getCurrentDir();

    switch (command) {
        case 'help':
            appendLine("Available Commands:", "success");
            appendLine("  pwd             - Print current working directory");
            appendLine("  ls              - List directory contents");
            appendLine("  cd [dir]        - Change directory ('..' for parent)");
            appendLine("  mkdir [name]    - Create new directory");
            appendLine("  touch [name]    - Create new empty file");
            appendLine("  cat [file]      - Display contents of a file");
            appendLine("  echo [text]     - Output text string");
            appendLine("  clear           - Clear terminal screen");
            break;

        case 'pwd':
            appendLine("/" + currentPath.join("/"));
            break;

        case 'ls':
            const items = Object.keys(currentDir.children);
            if (items.length === 0) {
                appendLine("(empty directory)", "system");
            } else {
                items.forEach(item => {
                    const isDir = currentDir.children[item].type === 'dir';
                    appendLine(item + (isDir ? '/' : ''), isDir ? 'directory' : 'file');
                });
            }
            break;

        case 'cd':
            if (!args[0] || args[0] === '~') {
                currentPath = ["home", "user"];
            } else if (args[0] === '..') {
                if (currentPath.length > 0) {
                    currentPath.pop();
                }
            } else if (args[0] === '/') {
                currentPath = [];
            } else {
                const target = args[0];
                if (currentDir.children[target]) {
                    if (currentDir.children[target].type === 'dir') {
                        currentPath.push(target);
                    } else {
                        appendLine(`cd: not a directory: ${target}`, 'error');
                    }
                } else {
                    appendLine(`cd: no such file or directory: ${target}`, 'error');
                }
            }
            updatePrompt();
            break;

        case 'mkdir':
            if (!args[0]) {
                appendLine("mkdir: missing operand", "error");
            } else if (currentDir.children[args[0]]) {
                appendLine(`mkdir: cannot create directory '${args[0]}': File exists`, "error");
            } else {
                currentDir.children[args[0]] = { type: "dir", children: {} };
                appendLine(`Directory created: ${args[0]}`, "success");
            }
            break;

        case 'touch':
            if (!args[0]) {
                appendLine("touch: missing file operand", "error");
            } else {
                if (!currentDir.children[args[0]]) {
                    currentDir.children[args[0]] = { type: "file", content: "" };
                }
            }
            break;

        case 'cat':
            if (!args[0]) {
                appendLine("cat: missing file operand", "error");
            } else {
                const file = currentDir.children[args[0]];
                if (!file) {
                    appendLine(`cat: ${args[0]}: No such file or directory`, "error");
                } else if (file.type === 'dir') {
                    appendLine(`cat: ${args[0]}: Is a directory`, "error");
                } else {
                    appendLine(file.content || "(file is empty)");
                }
            }
            break;

        case 'echo':
            appendLine(args.join(' '));
            break;

        case 'clear':
            outputContainer.innerHTML = '';
            break;

        default:
            appendLine(`command not found: ${command}`, 'error');
            break;
    }
}

function scrollToBottom() {
    const container = document.getElementById('terminal-container');
    container.scrollTop = container.scrollHeight;
}

// Initial state setup
updatePrompt();
