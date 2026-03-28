import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import RecordRTC from 'recordrtc';
import { Camera, StopCircle, RefreshCw, CheckCircle } from 'lucide-react';
import { useFloorplanStore } from '../../stores/floorplanStore';
import { toast } from 'react-hot-toast';

const VideoRecorder: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<RecordRTC | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  
  const { 
    isRecording, 
    setIsRecording, 
    scanProgress, 
    setScanProgress, 
    aiGuidance, 
    setAIGuidance,
    setVideoRecording,
    videoPreviewUrl
  } = useFloorplanStore();

  const handleStartRecording = useCallback(() => {
    if (!webcamRef.current?.video) {
      toast.error('Camera not available');
      return;
    }
    
    setIsRecording(true);
    setScanProgress(0);
    
    const stream = webcamRef.current.video.srcObject as MediaStream;
    
    mediaRecorderRef.current = new RecordRTC(stream, {
      type: 'video',
      mimeType: 'video/webm',
      recorderType: RecordRTC.MediaStreamRecorder,
      disableLogs: true,
      timeSlice: 1000, // Update every second
      ondataavailable: (blob) => {
        // This would be used for real-time processing in a production app
      }
    });
    
    mediaRecorderRef.current.startRecording();
  }, [setIsRecording, setScanProgress]);

  const handleStopRecording = useCallback(() => {
    if (!mediaRecorderRef.current) {
      return;
    }
    
    mediaRecorderRef.current.stopRecording(() => {
      const blob = mediaRecorderRef.current?.getBlob();
      if (blob) {
        setVideoRecording(blob);
      }
      setIsRecording(false);
    });
  }, [setIsRecording, setVideoRecording]);

  const handleReset = useCallback(() => {
    setVideoRecording(null);
  }, [setVideoRecording]);

  const toggleCamera = useCallback(() => {
    setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user');
  }, []);

  // Simulate AI guidance during recording
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        // In a real app, this would be based on actual AI analysis of the video stream
        const randomTips = [
          'Keep the camera steady for better results.',
          'Slow down a bit for more accurate measurements.',
          'Make sure to capture all corners of the room.',
          'Hold your phone at chest height for best results.',
          'Try to maintain a consistent distance from walls.',
          'Scan each room completely before moving to the next.',
          'You\'re doing great! Continue through doorways slowly.'
        ];
        
        const randomTip = randomTips[Math.floor(Math.random() * randomTips.length)];
        setAIGuidance(randomTip);
        
        // Increment progress
        setScanProgress(prev => {
          const newProgress = prev + Math.floor(Math.random() * 5) + 1;
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isRecording, setAIGuidance, setScanProgress]);

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold mb-4">Floorplan Video Capture</h2>
      
      {/* AI Guidance */}
      <div className="bg-dark-lighter p-4 rounded-lg mb-6 border border-white/10">
        <div className="flex items-start">
          <div className="bg-primary/20 p-2 rounded-full mr-3">
            <Camera className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium mb-1">AI Guidance</h3>
            <p className="text-white/70">{aiGuidance}</p>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span>Scan Progress</span>
          <span>{scanProgress}%</span>
        </div>
        <div className="w-full h-2 bg-dark-light rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary"
            style={{ width: `${scanProgress}%` }}
          ></div>
        </div>
      </div>
      
      {/* Video Preview or Camera */}
      <div className="relative aspect-video bg-dark-light rounded-lg overflow-hidden mb-6">
        {videoPreviewUrl ? (
          <video 
            src={videoPreviewUrl} 
            controls 
            className="w-full h-full object-cover"
          />
        ) : (
          <Webcam
            audio={true}
            ref={webcamRef}
            videoConstraints={{
              facingMode,
              width: 1280,
              height: 720
            }}
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Camera toggle button */}
        {!videoPreviewUrl && !isRecording && (
          <button 
            onClick={toggleCamera}
            className="absolute top-4 right-4 p-2 bg-dark/80 rounded-full"
          >
            <RefreshCw className="h-5 w-5 text-white" />
          </button>
        )}
        
        {/* Recording indicator */}
        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center bg-dark/80 px-3 py-1 rounded-full">
            <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse mr-2"></div>
            <span className="text-sm">Recording</span>
          </div>
        )}
      </div>
      
      {/* Controls */}
      <div className="flex justify-center space-x-4">
        {!videoPreviewUrl ? (
          isRecording ? (
            <button 
              onClick={handleStopRecording}
              className="btn btn-primary flex items-center"
            >
              <StopCircle className="h-5 w-5 mr-2" />
              Stop Recording
            </button>
          ) : (
            <button 
              onClick={handleStartRecording}
              className="btn btn-primary flex items-center"
            >
              <Camera className="h-5 w-5 mr-2" />
              Start Recording
            </button>
          )
        ) : (
          <>
            <button 
              onClick={handleReset}
              className="btn btn-outline flex items-center"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Record Again
            </button>
            <button 
              className="btn btn-primary flex items-center"
              onClick={() => {
                // This would navigate to the package selection in a real implementation
                toast.success('Video recorded successfully! Proceed to select your package.');
              }}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Use This Video
            </button>
          </>
        )}
      </div>
      
      {/* Instructions */}
      <div className="mt-8 text-white/70 text-sm">
        <h3 className="font-medium text-white mb-2">Recording Tips:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Walk slowly through each room in a continuous path</li>
          <li>Hold your phone at chest height</li>
          <li>Capture all corners and doorways</li>
          <li>Keep the camera steady as you move</li>
          <li>Scan the entire property in one continuous recording</li>
        </ul>
      </div>
    </div>
  );
};

export default VideoRecorder;