import { Song } from '../types';
import { romanticAudio } from './audioSynthesizer';

/**
 * Utility to resolve, auto-discover, and verify audio file URLs across devices.
 * Enables custom songs uploaded or committed to the repository to play seamlessly
 * on other devices, phones, and computers visiting the site.
 */

// Cache of verified song audio URLs in the current session
const verifiedAudioCache = new Map<string, string>();

/**
 * Check whether a URL returns HTTP 200/206
 */
export async function checkAudioUrlReachable(url: string, timeoutMs = 2500): Promise<boolean> {
  // Local blob URLs are valid only on the device where they were created
  if (url.startsWith('blob:')) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      return res.ok;
    } catch {
      return false;
    }
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timer);
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Generate candidate URLs where an audio file might be placed in the repository or CDN.
 */
function getCandidateUrls(song: Song): string[] {
  const candidates: string[] = [];

  // 1. If song already has an external audio URL (e.g. https://... or ./audio/...)
  if (song.audioUrl && !song.audioUrl.startsWith('blob:')) {
    candidates.push(song.audioUrl);
  }

  // 2. Relative paths inside public/audio/ (standard bundled static location)
  candidates.push(`./audio/${song.id}.mp3`);
  candidates.push(`./audio/${song.id}.m4a`);
  candidates.push(`./audio/${song.id}.wav`);
  candidates.push(`./audio/${song.id}.ogg`);

  // 3. Normalized title filename inside public/audio/
  const titleSlug = song.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').trim();
  if (titleSlug) {
    candidates.push(`./audio/${titleSlug}.mp3`);
    candidates.push(`./audio/${titleSlug}.m4a`);
  }

  // 4. Custom uploaded filename if known
  if (song.fileName) {
    candidates.push(`./audio/${song.fileName}`);
    candidates.push(`./resources/audio/${song.fileName}`);
  }

  // 5. Relative paths inside resources/audio/
  candidates.push(`./resources/audio/${song.id}.mp3`);
  candidates.push(`./resources/audio/${song.id}.m4a`);

  // 6. Direct GitHub raw content URLs from the user's public repository
  const ghOwner = 'BatbayarTamir';
  const ghRepo = 'BatbayarTamir.github.io';
  candidates.push(`https://raw.githubusercontent.com/${ghOwner}/${ghRepo}/main/public/audio/${song.id}.mp3`);
  candidates.push(`https://raw.githubusercontent.com/${ghOwner}/${ghRepo}/main/resources/audio/${song.id}.mp3`);
  if (song.fileName) {
    candidates.push(`https://raw.githubusercontent.com/${ghOwner}/${ghRepo}/main/resources/audio/${encodeURIComponent(song.fileName)}`);
  }

  return Array.from(new Set(candidates));
}

/**
 * Auto-discover the best working audio URL for a song.
 */
export async function resolveSongAudioUrl(song: Song): Promise<string | undefined> {
  // If cached and verified
  if (verifiedAudioCache.has(song.id)) {
    return verifiedAudioCache.get(song.id);
  }

  // If already has a valid non-blob URL, test it first
  if (song.audioUrl && !song.audioUrl.startsWith('blob:')) {
    const isReachable = await checkAudioUrlReachable(song.audioUrl, 2000);
    if (isReachable) {
      verifiedAudioCache.set(song.id, song.audioUrl);
      return song.audioUrl;
    }
  }

  // Probe candidates
  const candidates = getCandidateUrls(song);
  for (const url of candidates) {
    const isReachable = await checkAudioUrlReachable(url, 1500);
    if (isReachable) {
      verifiedAudioCache.set(song.id, url);
      return url;
    }
  }

  return undefined;
}

/**
 * Fetch and load the global shared playlist manifest (`playlist.json`) from the repository
 * if it exists in public/playlist.json.
 */
export async function fetchPublishedPlaylistManifest(): Promise<Partial<Song>[] | null> {
  const possiblePaths = ['./playlist.json', './audio/playlist.json'];
  for (const path of possiblePaths) {
    try {
      const res = await fetch(path, { cache: 'no-cache' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch {
      // Continue to next path
    }
  }
  return null;
}

/**
 * Unlock mobile audio playback on the very first touch/click interaction on mobile browsers.
 * Crucial for iOS Safari and Android Chrome compatibility.
 */
export function setupMobileAudioUnlock() {
  if (typeof window === 'undefined') return;

  let unlocked = false;
  const unlock = () => {
    if (unlocked) return;
    unlocked = true;
    romanticAudio.unlockMobile();
    window.removeEventListener('touchstart', unlock, true);
    window.removeEventListener('touchend', unlock, true);
    window.removeEventListener('click', unlock, true);
  };

  window.addEventListener('touchstart', unlock, { capture: true, passive: true });
  window.addEventListener('touchend', unlock, { capture: true, passive: true });
  window.addEventListener('click', unlock, { capture: true, passive: true });
}
