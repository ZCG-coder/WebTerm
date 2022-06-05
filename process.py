"""Starts the Node.js Process"""
import socket
import subprocess


def select_port():
    """Find the best port to use"""
    sock = socket.socket()
    sock.bind(('', 0))
    free_port = sock.getsockname()[1]
    return free_port

def start_process():
    """Starts the process with a free port"""
    subprocess.Popen(f"node js-svr/index.js {select_port()}", shell=True)  # pylint: disable=R1732
