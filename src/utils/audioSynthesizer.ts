/**
 * Web Audio API Romantic Melodic Synthesizer
 * Generates soothing, romantic chord progressions, dreamy piano chimes,
 * and ambient acoustic harmonies with a real-time Audio Analyser for visualizers.
 */

class RomanticAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: GainNode | AnalyserNode | null = null;
  private isPlaying = false;
  private currentTrackId = '';
  private currentCustomUrl: string | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private mediaSourceNode: MediaElementAudioSourceNode | null = null;
  private timerId: number | null = null;
  private step = 0;
  private volume = 0.7;
  private isMuted = false;

  // Track chord patterns [frequencies in Hz]
  private trackPatterns: Record<string, { chords: number[][]; tempo: number; instrument: 'rhodes' | 'bell' | 'strings' | 'piano' }> = {
    'song-1': {
      // IVE - Dear My Feelings (Dreamy Romantic K-pop loop: Fmaj7 -> Em7 -> Dm7 -> Cmaj7)
      chords: [
        [349.23, 440.0, 523.25, 659.25], // Fmaj7
        [329.63, 392.0, 493.88, 587.33], // Em7
        [293.66, 349.23, 440.0, 523.25], // Dm7
        [261.63, 329.63, 392.0, 493.88], // Cmaj7
        [349.23, 440.0, 523.25, 698.46], // Fadd9
        [392.0, 493.88, 587.33, 698.46], // G7
      ],
      tempo: 450,
      instrument: 'piano',
    },
    'song-waiting': {
      // Alex G - Waiting for you (Warm bittersweet indie progression: G -> Bm7 -> Cmaj7 -> Cm6)
      chords: [
        [196.0, 246.94, 293.66, 392.0], // G
        [246.94, 293.66, 369.99, 440.0], // Bm7
        [261.63, 329.63, 392.0, 493.88], // Cmaj7
        [261.63, 311.13, 392.0, 440.0], // Cm6
      ],
      tempo: 460,
      instrument: 'piano',
    },
    'song-5': {
      // Lofi Starry Night (Music box chime arpeggio)
      chords: [
        [523.25, 659.25, 783.99, 1046.5],
        [440.0, 523.25, 659.25, 880.0],
        [349.23, 440.0, 523.25, 698.46],
        [392.0, 493.88, 587.33, 783.99],
      ],
      tempo: 400,
      instrument: 'bell',
    },
    'song-nexz': {
      // NEXZ - mchk mchk (High energy electric synth chords & punchy bass groove)
      chords: [
        [146.83, 293.66, 440.0, 587.33], // Dm punch
        [174.61, 349.23, 523.25, 698.46], // F beat
        [164.81, 329.63, 493.88, 659.25], // Em pulse
        [196.00, 392.00, 587.33, 783.99], // G hype
      ],
      tempo: 260,
      instrument: 'rhodes',
    },
    'song-saucin': {
      // NEXZ - Saucin (Funky upbeat bounce groove: Bb -> Dm -> Gm -> Ebmaj7)
      chords: [
        [233.08, 293.66, 349.23, 466.16], // Bb funk
        [220.00, 261.63, 329.63, 440.00], // Dm groove
        [196.00, 233.08, 293.66, 392.00], // Gm bounce
        [155.56, 233.08, 293.66, 349.23], // Eb sauce
      ],
      tempo: 275,
      instrument: 'rhodes',
    },
  };

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      const analyserNode = this.ctx.createAnalyser();
      analyserNode.fftSize = 64;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      gain.connect(analyserNode);
      analyserNode.connect(this.ctx.destination);

      this.masterGain = gain;
      this.analyser = analyserNode;
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public unlockMobile() {
    try {
      this.initContext();
      if (!this.audioElement) {
        this.audioElement = new Audio();
        this.audioElement.loop = true;
      }
      // Play and pause an empty/silent cycle to unlock iOS Safari
      const unlockAudio = new Audio();
      unlockAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
      unlockAudio.volume = 0.01;
      unlockAudio.play().then(() => {
        unlockAudio.pause();
      }).catch(() => {
        // Silently ignore if blocked
      });
    } catch (e) {
      console.debug('Mobile audio unlock note:', e);
    }
  }

  public playTrack(trackId: string, customAudioUrl?: string) {
    this.initContext();
    this.stop();

    this.currentTrackId = trackId;
    this.currentCustomUrl = customAudioUrl || null;
    this.isPlaying = true;

    if (customAudioUrl) {
      this.playCustomAudio(customAudioUrl);
    } else {
      this.playSynthesizerTrack(trackId);
    }
  }

  private playCustomAudio(url: string) {
    try {
      if (!this.audioElement) {
        this.audioElement = new Audio();
        this.audioElement.loop = true;
      }

      // Detach any previous error listener
      this.audioElement.onerror = null;

      // Handle loading failure (e.g. cross-origin restriction, 404, or mobile codec)
      this.audioElement.onerror = () => {
        console.warn(`Could not load custom audio from ${url}, falling back to melodic synth track.`);
        if (this.isPlaying && this.currentTrackId) {
          this.playSynthesizerTrack(this.currentTrackId);
        }
      };

      this.audioElement.src = url;
      this.audioElement.volume = this.isMuted ? 0 : this.volume;

      // Connect to Web Audio Analyser if same-origin or CORS supported
      const isLocalOrSameOrigin = !url.startsWith('http') || url.startsWith(window.location.origin) || url.startsWith('blob:');
      if (isLocalOrSameOrigin && this.ctx && this.masterGain && !this.mediaSourceNode) {
        try {
          this.audioElement.crossOrigin = 'anonymous';
          this.mediaSourceNode = this.ctx.createMediaElementSource(this.audioElement);
          this.mediaSourceNode.connect(this.masterGain);
          this.audioElement.volume = 1;
        } catch (e) {
          console.debug('Direct audio routing active (MediaElementSource bypassed):', e);
        }
      }

      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio playback paused until user interaction:', err);
          // Auto fallback to synthesizer if audio element was blocked
        });
      }
    } catch (e) {
      console.error('Failed to play custom MP3:', e);
      if (this.currentTrackId) {
        this.playSynthesizerTrack(this.currentTrackId);
      }
    }
  }

  private playSynthesizerTrack(trackId: string) {
    if (this.audioElement) {
      this.audioElement.pause();
    }

    this.step = 0;
    const pattern = this.trackPatterns[trackId] || this.trackPatterns['song-1'];
    
    // Play immediately first note
    this.tick(pattern);

    this.timerId = window.setInterval(() => {
      this.tick(pattern);
    }, pattern.tempo);
  }

  private tick(pattern: { chords: number[][]; instrument: string }) {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    const chordIndex = Math.floor(this.step / 4) % pattern.chords.length;
    const noteInChord = this.step % 4;
    const chord = pattern.chords[chordIndex];
    const freq = chord[noteInChord] || chord[0];

    this.playNote(freq, pattern.instrument as 'rhodes' | 'bell' | 'piano');

    // Add bass root note on beat 0
    if (noteInChord === 0) {
      this.playBassNote(chord[0] / 2);
    }

    this.step = (this.step + 1) % (pattern.chords.length * 4);
  }

  private playNote(freq: number, instrument: 'rhodes' | 'bell' | 'piano') {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    if (instrument === 'bell') {
      osc.type = 'sine';
      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.exponentialRampToValueAtTime(0.28, now + 0.04);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      osc.frequency.setValueAtTime(freq * 1.5, now);
    } else if (instrument === 'rhodes') {
      osc.type = 'triangle';
      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.exponentialRampToValueAtTime(0.35, now + 0.06);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);
      osc.frequency.setValueAtTime(freq, now);
    } else {
      // Warm piano
      osc.type = 'sine';
      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.exponentialRampToValueAtTime(0.32, now + 0.05);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);
      osc.frequency.setValueAtTime(freq, now);

      // Subtle harmonic overtone for warmth
      const overtone = this.ctx.createOscillator();
      const overGain = this.ctx.createGain();
      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(freq * 2, now);
      overGain.gain.setValueAtTime(0.08, now);
      overGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      overtone.connect(overGain);
      overGain.connect(this.masterGain);
      overtone.start(now);
      overtone.stop(now + 0.45);
    }

    osc.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 1.3);
  }

  private playBassNote(freq: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const bassOsc = this.ctx.createOscillator();
    const bassGain = this.ctx.createGain();
    bassOsc.type = 'sine';
    bassOsc.frequency.setValueAtTime(freq, now);

    bassGain.gain.setValueAtTime(0.001, now);
    bassGain.gain.exponentialRampToValueAtTime(0.3, now + 0.1);
    bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

    bassOsc.connect(bassGain);
    bassGain.connect(this.masterGain);

    bassOsc.start(now);
    bassOsc.stop(now + 1.8);
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.audioElement) {
      this.audioElement.pause();
    }
  }

  public resume() {
    this.initContext();
    if (this.currentCustomUrl && this.audioElement) {
      this.isPlaying = true;
      this.audioElement.play().catch((err) => console.log('Resume audio error:', err));
    } else if (this.currentTrackId) {
      this.playTrack(this.currentTrackId, this.currentCustomUrl || undefined);
    } else {
      this.playTrack('song-1');
    }
  }

  public stop() {
    this.pause();
    this.step = 0;
    if (this.audioElement) {
      this.audioElement.currentTime = 0;
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
    if (this.audioElement && !this.mediaSourceNode) {
      this.audioElement.volume = this.isMuted ? 0 : this.volume;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const target = this.isMuted ? 0 : this.volume;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
    }
    if (this.audioElement && !this.mediaSourceNode) {
      this.audioElement.volume = this.isMuted ? 0 : this.volume;
    }
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getCurrentTrackId(): string {
    return this.currentTrackId;
  }

  public getAnalyserData(): Uint8Array | null {
    if (!this.analyser || !(this.analyser instanceof AnalyserNode)) return null;
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);

    // If audio is playing but analyser frequency is quiet (e.g. cross-origin/mediaElement buffer), synthesize equalizer motion
    let hasSignal = false;
    for (let i = 0; i < dataArray.length; i++) {
      if (dataArray[i] > 0) {
        hasSignal = true;
        break;
      }
    }

    if (!hasSignal && this.isPlaying) {
      const time = Date.now() * 0.006;
      for (let i = 0; i < dataArray.length; i++) {
        dataArray[i] = Math.floor(70 + 60 * Math.sin(time + i * 0.45));
      }
    }

    return dataArray;
  }
}

export const romanticAudio = new RomanticAudioEngine();
