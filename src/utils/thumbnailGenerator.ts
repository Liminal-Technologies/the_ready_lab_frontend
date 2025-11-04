/**
 * Generate a thumbnail/poster from a video file
 * @param videoFile - The video file or blob
 * @param timeInSeconds - Time in video to capture (default: 1 second)
 * @returns Promise with blob of the thumbnail image
 */
export const generateVideoThumbnail = (
  videoFile: File | Blob,
  timeInSeconds: number = 1,
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      reject(new Error("Could not get canvas context"));
      return;
    }

    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      // Set canvas size to video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Seek to specific time
      video.currentTime = Math.min(timeInSeconds, video.duration);
    };

    video.onseeked = () => {
      try {
        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to create thumbnail blob"));
            }

            // Clean up
            window.URL.revokeObjectURL(video.src);
          },
          "image/jpeg",
          0.8, // Quality
        );
      } catch (error) {
        reject(error);
      }
    };

    video.onerror = () => {
      reject(new Error("Error loading video"));
    };

    video.src = URL.createObjectURL(videoFile);
  });
};

/**
 * Upload thumbnail to Supabase storage
 */
export const uploadThumbnail = async (
  thumbnailBlob: Blob,
  educatorId: string,
  lessonId: string,
  supabaseClient: any,
): Promise<string> => {
  const fileName = `thumbnails/${educatorId}/${lessonId}.jpg`;

  const { error: uploadError } = await supabaseClient.storage
    .from("videos")
    .upload(fileName, thumbnailBlob, { upsert: true });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabaseClient.storage.from("videos").getPublicUrl(fileName);

  return publicUrl;
};
