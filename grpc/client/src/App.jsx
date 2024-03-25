import { useEffect, useRef, useState } from "react";
import { VideoProcessingPromiseClient } from "./video_grpc_web_pb";
import { SubmitFrameRequest, SubscribeRequest } from "./video_pb";

export const App = () => {
  const [streaming, setStreaming] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [timestamps, setTimestamps] = useState([]);
  const videoProcessorService = new VideoProcessingPromiseClient('http://localhost:8080');
  const id = '1';
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
        setStreaming(true);
      })
      .catch(console.error);

    const data = new SubscribeRequest();
    data.setClientid(id);
    const stream = videoProcessorService.subscribe(data);

    stream.on('data', (res) => {
      const time = new Date().getTime().toString();
      setTimestamps((prev) => [...prev, { clientStartTime: res.getClientstarttime(), serverReceivedTime: res.getServerreceivedtime(), serverProcessedTime: res.getServerprocessedtime(), clientReceivedTime: time }])
    });
  }, []);

  const captureFrame = () => {
    if (streaming) {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasRef.current.toBlob(blob => {
        blob.arrayBuffer().then(buffer => {
          const uint8View = new Uint8Array(buffer);
          const data = new SubmitFrameRequest();
          data.setClientid(id);
          data.setFrame(uint8View);
          data.setClientstarttime(new Date().getTime().toString());
          videoProcessorService.submitFrame(data).catch(console.error);
        });
      }, 'image/jpeg');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      captureFrame();
    }, 100);

    return () => clearInterval(interval);
  }, [streaming]);

  return (
    <div className="flex flex-col h-screen w-screen justify-between">
      <div className="h-1/4 w-full" />
      <div className="flex h-1/2 justify-center">
        <video ref={videoRef} autoPlay style={{ display: 'none' }} />
        <canvas className="w-1/2 h-full" ref={canvasRef} width={1920} height={1080} />
        <div className="overflow-auto flex-1">
          {timestamps && timestamps.length > 0 && timestamps.map(timestamp => {
            return (
              <div className="flex flex-col border-2 border-black my-4">
                <div className="flex justify-around">
                  <span>Client Send: {timestamp['clientStartTime']}</span>
                  <span>Server Received: {timestamp['serverReceivedTime']}</span>
                  <span className="text-red-500">Diff: {timestamp['serverReceivedTime'] - timestamp['clientStartTime']}</span>
                </div>
                <div className="flex justify-around">
                  <span>Server Processed: {timestamp['serverProcessedTime']}</span>
                  <span>Client Received: {timestamp['clientReceivedTime']}</span>
                  <span className="text-red-500">Diff: {timestamp['clientReceivedTime'] - timestamp['serverProcessedTime']}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="h-1/4 w-full" />

    </div>
  )
}