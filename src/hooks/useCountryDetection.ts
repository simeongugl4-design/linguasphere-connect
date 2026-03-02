import { useState, useEffect } from "react";
import { countryLanguageMap } from "@/lib/countryLanguages";

// Map timezone to country name
const timezoneToCountry: Record<string, string> = {
  "America/New_York": "United States",
  "America/Chicago": "United States",
  "America/Denver": "United States",
  "America/Los_Angeles": "United States",
  "America/Anchorage": "United States",
  "Pacific/Honolulu": "United States",
  "America/Toronto": "Canada",
  "America/Vancouver": "Canada",
  "America/Mexico_City": "Mexico",
  "America/Argentina/Buenos_Aires": "Argentina",
  "America/Sao_Paulo": "Brazil",
  "America/Bogota": "Colombia",
  "America/Lima": "Peru",
  "America/Santiago": "Chile",
  "America/Caracas": "Venezuela",
  "America/Havana": "Cuba",
  "America/Jamaica": "Jamaica",
  "America/Panama": "Panama",
  "America/Port-au-Prince": "Haiti",
  "America/Santo_Domingo": "Dominican Republic",
  "America/Costa_Rica": "Costa Rica",
  "America/El_Salvador": "El Salvador",
  "America/Guatemala": "Guatemala",
  "America/Tegucigalpa": "Honduras",
  "America/Managua": "Nicaragua",
  "America/Guyana": "Guyana",
  "America/Paramaribo": "Suriname",
  "America/Montevideo": "Uruguay",
  "America/Asuncion": "Paraguay",
  "America/La_Paz": "Bolivia",
  "Europe/London": "United Kingdom",
  "Europe/Paris": "France",
  "Europe/Berlin": "Germany",
  "Europe/Madrid": "Spain",
  "Europe/Rome": "Italy",
  "Europe/Amsterdam": "Netherlands",
  "Europe/Brussels": "Belgium",
  "Europe/Lisbon": "Portugal",
  "Europe/Vienna": "Austria",
  "Europe/Zurich": "Switzerland",
  "Europe/Stockholm": "Sweden",
  "Europe/Oslo": "Norway",
  "Europe/Copenhagen": "Denmark",
  "Europe/Helsinki": "Finland",
  "Europe/Warsaw": "Poland",
  "Europe/Prague": "Czech Republic",
  "Europe/Budapest": "Hungary",
  "Europe/Bucharest": "Romania",
  "Europe/Sofia": "Bulgaria",
  "Europe/Athens": "Greece",
  "Europe/Istanbul": "Turkey",
  "Europe/Moscow": "Russia",
  "Europe/Kiev": "Ukraine",
  "Europe/Minsk": "Belarus",
  "Europe/Dublin": "Ireland",
  "Europe/Belgrade": "Serbia",
  "Europe/Zagreb": "Croatia",
  "Europe/Ljubljana": "Slovenia",
  "Europe/Bratislava": "Slovakia",
  "Europe/Tallinn": "Estonia",
  "Europe/Riga": "Latvia",
  "Europe/Vilnius": "Lithuania",
  "Europe/Sarajevo": "Bosnia and Herzegovina",
  "Europe/Skopje": "North Macedonia",
  "Europe/Podgorica": "Montenegro",
  "Europe/Tirane": "Albania",
  "Europe/Chisinau": "Moldova",
  "Europe/Luxembourg": "Luxembourg",
  "Europe/Monaco": "Monaco",
  "Europe/Malta": "Malta",
  "Europe/Andorra": "Andorra",
  "Europe/Vaduz": "Liechtenstein",
  "Europe/San_Marino": "San Marino",
  "Europe/Vatican": "Vatican City",
  "Asia/Tokyo": "Japan",
  "Asia/Seoul": "South Korea",
  "Asia/Shanghai": "China",
  "Asia/Hong_Kong": "China",
  "Asia/Taipei": "Taiwan",
  "Asia/Kolkata": "India",
  "Asia/Karachi": "Pakistan",
  "Asia/Dhaka": "Bangladesh",
  "Asia/Bangkok": "Thailand",
  "Asia/Jakarta": "Indonesia",
  "Asia/Manila": "Philippines",
  "Asia/Kuala_Lumpur": "Malaysia",
  "Asia/Singapore": "Singapore",
  "Asia/Ho_Chi_Minh": "Vietnam",
  "Asia/Phnom_Penh": "Cambodia",
  "Asia/Vientiane": "Laos",
  "Asia/Yangon": "Myanmar",
  "Asia/Kathmandu": "Nepal",
  "Asia/Colombo": "Sri Lanka",
  "Asia/Kabul": "Afghanistan",
  "Asia/Tehran": "Iran",
  "Asia/Baghdad": "Iraq",
  "Asia/Riyadh": "Saudi Arabia",
  "Asia/Dubai": "United Arab Emirates",
  "Asia/Qatar": "Qatar",
  "Asia/Kuwait": "Kuwait",
  "Asia/Bahrain": "Bahrain",
  "Asia/Muscat": "Oman",
  "Asia/Amman": "Jordan",
  "Asia/Beirut": "Lebanon",
  "Asia/Jerusalem": "Israel",
  "Asia/Damascus": "Syria",
  "Asia/Baku": "Azerbaijan",
  "Asia/Tbilisi": "Georgia",
  "Asia/Yerevan": "Armenia",
  "Asia/Almaty": "Kazakhstan",
  "Asia/Bishkek": "Kyrgyzstan",
  "Asia/Tashkent": "Uzbekistan",
  "Asia/Dushanbe": "Tajikistan",
  "Asia/Ashgabat": "Turkmenistan",
  "Asia/Ulaanbaatar": "Mongolia",
  "Asia/Brunei": "Brunei",
  "Asia/Thimphu": "Bhutan",
  "Asia/Male": "Maldives",
  "Asia/Dili": "Timor-Leste",
  "Africa/Cairo": "Egypt",
  "Africa/Lagos": "Nigeria",
  "Africa/Nairobi": "Kenya",
  "Africa/Johannesburg": "South Africa",
  "Africa/Casablanca": "Morocco",
  "Africa/Algiers": "Algeria",
  "Africa/Tunis": "Tunisia",
  "Africa/Tripoli": "Libya",
  "Africa/Addis_Ababa": "Ethiopia",
  "Africa/Dar_es_Salaam": "Tanzania",
  "Africa/Kampala": "Uganda",
  "Africa/Accra": "Ghana",
  "Africa/Dakar": "Senegal",
  "Africa/Abidjan": "Ivory Coast",
  "Africa/Khartoum": "Sudan",
  "Africa/Maputo": "Mozambique",
  "Africa/Luanda": "Angola",
  "Africa/Kinshasa": "Congo (Republic of the)",
  "Africa/Douala": "Cameroon",
  "Africa/Harare": "Zimbabwe",
  "Africa/Lusaka": "Zambia",
  "Africa/Windhoek": "Namibia",
  "Africa/Gaborone": "Botswana",
  "Africa/Mogadishu": "Somalia",
  "Africa/Asmara": "Eritrea",
  "Africa/Djibouti": "Djibouti",
  "Indian/Antananarivo": "Madagascar",
  "Indian/Mauritius": "Mauritius",
  "Indian/Comoro": "Comoros",
  "Indian/Mahe": "Seychelles",
  "Australia/Sydney": "Australia",
  "Australia/Melbourne": "Australia",
  "Australia/Perth": "Australia",
  "Pacific/Auckland": "New Zealand",
  "Pacific/Fiji": "Fiji",
  "Pacific/Tongatapu": "Tonga",
  "Pacific/Apia": "Samoa",
  "Pacific/Port_Moresby": "Papua New Guinea",
  "Pacific/Tarawa": "Kiribati",
  "Pacific/Funafuti": "Tuvalu",
  "Pacific/Nauru": "Nauru",
  "Pacific/Majuro": "Marshall Islands",
  "Pacific/Palau": "Palau",
  "Pacific/Efate": "Vanuatu",
  "Pacific/Guadalcanal": "Solomon Islands",
  "Pacific/Pohnpei": "Micronesia",
};

// Also try to detect from navigator.language
const langToCountry: Record<string, string> = {
  "en-US": "United States", "en-GB": "United Kingdom", "en-AU": "Australia",
  "en-CA": "Canada", "en-NZ": "New Zealand", "en-IE": "Ireland",
  "fr-FR": "France", "fr-CA": "Canada", "fr-BE": "Belgium",
  "de-DE": "Germany", "de-AT": "Austria", "de-CH": "Switzerland",
  "es-ES": "Spain", "es-MX": "Mexico", "es-AR": "Argentina",
  "pt-BR": "Brazil", "pt-PT": "Portugal",
  "it-IT": "Italy", "ja-JP": "Japan", "ko-KR": "South Korea",
  "zh-CN": "China", "zh-TW": "Taiwan",
  "ar-SA": "Saudi Arabia", "ar-EG": "Egypt",
  "hi-IN": "India", "bn-BD": "Bangladesh",
  "ru-RU": "Russia", "uk-UA": "Ukraine",
  "pl-PL": "Poland", "nl-NL": "Netherlands",
  "sv-SE": "Sweden", "da-DK": "Denmark", "fi-FI": "Finland",
  "no-NO": "Norway", "tr-TR": "Turkey", "th-TH": "Thailand",
  "vi-VN": "Vietnam", "id-ID": "Indonesia", "ms-MY": "Malaysia",
  "tl-PH": "Philippines", "ro-RO": "Romania", "hu-HU": "Hungary",
  "cs-CZ": "Czech Republic", "el-GR": "Greece", "bg-BG": "Bulgaria",
  "hr-HR": "Croatia", "sk-SK": "Slovakia", "sl-SI": "Slovenia",
  "et-EE": "Estonia", "lv-LV": "Latvia", "lt-LT": "Lithuania",
  "he-IL": "Israel", "fa-IR": "Iran", "ur-PK": "Pakistan",
  "sw-KE": "Kenya", "am-ET": "Ethiopia",
};

export interface DetectedCountry {
  country: string;
  language: string;
  code: string;
  flag: string;
}

export function useCountryDetection() {
  const [detectedCountry, setDetectedCountry] = useState<DetectedCountry | null>(null);
  const [isDetecting, setIsDetecting] = useState(true);

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      let countryName = timezoneToCountry[tz];

      // Fallback: try navigator.language
      if (!countryName) {
        const lang = navigator.language;
        countryName = langToCountry[lang];
      }

      if (countryName && countryLanguageMap[countryName]) {
        const data = countryLanguageMap[countryName];
        setDetectedCountry({ country: countryName, ...data });
      }
    } catch (e) {
      console.warn("Country detection failed", e);
    } finally {
      setIsDetecting(false);
    }
  }, []);

  return { detectedCountry, isDetecting };
}
