/**
 * IndexedDB storage utility for saving and retrieving custom user MP3 audio files.
 * Provides durable local persistence for audio blobs across browser reloads.
 */

const DB_NAME = 'GirlfriendSanctuaryAudioDB';
const DB_VERSION = 1;
const STORE_NAME = 'song_audios';

interface StoredAudioRecord {
  songId: string;
  blob: Blob;
  fileName: string;
  fileSize: number;
  mimeType: string;
  updatedAt: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'songId' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Failed to open IndexedDB'));
  });
}

/**
 * Save an audio file blob for a song
 */
export async function saveAudioFile(
  songId: string,
  file: File | Blob,
  fileName: string
): Promise<string> {
  try {
    const db = await openDB();
    const record: StoredAudioRecord = {
      songId,
      blob: file,
      fileName,
      fileSize: file.size,
      mimeType: file.type || 'audio/mpeg',
      updatedAt: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(record);

      req.onsuccess = () => {
        const objectUrl = URL.createObjectURL(file);
        resolve(objectUrl);
      };

      req.onerror = () => reject(req.error || new Error('Failed to store audio file'));
    });
  } catch (err) {
    console.warn('IndexedDB write failed, falling back to temporary ObjectURL:', err);
    return URL.createObjectURL(file);
  }
}

/**
 * Load all stored audio files and return mapping of songId -> { objectUrl, fileName, fileSize }
 */
export async function loadAllSavedAudios(): Promise<
  Record<string, { audioUrl: string; fileName: string; fileSize: number; blob: Blob }>
> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        const records: StoredAudioRecord[] = req.result || [];
        const result: Record<
          string,
          { audioUrl: string; fileName: string; fileSize: number; blob: Blob }
        > = {};

        for (const rec of records) {
          if (rec.blob) {
            result[rec.songId] = {
              audioUrl: URL.createObjectURL(rec.blob),
              fileName: rec.fileName || 'custom-audio.mp3',
              fileSize: rec.fileSize || rec.blob.size,
              blob: rec.blob,
            };
          }
        }
        resolve(result);
      };

      req.onerror = () => reject(req.error || new Error('Failed to retrieve audio files'));
    });
  } catch (err) {
    console.warn('IndexedDB read failed:', err);
    return {};
  }
}

/**
 * Remove stored audio for a song
 */
export async function removeSavedAudio(songId: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(songId);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error || new Error('Failed to delete audio file'));
    });
  } catch (err) {
    console.warn('IndexedDB delete failed:', err);
  }
}
