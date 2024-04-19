import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3004');

export const App = () => {
    const [streaming, setStreaming] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [devices, setDevices] = useState([]);
    const [curDevice, setCurDevice] = useState();
    const getUserDevices = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
        setCurDevice(videoDevices[0].deviceId);
    }
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({
            video: true
        })
            .then(stream => {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    setStreaming(true);
                };
            })
            .catch(console.error);
        socket.on('frame_processed', data => {
            drawBoundingBoxes(data['frame'], data['cls']);
        });
        getUserDevices();
    }, []);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({
            video: {
                deviceId: curDevice
            }
        })
            .then(stream => {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    setStreaming(true);
                };
            })
            .catch(console.error);
    }, [curDevice]);

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
        }, 100);
        return () => clearInterval(interval);
    }, [streaming]);

    return (
        <div className='flex flex-col h-screen w-screen justify-between'>
            <div className='flex flex-col h-1/4 w-full self-center justify-center'>
                <span className='self-center text-7xl font-bold'>Demo</span>
            </div>
            <div className='flex flex-1 justify-center self-center'>
                <video ref={videoRef} autoPlay style={{ display: 'none' }}></video>
                <canvas className='w-full h-full' ref={canvasRef} width={1920} height={1080} />
                <div className='overflow-auto flex-1'>
                </div>
            </div>
            <div className='h-1/4 w-full flex flex-col justify-center'>
                <div className='flex justify-center gap-4'>
                {
                    devices && devices.map((device) => {
                        return (
                            <div key={device.deviceId} onClick={() => setCurDevice(device.deviceId)} className={`${device.deviceId === curDevice ? 'bg-blue-500': 'border border-blue-500'}`}>
                                <span>{device.label}</span>
                            </div>
                        )
                    })
                }
                </div>
            </div>
        </div>
    );
}

export default App;