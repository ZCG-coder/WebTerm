import {TerminalUI} from "./TerminalUI";
import io from "socket.io-client";

const serverAddress = "http://localhost:8080";

//Server sandbox available at https://codesandbox.io/s/web-terminal-tutorial-server-g2ihu

function connectToSocket(serverAddress) {
    return new Promise(res => {
        const socket = io(serverAddress);
        res(socket);
    });
}

function startTerminal(container, socket) {
    const terminal = new TerminalUI(socket);
    terminal.attachTo(container);
    terminal.startListening();
}

function start() {
    const container = document.getElementById("terminal-container");

    connectToSocket(serverAddress).then(socket => {
        startTerminal(container, socket);
    });
}

// Better to start on DOMContentLoaded. So, we know terminal-container is loaded
start();
