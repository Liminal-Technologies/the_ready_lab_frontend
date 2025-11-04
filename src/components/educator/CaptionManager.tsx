import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, Languages, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CaptionManagerProps {
  lessonId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingCaptions?: Array<{
    language_code: string;
    caption_url: string;
    format: string;
    is_auto_generated: boolean;
  }>;
}

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "pt", name: "Portuguese" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ar", name: "Arabic" },
];

export const CaptionManager = ({
  lessonId,
  open,
  onOpenChange,
  existingCaptions = [],
}: CaptionManagerProps) => {
  const [uploading, setUploading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("es");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validFormats = [".vtt", ".srt"];
    const fileExtension = file.name
      .toLowerCase()
      .slice(file.name.lastIndexOf("."));

    if (!validFormats.includes(fileExtension)) {
      toast({
        title: "Invalid file format",
        description: "Please upload VTT or SRT files only.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const uploadCaptionFile = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const fileExtension = selectedFile.name
        .toLowerCase()
        .slice(selectedFile.name.lastIndexOf(".") + 1);
      const fileName = `captions/${lessonId}/${selectedLanguage}.${fileExtension}`;

      const { error: uploadError } = await supabase.storage
        .from("videos")
        .upload(fileName, selectedFile, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("videos").getPublicUrl(fileName);

      // Save to database
      const { error: dbError } = await supabase.from("video_captions").upsert({
        lesson_id: lessonId,
        language_code: selectedLanguage,
        caption_url: publicUrl,
        format: fileExtension,
        is_auto_generated: false,
      });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Caption file uploaded successfully!",
      });

      setSelectedFile(null);
      onOpenChange(false);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload caption file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const autoTranslateCaptions = async () => {
    setTranslating(true);
    try {
      // Find English captions
      const englishCaption = existingCaptions.find(
        (c) => c.language_code === "en",
      );

      if (!englishCaption) {
        toast({
          title: "No base captions",
          description:
            "Please upload English captions first before translating.",
          variant: "destructive",
        });
        return;
      }

      // Fetch the English caption file
      const response = await fetch(englishCaption.caption_url);
      const captionText = await response.text();

      // Call translation edge function
      const { data, error } = await supabase.functions.invoke(
        "translate-subtitles",
        {
          body: {
            text: captionText,
            targetLanguage: selectedLanguage,
            format: englishCaption.format,
          },
        },
      );

      if (error) throw error;

      // Upload translated captions
      const blob = new Blob([data.translatedText], { type: "text/plain" });
      const fileName = `captions/${lessonId}/${selectedLanguage}.${englishCaption.format}`;

      const { error: uploadError } = await supabase.storage
        .from("videos")
        .upload(fileName, blob, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("videos").getPublicUrl(fileName);

      // Save to database
      const { error: dbError } = await supabase.from("video_captions").upsert({
        lesson_id: lessonId,
        language_code: selectedLanguage,
        caption_url: publicUrl,
        format: englishCaption.format,
        is_auto_generated: true,
      });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Captions translated successfully!",
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Translation error:", error);
      toast({
        title: "Translation failed",
        description: "Failed to translate captions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setTranslating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Manage Captions
          </DialogTitle>
          <DialogDescription>
            Upload caption files or auto-translate from English
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Existing Captions */}
          {existingCaptions.length > 0 && (
            <div className="space-y-2">
              <Label>Existing Captions</Label>
              <div className="flex flex-wrap gap-2">
                {existingCaptions.map((caption) => (
                  <Badge key={caption.language_code} variant="secondary">
                    {SUPPORTED_LANGUAGES.find(
                      (l) => l.code === caption.language_code,
                    )?.name || caption.language_code}
                    {caption.is_auto_generated && " (Auto)"}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Language Selection */}
          <div className="space-y-2">
            <Label>Target Language</Label>
            <Select
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Upload Option */}
          <div className="space-y-2">
            <Label>Upload Caption File</Label>
            <div className="border-2 border-dashed rounded-lg p-6">
              <div className="flex flex-col items-center gap-2">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <Label
                  htmlFor="caption-upload"
                  className="cursor-pointer text-center"
                >
                  <div className="text-sm text-muted-foreground mb-1">
                    {selectedFile
                      ? selectedFile.name
                      : "Click to upload caption file"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    VTT or SRT format
                  </div>
                </Label>
                <input
                  id="caption-upload"
                  type="file"
                  accept=".vtt,.srt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
            {selectedFile && (
              <Button
                onClick={uploadCaptionFile}
                disabled={uploading}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Caption File
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Auto-Translate Option */}
          <div className="pt-4 border-t">
            <Button
              onClick={autoTranslateCaptions}
              disabled={
                translating ||
                !existingCaptions.find((c) => c.language_code === "en")
              }
              variant="outline"
              className="w-full"
            >
              {translating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  <Languages className="h-4 w-4 mr-2" />
                  Auto-Translate from English
                </>
              )}
            </Button>
            {!existingCaptions.find((c) => c.language_code === "en") && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Upload English captions first to enable auto-translation
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
