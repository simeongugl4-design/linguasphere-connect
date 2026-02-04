export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
}

export const languages: Language[] = [
  // Major World Languages
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸", region: "Global" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", region: "Europe/Americas" },
  { code: "zh", name: "Chinese (Simplified)", nativeName: "中文 (简体)", flag: "🇨🇳", region: "Asia" },
  { code: "zh-TW", name: "Chinese (Traditional)", nativeName: "中文 (繁體)", flag: "🇹🇼", region: "Asia" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", region: "Asia" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", region: "Middle East" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩", region: "Asia" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇧🇷", region: "Americas/Europe" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺", region: "Europe/Asia" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", region: "Asia" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷", region: "Asia" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", region: "Europe/Africa" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", region: "Europe" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹", region: "Europe" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷", region: "Europe/Asia" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳", region: "Asia" },
  { code: "th", name: "Thai", nativeName: "ภาษาไทย", flag: "🇹🇭", region: "Asia" },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱", region: "Europe" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", flag: "🇺🇦", region: "Europe" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱", region: "Europe" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩", region: "Asia" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", flag: "🇲🇾", region: "Asia" },
  { code: "tl", name: "Filipino", nativeName: "Filipino", flag: "🇵🇭", region: "Asia" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "🇸🇪", region: "Europe" },
  { code: "da", name: "Danish", nativeName: "Dansk", flag: "🇩🇰", region: "Europe" },
  { code: "no", name: "Norwegian", nativeName: "Norsk", flag: "🇳🇴", region: "Europe" },
  { code: "fi", name: "Finnish", nativeName: "Suomi", flag: "🇫🇮", region: "Europe" },
  { code: "cs", name: "Czech", nativeName: "Čeština", flag: "🇨🇿", region: "Europe" },
  { code: "sk", name: "Slovak", nativeName: "Slovenčina", flag: "🇸🇰", region: "Europe" },
  { code: "ro", name: "Romanian", nativeName: "Română", flag: "🇷🇴", region: "Europe" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar", flag: "🇭🇺", region: "Europe" },
  { code: "el", name: "Greek", nativeName: "Ελληνικά", flag: "🇬🇷", region: "Europe" },
  { code: "he", name: "Hebrew", nativeName: "עברית", flag: "🇮🇱", region: "Middle East" },
  { code: "fa", name: "Persian", nativeName: "فارسی", flag: "🇮🇷", region: "Middle East" },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇵🇰", region: "Asia" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳", region: "Asia" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳", region: "Asia" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳", region: "Asia" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳", region: "Asia" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳", region: "Asia" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳", region: "Asia" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳", region: "Asia" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili", flag: "🇰🇪", region: "Africa" },
  { code: "am", name: "Amharic", nativeName: "አማርኛ", flag: "🇪🇹", region: "Africa" },
  { code: "yo", name: "Yoruba", nativeName: "Yorùbá", flag: "🇳🇬", region: "Africa" },
  { code: "ig", name: "Igbo", nativeName: "Igbo", flag: "🇳🇬", region: "Africa" },
  { code: "ha", name: "Hausa", nativeName: "Hausa", flag: "🇳🇬", region: "Africa" },
  { code: "zu", name: "Zulu", nativeName: "isiZulu", flag: "🇿🇦", region: "Africa" },
  { code: "xh", name: "Xhosa", nativeName: "isiXhosa", flag: "🇿🇦", region: "Africa" },
  { code: "af", name: "Afrikaans", nativeName: "Afrikaans", flag: "🇿🇦", region: "Africa" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली", flag: "🇳🇵", region: "Asia" },
  { code: "si", name: "Sinhala", nativeName: "සිංහල", flag: "🇱🇰", region: "Asia" },
  { code: "km", name: "Khmer", nativeName: "ខ្មែរ", flag: "🇰🇭", region: "Asia" },
  { code: "lo", name: "Lao", nativeName: "ລາວ", flag: "🇱🇦", region: "Asia" },
  { code: "my", name: "Burmese", nativeName: "မြန်မာဘာသာ", flag: "🇲🇲", region: "Asia" },
  { code: "ka", name: "Georgian", nativeName: "ქართული", flag: "🇬🇪", region: "Europe" },
  { code: "hy", name: "Armenian", nativeName: "Հայերdelays", flag: "🇦🇲", region: "Asia" },
  { code: "az", name: "Azerbaijani", nativeName: "Azərbaycan", flag: "🇦🇿", region: "Asia" },
  { code: "kk", name: "Kazakh", nativeName: "Қазақ", flag: "🇰🇿", region: "Asia" },
  { code: "uz", name: "Uzbek", nativeName: "O'zbek", flag: "🇺🇿", region: "Asia" },
  { code: "mn", name: "Mongolian", nativeName: "Монгол", flag: "🇲🇳", region: "Asia" },
  { code: "bg", name: "Bulgarian", nativeName: "Български", flag: "🇧🇬", region: "Europe" },
  { code: "sr", name: "Serbian", nativeName: "Српски", flag: "🇷🇸", region: "Europe" },
  { code: "hr", name: "Croatian", nativeName: "Hrvatski", flag: "🇭🇷", region: "Europe" },
  { code: "sl", name: "Slovenian", nativeName: "Slovenščina", flag: "🇸🇮", region: "Europe" },
  { code: "bs", name: "Bosnian", nativeName: "Bosanski", flag: "🇧🇦", region: "Europe" },
  { code: "mk", name: "Macedonian", nativeName: "Македонски", flag: "🇲🇰", region: "Europe" },
  { code: "sq", name: "Albanian", nativeName: "Shqip", flag: "🇦🇱", region: "Europe" },
  { code: "lv", name: "Latvian", nativeName: "Latviešu", flag: "🇱🇻", region: "Europe" },
  { code: "lt", name: "Lithuanian", nativeName: "Lietuvių", flag: "🇱🇹", region: "Europe" },
  { code: "et", name: "Estonian", nativeName: "Eesti", flag: "🇪🇪", region: "Europe" },
  { code: "mt", name: "Maltese", nativeName: "Malti", flag: "🇲🇹", region: "Europe" },
  { code: "is", name: "Icelandic", nativeName: "Íslenska", flag: "🇮🇸", region: "Europe" },
  { code: "ga", name: "Irish", nativeName: "Gaeilge", flag: "🇮🇪", region: "Europe" },
  { code: "cy", name: "Welsh", nativeName: "Cymraeg", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", region: "Europe" },
  { code: "eu", name: "Basque", nativeName: "Euskara", flag: "🇪🇸", region: "Europe" },
  { code: "ca", name: "Catalan", nativeName: "Català", flag: "🇪🇸", region: "Europe" },
  { code: "gl", name: "Galician", nativeName: "Galego", flag: "🇪🇸", region: "Europe" },
  { code: "eo", name: "Esperanto", nativeName: "Esperanto", flag: "🌍", region: "Global" },
  { code: "la", name: "Latin", nativeName: "Latina", flag: "🏛️", region: "Historical" },
  { code: "jv", name: "Javanese", nativeName: "Basa Jawa", flag: "🇮🇩", region: "Asia" },
  { code: "su", name: "Sundanese", nativeName: "Basa Sunda", flag: "🇮🇩", region: "Asia" },
  { code: "ceb", name: "Cebuano", nativeName: "Cebuano", flag: "🇵🇭", region: "Asia" },
  { code: "ht", name: "Haitian Creole", nativeName: "Kreyòl Ayisyen", flag: "🇭🇹", region: "Americas" },
  { code: "mg", name: "Malagasy", nativeName: "Malagasy", flag: "🇲🇬", region: "Africa" },
  { code: "so", name: "Somali", nativeName: "Soomaali", flag: "🇸🇴", region: "Africa" },
  { code: "rw", name: "Kinyarwanda", nativeName: "Kinyarwanda", flag: "🇷🇼", region: "Africa" },
  { code: "sn", name: "Shona", nativeName: "chiShona", flag: "🇿🇼", region: "Africa" },
  { code: "st", name: "Sesotho", nativeName: "Sesotho", flag: "🇱🇸", region: "Africa" },
  { code: "ny", name: "Chichewa", nativeName: "Chichewa", flag: "🇲🇼", region: "Africa" },
  { code: "ps", name: "Pashto", nativeName: "پښتو", flag: "🇦🇫", region: "Asia" },
  { code: "ku", name: "Kurdish", nativeName: "Kurdî", flag: "🇮🇶", region: "Middle East" },
  { code: "sd", name: "Sindhi", nativeName: "سنڌي", flag: "🇵🇰", region: "Asia" },
  { code: "ky", name: "Kyrgyz", nativeName: "Кыргызча", flag: "🇰🇬", region: "Asia" },
  { code: "tg", name: "Tajik", nativeName: "Тоҷикӣ", flag: "🇹🇯", region: "Asia" },
  { code: "tk", name: "Turkmen", nativeName: "Türkmen", flag: "🇹🇲", region: "Asia" },
  // Pacific Languages
  { code: "tpi", name: "Tok Pisin", nativeName: "Tok Pisin", flag: "🇵🇬", region: "Oceania" },
  { code: "bi", name: "Bislama", nativeName: "Bislama", flag: "🇻🇺", region: "Oceania" },
  { code: "fj", name: "Fijian", nativeName: "Vosa Vakaviti", flag: "🇫🇯", region: "Oceania" },
  { code: "sm", name: "Samoan", nativeName: "Gagana Sāmoa", flag: "🇼🇸", region: "Oceania" },
  { code: "to", name: "Tongan", nativeName: "Lea Faka-Tonga", flag: "🇹🇴", region: "Oceania" },
  { code: "mi", name: "Māori", nativeName: "Te Reo Māori", flag: "🇳🇿", region: "Oceania" },
  { code: "haw", name: "Hawaiian", nativeName: "ʻŌlelo Hawaiʻi", flag: "🇺🇸", region: "Oceania" },
];

export const getLanguageByCode = (code: string): Language | undefined => {
  return languages.find(lang => lang.code === code);
};

export const popularLanguages = languages.filter(lang => 
  ["en", "es", "zh", "hi", "ar", "fr", "de", "pt", "ru", "ja", "ko", "it"].includes(lang.code)
);

export const groupedByRegion = languages.reduce((acc, lang) => {
  if (!acc[lang.region]) {
    acc[lang.region] = [];
  }
  acc[lang.region].push(lang);
  return acc;
}, {} as Record<string, Language[]>);
