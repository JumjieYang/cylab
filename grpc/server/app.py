from collections import defaultdict
from concurrent import futures

from time import time,sleep
import grpc
import video_pb2
import video_pb2_grpc

frames = defaultdict(list)

class VideoProcessor(video_pb2_grpc.VideoProcessingServicer):
  def SubmitFrame(self, request, context):
    receivedTime = str(int(time() * 1000))
    frames[request.clientId].append((request.frame, request.clientStartTime, receivedTime))
    return video_pb2.SubmitFrameResponse(serverReceivedTime=receivedTime)

  def Subscribe(self, request, context):
    clientId = request.clientId
    
    while True:
      if frames[clientId]:
        frame, clientStartTime, serverReceivedTime = frames[clientId].pop(0)
        yield video_pb2.SubscribeResponse(
          frame=frame,
          clientStartTime=clientStartTime,
          serverReceivedTime=serverReceivedTime,
          serverProcessedTime=str(int(time() * 1000))
        )
        sleep(1)
      

def serve():
  port = '50051'
  server = grpc.server(futures.ThreadPoolExecutor())
  video_pb2_grpc.add_VideoProcessingServicer_to_server(VideoProcessor(), server)
  server.add_insecure_port('[::]:' + port)
  server.start()
  print('Server started, listening on ' + port)
  server.wait_for_termination()

if __name__ == '__main__':
  serve()