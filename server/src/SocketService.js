// Manage Socket.IO server
const PTY = require("./PTYService");

const socketIO = require("socket.io");

class SocketService {
    constructor() {
        this.socket = null;
        this.pty = null;
    }

    attachServer(server, command) {
        if (!server) {
            throw new Error("Server not found...");
        }

        const io = socketIO(server);
        console.log("Created socket server. Waiting for client connection.");
        // "connection" event happens when any client connects to this io instance.
        io.on("connection", socket => {
            console.log("Client connect to socket.", socket.id);

            this.socket = socket;

            this.socket.on("disconnect", () => {
                process.exit(0);
            });

            // Create a new pty service when client connects.
            this.pty = new PTY(this.socket, command);

            // Attach any event listeners which runs if any event is triggered from socket.io client
            // For now, we are only adding "input" event,
            // where the client sends the strings you type on terminal UI.
            this.socket.on("input", input => {
                //Runs this event function socket receives "input" events from socket.io client
                this.pty.write(input);
            });
        });
    }
}

module.exports = SocketService;
