const http = require("http");
const SocketService = require("./SocketService");
const portfinder = require("portfinder");
const fs = require("fs");
/*
  Create Server from http module.
*/
const server = http.createServer((req, res) => {
    res.write("Terminal Server Running.");
    res.end();
});

function extractCommand() {
    let args = process.argv;
    args = args.slice(2, args.length);
    args = args.join(" ")
    return args;
}

portfinder.getPort(function (err, port) {
    fs.writeFileSync("../PORT", port.toString())
    server.listen(port, function () {
        console.log("Server listening on : ", port);
        const socketService = new SocketService();
        socketService.attachServer(server, extractCommand());
    });
});
