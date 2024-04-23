FROM python:3.9.19-bullseye

WORKDIR /app

COPY . /app
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y
RUN pip3 install -r requirements.txt
ENTRYPOINT [ "python3", "app.py" ]