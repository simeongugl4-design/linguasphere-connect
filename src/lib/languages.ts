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
   { code: "hy", name: "Armenian", nativeName: "Հայdelays", flag: "🇦🇲", region: "Asia" },
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
   { code: "jv", name: "Javanese", nativeName: "Basa Jawa", flag: "🇮🇩", region: "Southeast Asia" },
   { code: "su", name: "Sundanese", nativeName: "Basa Sunda", flag: "🇮🇩", region: "Southeast Asia" },
   { code: "ceb", name: "Cebuano", nativeName: "Cebuano", flag: "🇵🇭", region: "Southeast Asia" },
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
   
   // Pacific & Oceania Languages
   { code: "tpi", name: "Tok Pisin", nativeName: "Tok Pisin", flag: "🇵🇬", region: "Oceania" },
   { code: "bi", name: "Bislama", nativeName: "Bislama", flag: "🇻🇺", region: "Oceania" },
   { code: "fj", name: "Fijian", nativeName: "Vosa Vakaviti", flag: "🇫🇯", region: "Oceania" },
   { code: "sm", name: "Samoan", nativeName: "Gagana Sāmoa", flag: "🇼🇸", region: "Oceania" },
   { code: "to", name: "Tongan", nativeName: "Lea Faka-Tonga", flag: "🇹🇴", region: "Oceania" },
   { code: "mi", name: "Māori", nativeName: "Te Reo Māori", flag: "🇳🇿", region: "Oceania" },
   { code: "haw", name: "Hawaiian", nativeName: "ʻŌlelo Hawaiʻi", flag: "🇺🇸", region: "Oceania" },
   { code: "mh", name: "Marshallese", nativeName: "Kajin M̧ajeļ", flag: "🇲🇭", region: "Oceania" },
   { code: "pau", name: "Palauan", nativeName: "a tekoi er a Belau", flag: "🇵🇼", region: "Oceania" },
   { code: "ch", name: "Chamorro", nativeName: "Chamoru", flag: "🇬🇺", region: "Oceania" },
   { code: "ty", name: "Tahitian", nativeName: "Reo Tahiti", flag: "🇵🇫", region: "Oceania" },
   { code: "tet", name: "Tetum", nativeName: "Tetun", flag: "🇹🇱", region: "Oceania" },
   { code: "gil", name: "Gilbertese", nativeName: "Taetae ni Kiribati", flag: "🇰🇮", region: "Oceania" },
   { code: "tvl", name: "Tuvaluan", nativeName: "Te Ggana Tuuvalu", flag: "🇹🇻", region: "Oceania" },
   { code: "niu", name: "Niuean", nativeName: "Vagahau Niuē", flag: "🇳🇺", region: "Oceania" },
   { code: "rar", name: "Cook Islands Māori", nativeName: "Te reo Māori Kūki 'Āirani", flag: "🇨🇰", region: "Oceania" },
   
   // Additional African Languages
   { code: "ti", name: "Tigrinya", nativeName: "ትግርኛ", flag: "🇪🇷", region: "Africa" },
   { code: "om", name: "Oromo", nativeName: "Afaan Oromoo", flag: "🇪🇹", region: "Africa" },
   { code: "rn", name: "Kirundi", nativeName: "Ikirundi", flag: "🇧🇮", region: "Africa" },
   { code: "lg", name: "Luganda", nativeName: "Luganda", flag: "🇺🇬", region: "Africa" },
   { code: "ln", name: "Lingala", nativeName: "Lingála", flag: "🇨🇩", region: "Africa" },
   { code: "wo", name: "Wolof", nativeName: "Wolof", flag: "🇸🇳", region: "Africa" },
   { code: "ff", name: "Fula", nativeName: "Fulfulde", flag: "🇸🇳", region: "Africa" },
   { code: "bm", name: "Bambara", nativeName: "Bamanankan", flag: "🇲🇱", region: "Africa" },
   { code: "ee", name: "Ewe", nativeName: "Eʋegbe", flag: "🇬🇭", region: "Africa" },
   { code: "tw", name: "Twi", nativeName: "Twi", flag: "🇬🇭", region: "Africa" },
   { code: "ak", name: "Akan", nativeName: "Akan", flag: "🇬🇭", region: "Africa" },
   { code: "ts", name: "Tsonga", nativeName: "Xitsonga", flag: "🇿🇦", region: "Africa" },
   { code: "tn", name: "Tswana", nativeName: "Setswana", flag: "🇧🇼", region: "Africa" },
   { code: "ve", name: "Venda", nativeName: "Tshivenḓa", flag: "🇿🇦", region: "Africa" },
   { code: "ss", name: "Swati", nativeName: "siSwati", flag: "🇸🇿", region: "Africa" },
   { code: "nr", name: "Ndebele", nativeName: "isiNdebele", flag: "🇿🇦", region: "Africa" },
   { code: "nso", name: "Northern Sotho", nativeName: "Sesotho sa Leboa", flag: "🇿🇦", region: "Africa" },
   { code: "kab", name: "Kabyle", nativeName: "Taqbaylit", flag: "🇩🇿", region: "Africa" },
   { code: "ber", name: "Berber", nativeName: "ⵜⴰⵎⴰⵣⵉⵖⵜ", flag: "🇲🇦", region: "Africa" },
   
   // Additional Middle East Languages
   { code: "ckb", name: "Central Kurdish", nativeName: "کوردی", flag: "🇮🇶", region: "Middle East" },
   { code: "kmr", name: "Northern Kurdish", nativeName: "Kurmancî", flag: "🇹🇷", region: "Middle East" },
   { code: "arz", name: "Egyptian Arabic", nativeName: "مصري", flag: "🇪🇬", region: "Middle East" },
   { code: "apc", name: "Levantine Arabic", nativeName: "شامي", flag: "🇱🇧", region: "Middle East" },
   { code: "acq", name: "Gulf Arabic", nativeName: "خليجي", flag: "🇦🇪", region: "Middle East" },
   { code: "arq", name: "Algerian Arabic", nativeName: "دارجة", flag: "🇩🇿", region: "Middle East" },
   { code: "ary", name: "Moroccan Arabic", nativeName: "الدارجة", flag: "🇲🇦", region: "Middle East" },
   { code: "dv", name: "Dhivehi", nativeName: "ދިވެހި", flag: "🇲🇻", region: "Asia" },
   
   // Additional Southeast Asian Languages
   { code: "ace", name: "Acehnese", nativeName: "Bahsa Acèh", flag: "🇮🇩", region: "Southeast Asia" },
   { code: "ban", name: "Balinese", nativeName: "Basa Bali", flag: "🇮🇩", region: "Southeast Asia" },
   { code: "min", name: "Minangkabau", nativeName: "Baso Minangkabau", flag: "🇮🇩", region: "Southeast Asia" },
   { code: "bjn", name: "Banjar", nativeName: "Bahasa Banjar", flag: "🇮🇩", region: "Southeast Asia" },
   { code: "ilo", name: "Ilocano", nativeName: "Ilokano", flag: "🇵🇭", region: "Southeast Asia" },
   { code: "pam", name: "Kapampangan", nativeName: "Kapampangan", flag: "🇵🇭", region: "Southeast Asia" },
   { code: "hil", name: "Hiligaynon", nativeName: "Hiligaynon", flag: "🇵🇭", region: "Southeast Asia" },
   { code: "war", name: "Waray", nativeName: "Winaray", flag: "🇵🇭", region: "Southeast Asia" },
   { code: "bik", name: "Bikol", nativeName: "Bikol", flag: "🇵🇭", region: "Southeast Asia" },
   { code: "pag", name: "Pangasinan", nativeName: "Pangasinán", flag: "🇵🇭", region: "Southeast Asia" },
   { code: "shan", name: "Shan", nativeName: "ၵႂၢမ်းတႆး", flag: "🇲🇲", region: "Southeast Asia" },
   { code: "kac", name: "Kachin", nativeName: "Jingpho", flag: "🇲🇲", region: "Southeast Asia" },
   { code: "mnw", name: "Mon", nativeName: "ဘာသာမန်", flag: "🇲🇲", region: "Southeast Asia" },
   
   // Additional European Languages
   { code: "be", name: "Belarusian", nativeName: "Беларуская", flag: "🇧🇾", region: "Europe" },
   { code: "gd", name: "Scottish Gaelic", nativeName: "Gàidhlig", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", region: "Europe" },
   { code: "kw", name: "Cornish", nativeName: "Kernewek", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", region: "Europe" },
   { code: "gv", name: "Manx", nativeName: "Gaelg", flag: "🇮🇲", region: "Europe" },
   { code: "br", name: "Breton", nativeName: "Brezhoneg", flag: "🇫🇷", region: "Europe" },
   { code: "oc", name: "Occitan", nativeName: "Occitan", flag: "🇫🇷", region: "Europe" },
   { code: "co", name: "Corsican", nativeName: "Corsu", flag: "🇫🇷", region: "Europe" },
   { code: "sc", name: "Sardinian", nativeName: "Sardu", flag: "🇮🇹", region: "Europe" },
   { code: "fur", name: "Friulian", nativeName: "Furlan", flag: "🇮🇹", region: "Europe" },
   { code: "lad", name: "Ladino", nativeName: "Judeo-Español", flag: "🇮🇱", region: "Europe" },
   { code: "rm", name: "Romansh", nativeName: "Rumantsch", flag: "🇨🇭", region: "Europe" },
   { code: "lb", name: "Luxembourgish", nativeName: "Lëtzebuergesch", flag: "🇱🇺", region: "Europe" },
   { code: "fy", name: "Frisian", nativeName: "Frysk", flag: "🇳🇱", region: "Europe" },
   { code: "fo", name: "Faroese", nativeName: "Føroyskt", flag: "🇫🇴", region: "Europe" },
   { code: "se", name: "Northern Sami", nativeName: "Davvisámegiella", flag: "🇳🇴", region: "Europe" },
   
   // Americas Indigenous Languages
   { code: "qu", name: "Quechua", nativeName: "Runasimi", flag: "🇵🇪", region: "Americas" },
   { code: "ay", name: "Aymara", nativeName: "Aymar aru", flag: "🇧🇴", region: "Americas" },
   { code: "gn", name: "Guarani", nativeName: "Avañe'ẽ", flag: "🇵🇾", region: "Americas" },
   { code: "nah", name: "Nahuatl", nativeName: "Nāhuatl", flag: "🇲🇽", region: "Americas" },
   { code: "yua", name: "Yucatec Maya", nativeName: "Maaya T'aan", flag: "🇲🇽", region: "Americas" },
   { code: "chr", name: "Cherokee", nativeName: "ᏣᎳᎩ ᎦᏬᏂᎯᏍᏗ", flag: "🇺🇸", region: "Americas" },
   { code: "nv", name: "Navajo", nativeName: "Diné bizaad", flag: "🇺🇸", region: "Americas" },
   { code: "oj", name: "Ojibwe", nativeName: "ᐊᓂᔑᓈᐯᒧᐎᓐ", flag: "🇨🇦", region: "Americas" },
   { code: "cr", name: "Cree", nativeName: "ᓀᐦᐃᔭᐍᐏᐣ", flag: "🇨🇦", region: "Americas" },
   { code: "iu", name: "Inuktitut", nativeName: "ᐃᓄᒃᑎᑐᑦ", flag: "🇨🇦", region: "Americas" },
   { code: "kl", name: "Greenlandic", nativeName: "Kalaallisut", flag: "🇬🇱", region: "Americas" },
 ];
 
 export const getLanguageByCode = (code: string): Language | undefined => {
   return languages.find(lang => lang.code === code);
 };
 
 export const popularLanguages = languages.filter(lang => 
   ["en", "es", "zh", "hi", "ar", "fr", "de", "pt", "ru", "ja", "ko", "it", "tpi", "sw", "vi", "id"].includes(lang.code)
 );
 
 export const groupedByRegion = languages.reduce((acc, lang) => {
   if (!acc[lang.region]) {
     acc[lang.region] = [];
   }
   acc[lang.region].push(lang);
   return acc;
 }, {} as Record<string, Language[]>);
 
 // Get total language count
 export const totalLanguages = languages.length;
 
 // Get all unique regions
 export const allRegions = [...new Set(languages.map(lang => lang.region))];