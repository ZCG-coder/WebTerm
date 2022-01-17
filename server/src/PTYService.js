const pty = require("node-pty");

const shell = process.env.SHELL;  // Gets the default shell

class PTY {
    constructor(socket) {
        this.shell = shell;
        this.ptyProcess = null;
        this.socket = socket;

        // Initialize PTY process.
        this.startPtyProcess();
    }

    /**
     * Spawn an instance of pty with a selected shell.
     */
    startPtyProcess() {
        this.ptyProcess = pty.spawn(this.shell, [], {
            name: "xterm-color",
            cwd: process.env.HOME, // Which path should terminal start
            env: process.env, // Pass environment variables
        });

        // Add a "data" event listener.
        this.ptyProcess.on("data", data => {
            // Whenever terminal generates any data, send that output to socket.io client to display on UI
            this.sendToClient(data);
        });
    }

    /**
     * Use this function to send in the input to Pseudo Terminal process.
     * @param {*} data Input from user like command sent from terminal UI
     */

    write(data) {
        this.ptyProcess.write(data);
    }

    sendToClient(data) {
        // Emit data to socket.io client in an event "output"
        this.socket.emit("output", data);
    }
}

module.exports = PTY;
