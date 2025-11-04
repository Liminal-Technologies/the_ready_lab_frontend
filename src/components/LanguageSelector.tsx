import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Globe, Check } from "lucide-react";
import { useState } from "react";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  available: boolean;
}

const languages: Language[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    available: true,
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    available: true,
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    available: false,
  },
  {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    flag: "🇧🇷",
    available: false,
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    flag: "🇸🇦",
    available: false,
  },
  {
    code: "zh",
    name: "Mandarin",
    nativeName: "中文",
    flag: "🇨🇳",
    available: false,
  },
];

interface LanguageSelectorProps {
  currentLanguage?: string;
  onLanguageChange?: (language: string) => void;
  showBadge?: boolean;
}

const LanguageSelector = ({
  currentLanguage = "en",
  onLanguageChange,
  showBadge = true,
}: LanguageSelectorProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  const currentLang =
    languages.find((lang) => lang.code === selectedLanguage) || languages[0];

  const handleLanguageSelect = (langCode: string) => {
    const language = languages.find((lang) => lang.code === langCode);
    if (language?.available) {
      setSelectedLanguage(langCode);
      onLanguageChange?.(langCode);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Globe className="h-4 w-4" />
            <span className="text-lg">{currentLang.flag}</span>
            <span className="hidden sm:inline">{currentLang.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 bg-card border-border shadow-medium z-50"
        >
          <div className="p-2">
            <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
              Available Languages
            </div>
            {languages
              .filter((lang) => lang.available)
              .map((language) => (
                <DropdownMenuItem
                  key={language.code}
                  onClick={() => handleLanguageSelect(language.code)}
                  className="flex items-center justify-between p-2 cursor-pointer hover:bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{language.flag}</span>
                    <div>
                      <div className="font-medium text-foreground">
                        {language.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {language.nativeName}
                      </div>
                    </div>
                  </div>
                  {selectedLanguage === language.code && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}

            <div className="border-t border-border my-2"></div>
            <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
              Coming Soon
            </div>
            {languages
              .filter((lang) => !lang.available)
              .map((language) => (
                <DropdownMenuItem
                  key={language.code}
                  disabled
                  className="flex items-center justify-between p-2 opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{language.flag}</span>
                    <div>
                      <div className="font-medium text-foreground">
                        {language.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {language.nativeName}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Soon
                  </Badge>
                </DropdownMenuItem>
              ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {showBadge && selectedLanguage === "es" && (
        <Badge
          className="bg-success/10 text-success border-success/20"
          variant="outline"
        >
          Bilingual Ready
        </Badge>
      )}
    </div>
  );
};

export default LanguageSelector;
