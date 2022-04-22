"""
A simple Python wrapper for the HTML site
You must first install Qt if you use Linux
"""
import os
import socket
import subprocess
import sys
import webview
from threading import Thread

WINDOWS = sys.platform[:3] == "win"
OSX = sys.platform == "darwin"

# region Determines the command of the server
if WINDOWS:
    SERVER_NAME = f"LangSupport/WebTerm/server/bin/server-win.exe"
elif OSX:
    SERVER_NAME = f"LangSupport/WebTerm/server/bin/server-macos"
else:
    SERVER_NAME = f"LangSupport/WebTerm/server/bin/server-linux"
# endregion

# region Get a suitable server socket
sock = socket.socket()
sock.bind(('', 0))
port = sock.getsockname()[1]


# endregion


def start_process(command: str = ""):
    svr = subprocess.Popen(f"{SERVER_NAME} '{command}'", shell=True)
    cli = subprocess.Popen(f"{sys.executable} -m http.server {port} --directory LangSupport/WebTerm/client/dist/",
                           shell=True)
    return svr, cli


def _shell(command):
    server, client = start_process(command)

    with open("LangSupport/WebTerm/PORT") as f:
        webview.create_window(f"http://localhost:{port}/?port={f.read()}")
        webview.start()

    os.kill(server.pid, 0)
    os.kill(client.pid, 0)


def open_shell():
    shell = os.environ.get("SHELL") if not WINDOWS else "CMD.EXE"
    if shell is None:
        raise EnvironmentError("The $SHELL variable is undefined")
    _shell(shell)


def run_shell_command(command, cwd="."):
    Thread(target=_shell, args=(f"cd {cwd} && " + command + "&& exit",), daemon=True).start()
