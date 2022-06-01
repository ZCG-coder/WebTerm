"""Connects to the PTY server"""

import sys
import socketio

sio = socketio.Client()
sio.connect("http://localhost:3000")

@sio.on("connect")
def connect():
    print("connection established", flush=True)


@sio.on("out")
def out(data):
    print(data)


@sio.on("disconnect")
def disconnect():
    sys.exit(0)
