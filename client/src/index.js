import $ from "jquery";
import {TerminalUI} from "./TerminalUI";
import io from "socket.io-client";

function getURLParameter(sParam) {
    const sPageURL = window.location.search.substring(1);
    const sURLVariables = sPageURL.split('&');
    for (let i = 0; i < sURLVariables.length; i++) {
        const sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1];
        }
    }
}

const port = getURLParameter("port");

const serverAddress = `http://localhost:${port}`;
console.log(serverAddress);

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

// Better to start on DOMContentLoaded. So, we know the terminal container is loaded
$(document).ready(() => {
    start();
});
