/**
 * @author Andy Zhang
 * Starts a Pty Server on a port
 */

const Server = require("socket.io").Server;
const startProcess = require("./startProcess").startProcess;

const io = new Server(3000);

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
