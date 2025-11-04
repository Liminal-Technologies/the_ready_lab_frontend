import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Languages, Save } from 'lucide-react';

interface Translation {
  title: string;
  description: string;
}

interface MultilingualMetadataEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  baseTitle: string;
  baseDescription: string;
  translations?: Record<string, Translation>;
  onSave: (translations: Record<string, Translation>) => void;
}

const SUPPORTED_LANGUAGES = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ar', name: 'Arabic' },
];

export const MultilingualMetadataEditor = ({
  open,
  onOpenChange,
  baseTitle,
  baseDescription,
  translations = {},
  onSave,
}: MultilingualMetadataEditorProps) => {
  const [localTranslations, setLocalTranslations] = useState<Record<string, Translation>>(translations);
  const [selectedLanguage, setSelectedLanguage] = useState('es');

  const handleSave = () => {
    onSave(localTranslations);
    onOpenChange(false);
  };

  const updateTranslation = (field: 'title' | 'description', value: string) => {
    setLocalTranslations((prev) => ({
      ...prev,
      [selectedLanguage]: {
        ...prev[selectedLanguage],
        [field]: value,
      },
    }));
  };

  const currentTranslation = localTranslations[selectedLanguage] || {
    title: '',
    description: '',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Multilingual Metadata
          </DialogTitle>
          <DialogDescription>
            Add translations for your content in multiple languages
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="en" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="en">English</TabsTrigger>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <TabsTrigger 
                key={lang.code} 
                value={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
              >
                {lang.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="en" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Title (English - Base Language)</Label>
              <Input value={baseTitle} disabled />
            </div>
            <div className="space-y-2">
              <Label>Description (English - Base Language)</Label>
              <Textarea value={baseDescription} disabled rows={4} />
            </div>
            <p className="text-sm text-muted-foreground">
              This is your base language. Switch to other tabs to add translations.
            </p>
          </TabsContent>

          {SUPPORTED_LANGUAGES.map((lang) => (
            <TabsContent key={lang.code} value={lang.code} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Title ({lang.name})</Label>
                <Input
                  value={currentTranslation.title}
                  onChange={(e) => updateTranslation('title', e.target.value)}
                  placeholder={`Translate: ${baseTitle}`}
                />
              </div>
              <div className="space-y-2">
                <Label>Description ({lang.name})</Label>
                <Textarea
                  value={currentTranslation.description}
                  onChange={(e) => updateTranslation('description', e.target.value)}
                  placeholder={`Translate: ${baseDescription}`}
                  rows={4}
                />
              </div>
              
              {/* Reference */}
              <div className="pt-4 border-t space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Reference (English):</p>
                <div className="bg-muted p-3 rounded-md space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Title:</p>
                    <p className="text-sm">{baseTitle}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Description:</p>
                    <p className="text-sm">{baseDescription}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Translations
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
