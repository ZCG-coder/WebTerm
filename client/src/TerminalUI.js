import $ from "jquery";
import {Terminal} from "xterm";
import "xterm/css/xterm.css";
import {FitAddon} from "xterm-addon-fit/src/FitAddon";
import fs from "fs";
import JSON5 from "json5";

export class TerminalUI {
    constructor(socket) {
        this.initializeTerminal();
        this.fit = new FitAddon();
        this.terminal.loadAddon(this.fit);
        this.socket = socket;

        $(window).resize(() => {
            this.onResize();
        });
        $("#terminal-container").contextmenu((e) => {
            e.preventDefault();
            return false;  // The menu is actually useless
        });
    }

    initializeTerminal() {
        const configText = fs.readFileSync("../../../Config/general-settings.json").toString();
        const configObject = JSON5.parse(configText);
        this.terminal = new Terminal({
            convertEol: true,
            fontFamily: configObject["font"],
            fontSize: configObject["fontSize"]
        });
    }

    onResize() {
        this.fit.fit();
        const size = $("#size");
        size.show();
        let width = $(window).width();
        let height = $(window).height();
        size.text(`${width}x${height}`);
        setTimeout(() => {
            size.fadeOut();
        }, 2000);
    }

    /**
     * Attach event listeners for terminal UI and socket.io client
     */
    startListening() {
        this.terminal.onData((data) => this.sendInput(data));
        this.socket.on("output", (data) => {
            // When there is data from PTY on server, print that on Terminal.
            this.write(data);
        });
        this.socket.on("exit", () => {
            window.isClosed = true;
            window.close();
        });
    }

    /**
     * Print something to terminal UI.
     */
    write(text) {
        this.terminal.write(text);
    }

    /**
     * Utility function to print new line on terminal.
     */
    prompt() {
        this.terminal.write(`\r\n$ `);
    }

    /**
     * Send whatever you type in Terminal UI to PTY process in server.
     * @param {*} input Input to send to server
     */
    sendInput(input) {
        this.socket.emit("input", input);
    }

    /**
     * Attaches to a new terminal
     * @param {HTMLElement} container HTMLElement where xterm can attach terminal ui instance.
     */
    attachTo(container) {
        this.terminal.open(container);
        this.fit.fit();
    }

    clear() {
        this.terminal.clear();
    }
}
