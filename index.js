const Server = require("socket.io").Server;
const os = require('os');
const pty = require('node-pty');

const shell = 'bash';

function startProcess() {
    const ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 30,
        cwd: process.env.HOME,
        env: process.env
    });

    ptyProcess.on('data', function(data) {
        process.stdout.write(data)
    })

    ptyProcess.onExit(function() {
        process.exit();
    });

    return ptyProcess;
}

const ptyProcess = startProcess();
const io = new Server(3000);

io.on('connection', (socket) => {
    console.log('Connected');
    socket.on('disconnect', () => {
        console.log('Disconnected');
    });
});

io.on('input', function(data) {
    ptyProcess.write(data);
});

ptyProcess