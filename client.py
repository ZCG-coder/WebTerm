"""Connects to the PTY server"""

import logging
import sys
import socketio

sio = socketio.Client()
sio.connect("http://localhost:3000")

logging.basicConfig(filename="client.log", filemode="w")
logger = logging.getLogger("Terminal Client")
logger.setLevel(logging.INFO)
logger.info("Connecting...")

@sio.on("connect")
def connect():
    """Connect to the terminal server"""
    print("Connection established", flush=True)


@sio.on("out")
def out(data):
    """Receive output, then write to a file"""
    with open("output", "w", encoding="utf-8") as f:
        f.write(data)


@sio.on("disconnect")
def disconnect():
    """On the event of disconnect, exit the program"""
    sys.exit(0)

def send_input(in_):
    """Send the input to server"""
    sio.emit("input", in_)
