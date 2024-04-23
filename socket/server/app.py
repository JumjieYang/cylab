from PIL import Image
import base64
import io
from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from time import time
from ultralytics import YOLO
import numpy as np

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
model = YOLO('yolov8n.pt')

@socketio.on('connect')
def test_connect():
    print('Client connected')

@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')

@socketio.on('frame')
def handle_video(data):
    data['server-received'] = int(time() * 1000)
    base64_image = data['frame'].split(",")[1]
    image_data = base64.b64decode(base64_image)
    image = Image.open(io.BytesIO(image_data))
    img_array = np.array(image)
    results = model(img_array)
    classes = results[0].boxes.cls.tolist()
    names = []
    for c in classes:
        names.append(model.names[c])
    data['cls'] = names
    data['frame'] = results[0].boxes.xyxy.tolist()
    data['server-processed'] = int(time() * 1000)
    emit('frame_processed', data)

if __name__ == '__main__':
    socketio.run(app, port=3004, debug=True, allow_unsafe_werkzeug=True)