import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, Video, Loader2, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface VideoUploadRecorderProps {
  onVideoUploaded: (videoUrl: string, duration: number, blob?: Blob) => void;
  educatorId: string;
}

export const VideoUploadRecorder = ({ onVideoUploaded, educatorId }: VideoUploadRecorderProps) => {
  const [uploading, setUploading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['video/mp4', 'video/quicktime', 'video/webm'].includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload MP4, MOV, or WEBM files only.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (500MB)
    if (file.size > 524288000) {
      toast({
        title: "File too large",
        description: "Video must be under 500MB.",
        variant: "destructive",
      });
      return;
    }

    await uploadVideo(file);
  };

  const uploadVideo = async (blob: Blob) => {
    setUploading(true);
    try {
      const fileName = `${educatorId}/${Date.now()}.${blob.type.split('/')[1]}`;
      
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      // Get video duration
      const duration = await getVideoDuration(blob);
      
      onVideoUploaded(publicUrl, duration, blob);
      
      toast({
        title: "Success",
        description: "Video uploaded successfully!",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const getVideoDuration = (blob: Blob): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(Math.round(video.duration));
      };
      video.src = URL.createObjectURL(blob);
    });
  };

  const startRecording = async (includeScreen = false) => {
    try {
      let videoStream;
      
      if (includeScreen) {
        // Screen share + webcam
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        
        // Combine streams
        const tracks = [...screenStream.getVideoTracks(), ...cameraStream.getAudioTracks()];
        videoStream = new MediaStream(tracks);
      } else {
        // Webcam only
        videoStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
      }

      const mediaRecorder = new MediaRecorder(videoStream, {
        mimeType: 'video/webm',
      });

      mediaRecorderRef.current = mediaRecorder;
      setRecordedChunks([]);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setRecordedChunks((prev) => [...prev, e.data]);
        }
      };

      mediaRecorder.onstop = () => {
        videoStream.getTracks().forEach((track) => track.stop());
      };

      if (videoRef.current) {
        videoRef.current.srcObject = videoStream;
      }

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error('Recording error:', error);
      toast({
        title: "Recording failed",
        description: "Could not access camera/microphone/screen.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      
      // Create preview
      setTimeout(() => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoPreview(url);
      }, 100);
    }
  };

  const uploadRecording = async () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    await uploadVideo(blob);
    setVideoPreview(null);
    setRecordedChunks([]);
  };

  const cancelRecording = () => {
    setVideoPreview(null);
    setRecordedChunks([]);
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Video</TabsTrigger>
          <TabsTrigger value="record">Record Video</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <Label htmlFor="video-upload" className="cursor-pointer">
              <div className="text-sm text-muted-foreground mb-2">
                Click to upload or drag and drop
              </div>
              <div className="text-xs text-muted-foreground">
                MP4, MOV, or WEBM (max 500MB)
              </div>
            </Label>
            <input
              id="video-upload"
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </div>
          {uploading && (
            <div className="flex items-center justify-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading video...
            </div>
          )}
        </TabsContent>

        <TabsContent value="record" className="space-y-4">
          {!videoPreview ? (
            <>
              <div className="border rounded-lg overflow-hidden bg-black aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2 justify-center">
                {!recording ? (
                  <>
                    <Button onClick={() => startRecording(false)}>
                      <Video className="h-4 w-4 mr-2" />
                      Record Webcam
                    </Button>
                    <Button onClick={() => startRecording(true)} variant="outline">
                      <Video className="h-4 w-4 mr-2" />
                      Record Screen + Webcam
                    </Button>
                  </>
                ) : (
                  <Button onClick={stopRecording} variant="destructive">
                    Stop Recording
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="border rounded-lg overflow-hidden bg-black aspect-video">
                <video
                  src={videoPreview}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2 justify-center">
                <Button onClick={uploadRecording} disabled={uploading}>
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Recording
                    </>
                  )}
                </Button>
                <Button onClick={cancelRecording} variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
