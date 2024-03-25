from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from time import time
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")


@socketio.on('connect')
def test_connect():
    print('Client connected')

@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')

@socketio.on('frame')
def handle_video(data):
    data['server-received'] = int(time() * 1000)
    data['frame'] = data['frame']
    data['server-processed'] = int(time() * 1000)
    emit('frame_processed', data)

if __name__ == '__main__':
    socketio.run(app, port=3004, debug=True)