const pty = require("node-pty");

const windows = process.platform === "win32";
const shell = (!windows) ? process.env.SHELL : "CMD.EXE";  // Gets the default shell

class PTY {
    /**
     * Initialize a *PTY instance*, which runs the "startCommand" first
     * Using write instead of args, because args doesn't seem to work.*/
    constructor(socket, startCommand = "") {
        this.shell = shell;
        this.ptyProcess = null;
        this.socket = socket;
        this.startCommand = startCommand;

        // Initialize PTY process.
        this.startPtyProcess();
    }

    /**
     * Spawn an instance of pty with a selected shell.
     * If there's a command to execute in the shell, then do it now as arguments
     */
    startPtyProcess() {
        this.ptyProcess = pty.spawn(this.shell, [], {
            name: "xterm-color",
            cwd: process.env.HOME, // Which path should terminal start
            env: process.env, // Pass environment variables
        });
        this.ptyProcess.write(this.startCommand + "\n");

        // Add a "data" event listener.
        this.ptyProcess.on("data", data => {
            // Whenever terminal generates any data, send that output to socket.io client to display on UI
            this.sendToClient("output", data);
        });
        // Free the port immediately after the shell exit, so we can fix port availability issues
        this.ptyProcess.onExit(() => {
            this.sendToClient("exit", "");
        });
    }

    /**
     * Use this function to send in the input to Pseudo Terminal process.
     * @param {*} data Input from user like command sent from terminal UI
     */

    write(data) {
        this.ptyProcess.write(data);
    }

    sendToClient(type, data) {
        // Emit data to socket.io client in an event "output"
        this.socket.emit(type, data);
    }
}

module.exports = PTY;
