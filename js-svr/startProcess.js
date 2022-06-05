/**
 * Starts a PTY process using the system-defined shell
 * @author Andy Zhang
 */
const pty = require("node-pty");

const shell = process.env.SHELL;

function startProcess() {
    /**
     * Starts a Psedo-terminal process
     * @returns {pty.IPty} The PTY process
     */
    const ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cwd: process.env.HOME,
        env: process.env
    });

    ptyProcess.onExit(function () {
        process.exit();  // On exit of the shell, exit the program as well
    });

    return ptyProcess;
}

module.exports = { startProcess };