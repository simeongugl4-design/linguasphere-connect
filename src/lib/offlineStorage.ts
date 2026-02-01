// Offline storage utilities for translations and language packs
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface TranslationCache {
  id: string;
  sourceText: string;
  sourceLanguage: string;
  targetLanguage: string;
  translatedText: string;
  timestamp: number;
}

interface LanguagePack {
  code: string;
  name: string;
  phrases: Record<string, string>;
  downloadedAt: number;
}

interface OfflineDB extends DBSchema {
  translations: {
    key: string;
    value: TranslationCache;
    indexes: {
      'by-timestamp': number;
    };
  };
  languagePacks: {
    key: string;
    value: LanguagePack;
  };
  pendingTranslations: {
    key: string;
    value: {
      id: string;
      text: string;
      sourceLanguage: string;
      targetLanguage: string;
      timestamp: number;
    };
  };
}

const DB_NAME = 'linguaone-offline';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<OfflineDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<OfflineDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<OfflineDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Translations cache store
      if (!db.objectStoreNames.contains('translations')) {
        const translationsStore = db.createObjectStore('translations', {
          keyPath: 'id',
        });
        translationsStore.createIndex('by-timestamp', 'timestamp');
      }

      // Language packs store
      if (!db.objectStoreNames.contains('languagePacks')) {
        db.createObjectStore('languagePacks', {
          keyPath: 'code',
        });
      }

      // Pending translations for sync
      if (!db.objectStoreNames.contains('pendingTranslations')) {
        db.createObjectStore('pendingTranslations', {
          keyPath: 'id',
        });
      }
    },
  });

  return dbInstance;
}

// Generate cache key from translation params
function getCacheKey(sourceText: string, sourceLanguage: string, targetLanguage: string): string {
  return `${sourceLanguage}:${targetLanguage}:${sourceText.toLowerCase().trim()}`;
}

// Cache a translation
export async function cacheTranslation(
  sourceText: string,
  sourceLanguage: string,
  targetLanguage: string,
  translatedText: string
): Promise<void> {
  const db = await getDB();
  const id = getCacheKey(sourceText, sourceLanguage, targetLanguage);

  await db.put('translations', {
    id,
    sourceText,
    sourceLanguage,
    targetLanguage,
    translatedText,
    timestamp: Date.now(),
  });

  // Clean up old entries (keep last 1000)
  await cleanupOldTranslations();
}

// Get cached translation
export async function getCachedTranslation(
  sourceText: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string | null> {
  const db = await getDB();
  const id = getCacheKey(sourceText, sourceLanguage, targetLanguage);
  const cached = await db.get('translations', id);
  return cached?.translatedText || null;
}

// Clean up old translations (keep last 1000)
async function cleanupOldTranslations(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('translations', 'readwrite');
  const store = tx.objectStore('translations');

  const allEntries = await store.getAll();
  if (allEntries.length > 1000) {
    // Sort by timestamp and get oldest entries to delete
    allEntries.sort((a, b) => a.timestamp - b.timestamp);
    const entriesToDelete = allEntries.slice(0, allEntries.length - 1000);
    for (const entry of entriesToDelete) {
      await store.delete(entry.id);
    }
  }

  await tx.done;
}

// Download and save a language pack
export async function downloadLanguagePack(
  code: string,
  name: string,
  phrases: Record<string, string>
): Promise<void> {
  const db = await getDB();
  await db.put('languagePacks', {
    code,
    name,
    phrases,
    downloadedAt: Date.now(),
  });
}

// Get a downloaded language pack
export async function getLanguagePack(code: string): Promise<LanguagePack | null> {
  const db = await getDB();
  const pack = await db.get('languagePacks', code);
  return pack || null;
}

// Get all downloaded language packs
export async function getAllLanguagePacks(): Promise<LanguagePack[]> {
  const db = await getDB();
  return db.getAll('languagePacks');
}

// Delete a language pack
export async function deleteLanguagePack(code: string): Promise<void> {
  const db = await getDB();
  await db.delete('languagePacks', code);
}

// Add pending translation for later sync
export async function addPendingTranslation(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string> {
  const db = await getDB();
  const id = crypto.randomUUID();
  await db.put('pendingTranslations', {
    id,
    text,
    sourceLanguage,
    targetLanguage,
    timestamp: Date.now(),
  });
  return id;
}

// Get all pending translations
export async function getPendingTranslations(): Promise<
  Array<{
    id: string;
    text: string;
    sourceLanguage: string;
    targetLanguage: string;
    timestamp: number;
  }>
> {
  const db = await getDB();
  return db.getAll('pendingTranslations');
}

// Remove a pending translation
export async function removePendingTranslation(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('pendingTranslations', id);
}

// Check if we're online
export function isOnline(): boolean {
  return navigator.onLine;
}

// Get cache statistics
export async function getCacheStats(): Promise<{
  translationCount: number;
  languagePackCount: number;
  pendingCount: number;
}> {
  const db = await getDB();
  const [translations, languagePacks, pending] = await Promise.all([
    db.count('translations'),
    db.count('languagePacks'),
    db.count('pendingTranslations'),
  ]);
  return {
    translationCount: translations,
    languagePackCount: languagePacks,
    pendingCount: pending,
  };
}

// Clear all cached data
export async function clearAllCache(): Promise<void> {
  const db = await getDB();
  await Promise.all([
    db.clear('translations'),
    db.clear('pendingTranslations'),
  ]);
}
