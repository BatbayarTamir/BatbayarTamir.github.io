/**
 * IndexedDB storage utility for saving and retrieving custom Polaroid memory images.
 * Provides durable persistence for user-uploaded photo blobs across browser reloads.
 */

const DB_NAME = 'GirlfriendSanctuaryImageDB';
const DB_VERSION = 1;
const STORE_NAME = 'polaroid_images';

interface StoredImageRecord {
  memoryId: string;
  blob: Blob;
  fileName: string;
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
        db.createObjectStore(STORE_NAME, { keyPath: 'memoryId' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Failed to open Image IndexedDB'));
  });
}

/**
 * Save a custom image file for a polaroid memory.
 * Returns an Object URL pointing to the stored image.
 */
export async function savePolaroidImage(
  memoryId: string,
  file: File | Blob,
  fileName: string = 'memory.jpg'
): Promise<string> {
  try {
    const db = await openDB();
    const record: StoredImageRecord = {
      memoryId,
      blob: file,
      fileName,
      mimeType: file.type || 'image/jpeg',
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

      req.onerror = () => reject(req.error || new Error('Failed to store polaroid image'));
    });
  } catch (err) {
    console.warn('IndexedDB write failed for image, falling back to temporary URL:', err);
    return URL.createObjectURL(file);
  }
}

/**
 * Load all stored polaroid images and return mapping of memoryId -> objectUrl
 */
export async function loadAllSavedPolaroidImages(): Promise<Record<string, string>> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => {
        const records: StoredImageRecord[] = req.result || [];
        const result: Record<string, string> = {};

        for (const rec of records) {
          if (rec.blob) {
            try {
              result[rec.memoryId] = URL.createObjectURL(rec.blob);
            } catch (e) {
              console.warn(`Could not create object URL for memory ${rec.memoryId}:`, e);
            }
          }
        }

        resolve(result);
      };

      req.onerror = () => reject(req.error || new Error('Failed to load stored images'));
    });
  } catch (err) {
    console.warn('IndexedDB read failed for images:', err);
    return {};
  }
}

/**
 * Remove stored polaroid image
 */
export async function removeSavedPolaroidImage(memoryId: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(memoryId);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error || new Error('Failed to delete polaroid image'));
    });
  } catch (err) {
    console.warn('IndexedDB delete failed for image:', err);
  }
}
