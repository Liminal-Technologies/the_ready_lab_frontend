export interface ContentWithLanguage {
  id: string;
  translations?: Record<string, any>;
  [key: string]: any;
}

export const filterContentByLanguage = <T extends ContentWithLanguage>(
  content: T[],
  preferredLanguage: string,
  showOnlyPreferred: boolean,
): T[] => {
  if (!showOnlyPreferred) {
    return content;
  }

  return content.filter((item) => {
    // If no translations, treat as default language (English)
    if (!item.translations) {
      return preferredLanguage === "en";
    }

    // Check if content has translation in preferred language
    return item.translations[preferredLanguage];
  });
};

export const sortContentByLanguage = <T extends ContentWithLanguage>(
  content: T[],
  preferredLanguage: string,
): T[] => {
  return [...content].sort((a, b) => {
    const aHasPreferred =
      a.translations?.[preferredLanguage] || preferredLanguage === "en";
    const bHasPreferred =
      b.translations?.[preferredLanguage] || preferredLanguage === "en";

    if (aHasPreferred && !bHasPreferred) return -1;
    if (!aHasPreferred && bHasPreferred) return 1;
    return 0;
  });
};

export const getContentLanguageLabel = (
  item: ContentWithLanguage,
  preferredLanguage: string,
): string | null => {
  if (!item.translations) {
    return preferredLanguage === "en" ? null : "EN";
  }

  const availableLanguages = Object.keys(item.translations);

  if (availableLanguages.includes(preferredLanguage)) {
    return null; // Content is in preferred language
  }

  // Return the first available language as a label
  return availableLanguages[0]?.toUpperCase() || "EN";
};

export const getTranslatedContent = (
  item: ContentWithLanguage,
  field: string,
  preferredLanguage: string,
  fallback: string = "",
): string => {
  // Try to get translated field
  if (item.translations?.[preferredLanguage]?.[field]) {
    return item.translations[preferredLanguage][field];
  }

  // Fall back to English or original field
  if (item.translations?.en?.[field]) {
    return item.translations.en[field];
  }

  // Fall back to the field itself or provided fallback
  return item[field] || fallback;
};
