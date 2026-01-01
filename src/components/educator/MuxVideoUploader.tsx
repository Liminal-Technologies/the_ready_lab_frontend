import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Upload, Loader2, X, CheckCircle2, FileVideo, AlertCircle } from 'lucide-react';

interface MuxVideoUploaderProps {
  onVideoUploaded: (data: {
    videoId: string;
    playbackId?: string;
    duration?: number;
    status: string;
  }) => void;
  educatorId: string;
  lessonTitle?: string;
}

export const MuxVideoUploader = ({ onVideoUploaded, educatorId, lessonTitle }: MuxVideoUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'complete' | 'error'>('idle');
  const [selectedFile, setSelectedFile] = useState<{ file: File; previewUrl: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['video/mp4', 'video/quicktime', 'video/webm', 'video/x-m4v'].includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload MP4, MOV, M4V, or WEBM files only.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (2GB for Mux direct upload)
    if (file.size > 2 * 1024 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Video must be under 2GB.",
        variant: "destructive",
      });
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setSelectedFile({ file, previewUrl });
    setErrorMessage(null);
    setUploadStatus('idle');
  };

  const cancelFileSelection = () => {
    if (selectedFile) {
      URL.revokeObjectURL(selectedFile.previewUrl);
      setSelectedFile(null);
    }
    setErrorMessage(null);
    setUploadStatus('idle');
  };

  const cancelUpload = () => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
    setUploading(false);
    setUploadProgress(0);
    setUploadStatus('idle');
  };

  const uploadSelectedFile = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadStatus('uploading');
    setErrorMessage(null);

    try {
      // Step 1: Get a direct upload URL from Mux via our API
      const uploadResponse = await api.videos.createUpload({
        title: lessonTitle || selectedFile.file.name,
        ownerId: educatorId,
        corsOrigin: window.location.origin,
      });

      const { uploadUrl, id: videoId } = uploadResponse;

      // Step 2: Upload the file directly to Mux using XHR for progress tracking
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload'));
        });

        xhr.addEventListener('abort', () => {
          reject(new Error('Upload cancelled'));
        });

        xhr.open('PUT', uploadUrl);
        xhr.send(selectedFile.file);
      });

      // Step 3: Upload complete, now processing
      setUploadStatus('processing');
      setUploadProgress(100);

      // Notify parent with video info
      onVideoUploaded({
        videoId,
        status: 'processing',
      });

      setUploadStatus('complete');
      toast({
        title: "Video uploaded successfully",
        description: "Your video is now being processed. This may take a few minutes.",
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setErrorMessage(error.message || 'Failed to upload video');
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      xhrRef.current = null;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        // File selection UI
        <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer">
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <Label htmlFor="mux-video-upload" className="cursor-pointer">
            <div className="text-sm text-muted-foreground mb-2">
              Click to select a video file
            </div>
            <div className="text-xs text-muted-foreground">
              MP4, MOV, M4V, or WEBM (max 2GB)
            </div>
          </Label>
          <input
            id="mux-video-upload"
            type="file"
            accept="video/mp4,video/quicktime,video/webm,video/x-m4v"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </div>
      ) : (
        // Preview and upload UI
        <div className="space-y-4">
          {/* Video Preview */}
          <div className="border rounded-lg overflow-hidden bg-black aspect-video">
            <video
              src={selectedFile.previewUrl}
              controls
              className="w-full h-full"
            />
          </div>

          {/* File Info */}
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <FileVideo className="h-8 w-8 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{selectedFile.file.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(selectedFile.file.size)}
              </p>
            </div>
            {!uploading && (
              <Button
                variant="ghost"
                size="sm"
                onClick={cancelFileSelection}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {uploadStatus === 'processing' ? 'Processing video...' : 'Uploading your video...'}
                </span>
                <span className="font-medium">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
              {uploadStatus === 'processing' && (
                <p className="text-xs text-muted-foreground text-center">
                  Upload complete. Video is being processed...
                </p>
              )}
            </div>
          )}

          {/* Success Indicator */}
          {uploadStatus === 'complete' && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Video uploaded successfully!
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Ready to save. Processing may take a few minutes after saving.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Buttons - hide when upload is complete */}
          {uploadStatus !== 'complete' && (
            <div className="flex gap-2">
              {!uploading ? (
                <>
                  <Button
                    onClick={uploadSelectedFile}
                    className="flex-1"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Video
                  </Button>
                  <Button variant="outline" onClick={cancelFileSelection}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="destructive"
                  onClick={cancelUpload}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel Upload
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
