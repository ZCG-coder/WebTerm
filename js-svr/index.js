/**
 * @author Andy Zhang
 * @param {number} port The port to run this server
 * Starts a Pty Server on a port
 */

const Server = require("socket.io").Server;
const startProcess = require("./startProcess").startProcess;

function parsePort() {
    /**
     * Finds a free port to use
     * @returns {string} The port specified
     */
    const args = process.argv;
    let port = args[2];
    if (port === undefined) {
        port = 3000;
    }
    return port;
}

const port = parsePort();
const io = new Server(port);

io.on('connection', (socket) => {
    let ptyProcess = startProcess();
    console.log('Connected');
    socket.on('disconnect', () => {
        console.log('Disconnected');
        process.exit();
    });

    socket.on('input', function (data) {
        console.log("Received input");
        ptyProcess.write(data);
    });

    ptyProcess.onData(function (data) {
        console.log("Received output from pty");
        socket.emit("out", data);
    });
});
