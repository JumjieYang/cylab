import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3004');

export const App = () => {
    const [streaming, setStreaming] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [timestamps, setTimestamps] = useState([]);
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    setStreaming(true);
                };
            })
            .catch(console.error);

        socket.on('frame_processed', data => {
            data['client-received'] = new Date().getTime().toString();
            setTimestamps((prev) => [...prev, data]);
            drawBoundingBoxes(data['frame'], data['cls']);
        });
    }, []);

    const drawBoundingBoxes = (boxes, classes) => {
        const context = canvasRef.current.getContext('2d');
        context.strokeStyle = 'red';
        context.lineWidth = 2;
        boxes.forEach(box => {
            const [xmin, ymin, xmax, ymax] = box;
            const width = xmax - xmin;
            const height = ymax - ymin;
            context.strokeRect(xmin, ymin, width, height);
        });
    };

    const captureFrame = () => {
        if (streaming) {
            const context = canvasRef.current.getContext('2d');
            context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            canvasRef.current.toBlob(blob => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = function () {
                    const base64 = reader.result;
                    const data = {
                        'client-start': new Date().getTime().toString(),
                        'frame': base64
                    }
                    socket.emit('frame', data);
                }

            }, 'image/jpeg');
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            captureFrame();
        }, 200);
        return () => clearInterval(interval);
    }, [streaming]);

    return (
        <div className='flex flex-col h-screen w-screen justify-between'>
            <div className='h-1/4 w-full' />
            <div className='flex h-1/2 justify-center'>
                <video ref={videoRef} autoPlay style={{ display: 'none' }}></video>
                <canvas className='w-1/2 h-full' ref={canvasRef} width={1920} height={1080} />
                <div className='overflow-auto flex-1'>
                    {timestamps && timestamps.length > 0 && timestamps.map(timestamp => {
                        return (
                            <div className='flex flex-col border-2 border-black my-4'>
                                <div className='flex justify-around'>
                                    <span>Client Send: {timestamp['client-start']}</span>
                                    <span>Server Received: {timestamp['server-received']}</span>
                                    <span className='text-red-500'>Diff: {timestamp['server-received'] - timestamp['client-start']}</span>
                                </div>
                                <div className='flex justify-around'>
                                    <span>Server Processed: {timestamp['server-processed']}</span>
                                    <span>Client Received: {timestamp['client-received']}</span>
                                    <span className='text-red-500'>Diff: {timestamp['client-received'] - timestamp['server-processed']}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='h-1/4 w-full' />
        </div>
    );
}

export default App;