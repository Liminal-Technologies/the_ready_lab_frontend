import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, VideoOff, Mic, MicOff, Monitor, MonitorOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface StreamBroadcasterProps {
  eventId: string;
  onStreamStart?: () => void;
  onStreamEnd?: () => void;
}

export const StreamBroadcaster = ({
  eventId,
  onStreamStart,
  onStreamEnd,
}: StreamBroadcasterProps) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  const startStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Start recording
      const recorder = new MediaRecorder(mediaStream, {
        mimeType: 'video/webm;codecs=vp8,opus',
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `stream-${new Date().toISOString()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: 'Recording downloaded',
          description: 'Your stream has been saved to Downloads',
        });
      };

      recorder.start(1000); // Capture in 1-second chunks
      setMediaRecorder(recorder);
      setRecordedChunks(chunks);

      // Update event status to live
      const { error: eventError } = await supabase
        .from('live_events')
        .update({
          status: 'live',
          is_recording: true,
        })
        .eq('id', eventId);

      if (eventError) throw eventError;

      // Store stream credentials securely
      const { error: credError } = await supabase
        .from('live_event_credentials')
        .upsert({
          event_id: eventId,
          stream_key: crypto.randomUUID(),
        });

      if (credError) throw credError;

      setIsStreaming(true);
      onStreamStart?.();

      toast({
        title: 'Stream started',
        description: 'You are now live! Recording will auto-download when you end.',
      });
    } catch (error) {
      console.error('Error starting stream:', error);
      toast({
        title: 'Error',
        description: 'Failed to start stream. Please check camera/microphone permissions.',
        variant: 'destructive',
      });
    }
  };

  const stopStream = async () => {
    // Stop recording first
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Update event status to completed
    await supabase
      .from('live_events')
      .update({ 
        status: 'completed',
        is_recording: false,
      })
      .eq('id', eventId);

    setIsStreaming(false);
    setIsScreenSharing(false);
    setMediaRecorder(null);
    setRecordedChunks([]);
    onStreamEnd?.();

    toast({
      title: 'Stream ended',
      description: 'Your stream has been stopped. Recording is downloading...',
    });
  };

  const toggleCamera = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
      }
    }
  };

  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        // Stop screen sharing, return to camera
        const videoTrack = stream?.getVideoTracks()[0];
        if (videoTrack) videoTrack.stop();

        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        const cameraTrack = cameraStream.getVideoTracks()[0];
        
        if (stream && videoRef.current) {
          stream.removeTrack(videoTrack!);
          stream.addTrack(cameraTrack);
          videoRef.current.srcObject = stream;
        }
        
        setIsScreenSharing(false);
      } else {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const screenTrack = screenStream.getVideoTracks()[0];
        
        const videoTrack = stream?.getVideoTracks()[0];
        if (videoTrack) videoTrack.stop();

        if (stream && videoRef.current) {
          stream.removeTrack(videoTrack!);
          stream.addTrack(screenTrack);
          videoRef.current.srcObject = stream;
        }
        
        setIsScreenSharing(true);

        // Handle screen share end
        screenTrack.onended = () => {
          toggleScreenShare();
        };
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
      toast({
        title: 'Error',
        description: 'Failed to toggle screen sharing',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        
        {isStreaming && (
          <Badge className="absolute top-4 left-4 bg-red-500 animate-pulse">
            🔴 LIVE
          </Badge>
        )}
      </div>

      <div className="p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {!isStreaming ? (
            <Button onClick={startStream} className="flex-1">
              <Video className="mr-2 h-4 w-4" />
              Go Live
            </Button>
          ) : (
            <>
              <Button onClick={stopStream} variant="destructive" className="flex-1">
                <VideoOff className="mr-2 h-4 w-4" />
                End Stream
              </Button>
              
              <Button
                onClick={toggleCamera}
                variant={isCameraOn ? 'secondary' : 'destructive'}
                size="icon"
              >
                {isCameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>
              
              <Button
                onClick={toggleMic}
                variant={isMicOn ? 'secondary' : 'destructive'}
                size="icon"
              >
                {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>
              
              <Button
                onClick={toggleScreenShare}
                variant={isScreenSharing ? 'default' : 'secondary'}
                size="icon"
              >
                {isScreenSharing ? <MonitorOff className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
