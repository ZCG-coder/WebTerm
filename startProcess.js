const pty = require("node-pty");

const shell = process.shell;

function startProcess() {
    /**
     * Starts a Psedo-terminal process
     * @returns {pty.IPty} Process
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