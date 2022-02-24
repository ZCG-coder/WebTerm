import {Terminal} from "xterm";
import "xterm/css/xterm.css";
import {FitAddon} from "xterm-addon-fit/src/FitAddon";


export class TerminalUI {
    constructor(socket) {
        this.terminal = new Terminal({
            convertEol: true,
            rendererType: "dom", // default is canvas
        });
        this.fit = new FitAddon();
        this.terminal.loadAddon(this.fit);
        this.socket = socket;
        this.terminal.onResize(() => {
            this.fit.fit();
        });
        window.addEventListener('resize', () => {
            this.fit.fit();})
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
            window.close();
            process.exit(0);
        })
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
