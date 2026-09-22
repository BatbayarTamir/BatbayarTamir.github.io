import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  Save,
  Check,
  Music,
  Sparkles,
  FileText,
  Copy,
  Download,
  RefreshCw,
  ExternalLink,
  Code2,
  ListMusic,
  BookOpen,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  FolderGit2,
} from 'lucide-react';
import {
  GirlfriendSiteConfig,
  Song,
  PolaroidMemory,
  Milestone,
  LoveCoupon,
  SanctuaryData,
} from '../types';
import { generateContentJson, generatePlaylistJson } from '../utils/contentResolver';

type ActiveTab = 'guide' | 'fullJson' | 'playlistJson' | 'quickEdit';

interface PersonalizeModalProps {
  config: GirlfriendSiteConfig;
  isOpen: boolean;
  onClose: () => void;
  onSaveConfig: (newConfig: GirlfriendSiteConfig) => void;
  playlist: Song[];
  memories: PolaroidMemory[];
  milestones: Milestone[];
  reasons: string[];
  coupons: LoveCoupon[];
  onReloadFromGitHub: () => Promise<boolean>;
  onApplyCustomJson?: (data: SanctuaryData) => void;
}

export const PersonalizeModal: React.FC<PersonalizeModalProps> = ({
  config,
  isOpen,
  onClose,
  onSaveConfig,
  playlist,
  memories,
  milestones,
  reasons,
  coupons,
  onReloadFromGitHub,
  onApplyCustomJson,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('guide');
  const [isCopiedFull, setIsCopiedFull] = useState(false);
  const [isCopiedPlaylist, setIsCopiedPlaylist] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [reloadStatus, setReloadStatus] = useState<'idle' | 'success' | 'failed'>('idle');

  // Editable JSON text state
  const [editableFullJson, setEditableFullJson] = useState('');
  const [editablePlaylistJson, setEditablePlaylistJson] = useState('');
  const [jsonParseError, setJsonParseError] = useState<string | null>(null);
  const [applySuccess, setApplySuccess] = useState(false);

  // Quick Edit form state
  const [formData, setFormData] = useState<GirlfriendSiteConfig>(config);
  const [formSaved, setFormSaved] = useState(false);

  // Sync JSON text representation when modal opens or props change
  useEffect(() => {
    if (isOpen) {
      const full = generateContentJson(config, playlist, memories, milestones, reasons, coupons);
      const pl = generatePlaylistJson(playlist);
      setEditableFullJson(full);
      setEditablePlaylistJson(pl);
      setFormData(config);
      setJsonParseError(null);
      setReloadStatus('idle');
      setApplySuccess(false);
    }
  }, [isOpen, config, playlist, memories, milestones, reasons, coupons]);

  if (!isOpen) return null;

  // Copy full content.json
  const handleCopyFullJson = async () => {
    try {
      await navigator.clipboard.writeText(editableFullJson);
      setIsCopiedFull(true);
      setTimeout(() => setIsCopiedFull(false), 2500);
    } catch {
      // Fallback
    }
  };

  // Download content.json file
  const handleDownloadFullJson = () => {
    const blob = new Blob([editableFullJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy playlist.json
  const handleCopyPlaylistJson = async () => {
    try {
      await navigator.clipboard.writeText(editablePlaylistJson);
      setIsCopiedPlaylist(true);
      setTimeout(() => setIsCopiedPlaylist(false), 2500);
    } catch {
      // Fallback
    }
  };

  // Download playlist.json file
  const handleDownloadPlaylistJson = () => {
    const blob = new Blob([editablePlaylistJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'playlist.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Live apply full JSON into app
  const handleApplyFullJson = () => {
    setJsonParseError(null);
    try {
      const parsed = JSON.parse(editableFullJson) as SanctuaryData;
      if (onApplyCustomJson) {
        onApplyCustomJson(parsed);
      }
      if (parsed.config) {
        onSaveConfig({ ...config, ...parsed.config });
        setFormData((prev) => ({ ...prev, ...parsed.config }));
      }
      setApplySuccess(true);
      setTimeout(() => setApplySuccess(false), 2500);
    } catch (err: unknown) {
      setJsonParseError(err instanceof Error ? err.message : 'Invalid JSON syntax');
    }
  };

  // Live apply playlist JSON into app
  const handleApplyPlaylistJson = () => {
    setJsonParseError(null);
    try {
      const parsed = JSON.parse(editablePlaylistJson) as Song[];
      if (Array.isArray(parsed) && onApplyCustomJson) {
        onApplyCustomJson({ playlist: parsed });
        setApplySuccess(true);
        setTimeout(() => setApplySuccess(false), 2500);
      } else {
        setJsonParseError('Playlist JSON must be an array of songs.');
      }
    } catch (err: unknown) {
      setJsonParseError(err instanceof Error ? err.message : 'Invalid JSON syntax');
    }
  };

  // Quick form save
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    // Refresh json
    const updatedFull = generateContentJson(formData, playlist, memories, milestones, reasons, coupons);
    setEditableFullJson(updatedFull);
    setFormSaved(true);
    setTimeout(() => setFormSaved(false), 2200);
  };

  // Reload from GitHub
  const handleReload = async () => {
    setIsReloading(true);
    setReloadStatus('idle');
    try {
      const success = await onReloadFromGitHub();
      setReloadStatus(success ? 'success' : 'failed');
    } catch {
      setReloadStatus('failed');
    } finally {
      setIsReloading(false);
      setTimeout(() => setReloadStatus('idle'), 4000);
    }
  };

  return (
    <div
      id="github-personalize-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl h-[92vh] max-h-[820px] rounded-3xl bg-white shadow-2xl flex flex-col border border-rose-200/90 overflow-hidden text-slate-800">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-rose-100 bg-gradient-to-r from-rose-50/70 via-white to-rose-50/70 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/25">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base sm:text-lg text-rose-950">
                  GitHub Content & Songs Manager
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Cross-Device Sync
                </span>
              </div>
              <p className="text-xs text-rose-700/80 font-medium">
                Customize songs, audio links, photos, and messages via GitHub JSON
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Reload from GitHub Button */}
            <button
              id="reload-from-github-btn"
              onClick={handleReload}
              disabled={isReloading}
              title="Force reload latest content.json from GitHub"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border shadow-xs ${
                reloadStatus === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : reloadStatus === 'failed'
                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                  : 'bg-white hover:bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReloading ? 'animate-spin text-rose-600' : ''}`} />
              <span className="hidden sm:inline">
                {isReloading
                  ? 'Checking GitHub...'
                  : reloadStatus === 'success'
                  ? 'Updated from GitHub!'
                  : reloadStatus === 'failed'
                  ? 'Offline / Default'
                  : 'Reload from GitHub'}
              </span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-rose-100/70 hover:bg-rose-200/80 text-rose-700 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 sm:px-7 py-2.5 bg-slate-50/80 border-b border-rose-100/80 overflow-x-auto no-scrollbar flex-shrink-0">
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'guide'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-rose-700 hover:bg-rose-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>How to Update via GitHub</span>
          </button>

          <button
            onClick={() => setActiveTab('fullJson')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'fullJson'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-rose-700 hover:bg-rose-50'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>content.json (All Data)</span>
          </button>

          <button
            onClick={() => setActiveTab('playlistJson')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'playlistJson'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-rose-700 hover:bg-rose-50'
            }`}
          >
            <ListMusic className="w-3.5 h-3.5" />
            <span>playlist.json (Songs)</span>
          </button>

          <button
            onClick={() => setActiveTab('quickEdit')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'quickEdit'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-rose-700 hover:bg-rose-50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Quick Text Editor</span>
          </button>
        </div>

        {/* Modal Main Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-6">
          {/* TAB 1: GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Highlight Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white shadow-md">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm sm:text-base">
                      Why customize through GitHub JSON?
                    </h4>
                    <p className="mt-1 text-xs sm:text-sm text-rose-100 leading-relaxed">
                      When you update <code className="bg-white/20 px-1.5 py-0.5 rounded text-white font-mono">public/content.json</code> in your repository, every device that visits the website (Sara's phone, your phone, iPad, laptop) immediately loads your songs, photos, and heartfelt words without needing any browser cache clearing.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3 Step Workflow */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs mb-2.5">
                    1
                  </div>
                  <h5 className="font-bold text-xs sm:text-sm text-slate-800">
                    Get the JSON
                  </h5>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    Click the <span className="font-semibold text-rose-600">content.json</span> tab above and click <strong>Copy JSON</strong> or <strong>Download</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs mb-2.5">
                    2
                  </div>
                  <h5 className="font-bold text-xs sm:text-sm text-slate-800">
                    Paste in GitHub
                  </h5>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    Go to your repository on GitHub, open <code className="text-rose-700 font-mono text-[11px]">public/content.json</code>, paste your changes, and commit.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs mb-2.5">
                    3
                  </div>
                  <h5 className="font-bold text-xs sm:text-sm text-slate-800">
                    Live on All Devices!
                  </h5>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    GitHub Pages will deploy your commit in 1 minute. Everyone visiting will see the updated songs and messages!
                  </p>
                </div>
              </div>

              {/* How to link songs */}
              <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200/70 space-y-3">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                  <Music className="w-4 h-4 text-rose-600" />
                  <span>How to Link Songs in content.json</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Inside <code className="font-mono text-rose-800">public/content.json</code> (or <code className="font-mono text-rose-800">public/playlist.json</code>), set the <code className="font-mono font-bold text-rose-800">"audioUrl"</code> property to either:
                </p>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-900 text-slate-100">
                    <p className="text-emerald-400 font-sans text-[11px] mb-1 font-semibold">
                      Option A: Place MP3 inside repository public/audio/ (Recommended)
                    </p>
                    <code className="text-yellow-300">"audioUrl": "./audio/song-1.mp3"</code>
                    <p className="text-slate-400 font-sans text-[10px] mt-1">
                      Upload your MP3 file to <code>public/audio/song-1.mp3</code> in GitHub.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 text-slate-100">
                    <p className="text-emerald-400 font-sans text-[11px] mb-1 font-semibold">
                      Option B: Direct Web Link (Google Drive direct, Catbox, Discord, or any URL)
                    </p>
                    <code className="text-yellow-300">"audioUrl": "https://example.com/my-song.mp3"</code>
                    <p className="text-slate-400 font-sans text-[10px] mt-1">
                      Any public direct audio URL ending in .mp3, .m4a, or .wav will play instantly.
                    </p>
                  </div>
                </div>
              </div>

              {/* How to link images */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                  <ImageIcon className="w-4 h-4 text-rose-600" />
                  <span>How to Link Polaroid Photos in content.json</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Inside the <code className="font-mono text-rose-800">"memories"</code> array in <code className="font-mono text-rose-800">content.json</code>, set the <code className="font-mono font-bold text-rose-800">"imageUrl"</code> property to:
                </p>
                <div className="p-3 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono">
                  <code className="text-yellow-300">"imageUrl": "./images/my-photo.jpg"</code>
                  <p className="text-slate-400 font-sans text-[10px] mt-1">
                    Or any web image URL: <code>"imageUrl": "https://images.unsplash.com/..."</code>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FULL CONTENT.JSON */}
          {activeTab === 'fullJson' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Complete Site Content (public/content.json)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Controls songs, audio URLs, letter text, polaroids, milestones, and 50 reasons.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyFullJson}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
                  >
                    {isCopiedFull ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopiedFull ? 'Copied to Clipboard!' : 'Copy content.json'}</span>
                  </button>

                  <button
                    onClick={handleDownloadFullJson}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={handleApplyFullJson}
                    title="Apply edits directly in browser to preview"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 text-xs font-semibold transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{applySuccess ? 'Preview Loaded!' : 'Live Preview'}</span>
                  </button>
                </div>
              </div>

              {jsonParseError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>JSON Syntax Error: {jsonParseError}</span>
                </div>
              )}

              {applySuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Preview loaded! Remember to copy and commit this into your GitHub repository!</span>
                </div>
              )}

              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-900">
                <textarea
                  id="full-content-json-textarea"
                  value={editableFullJson}
                  onChange={(e) => setEditableFullJson(e.target.value)}
                  rows={18}
                  spellCheck={false}
                  className="w-full p-4 font-mono text-xs sm:text-sm text-emerald-300 bg-transparent focus:outline-none leading-relaxed resize-y"
                />
              </div>
            </div>
          )}

          {/* TAB 3: PLAYLIST.JSON */}
          {activeTab === 'playlistJson' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Songs Only (public/playlist.json)
                  </h4>
                  <p className="text-xs text-slate-500">
                    For quickly updating song titles, artists, and audio links in your mixtape.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyPlaylistJson}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
                  >
                    {isCopiedPlaylist ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopiedPlaylist ? 'Copied to Clipboard!' : 'Copy playlist.json'}</span>
                  </button>

                  <button
                    onClick={handleDownloadPlaylistJson}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={handleApplyPlaylistJson}
                    title="Apply edits directly in browser to preview"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 text-xs font-semibold transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{applySuccess ? 'Playlist Loaded!' : 'Live Preview'}</span>
                  </button>
                </div>
              </div>

              {jsonParseError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>JSON Syntax Error: {jsonParseError}</span>
                </div>
              )}

              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-900">
                <textarea
                  id="playlist-json-textarea"
                  value={editablePlaylistJson}
                  onChange={(e) => setEditablePlaylistJson(e.target.value)}
                  rows={18}
                  spellCheck={false}
                  className="w-full p-4 font-mono text-xs sm:text-sm text-cyan-300 bg-transparent focus:outline-none leading-relaxed resize-y"
                />
              </div>
            </div>
          )}

          {/* TAB 4: QUICK TEXT FORM */}
          {activeTab === 'quickEdit' && (
            <form onSubmit={handleSaveForm} className="space-y-4 max-w-2xl mx-auto">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
                💡 <strong>Note:</strong> Changes saved here update your live session immediately. To make them permanent for all devices and visitors, switch to the <strong>content.json</strong> tab, copy the JSON, and commit it to GitHub.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Her Name
                  </label>
                  <input
                    type="text"
                    value={formData.herName}
                    onChange={(e) => setFormData({ ...formData, herName: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Her Nickname / Pet Name
                  </label>
                  <input
                    type="text"
                    value={formData.herNickname}
                    onChange={(e) => setFormData({ ...formData, herNickname: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name (Creator)
                  </label>
                  <input
                    type="text"
                    value={formData.hisName}
                    onChange={(e) => setFormData({ ...formData, hisName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Anniversary / Relationship Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.anniversaryDate}
                    onChange={(e) => setFormData({ ...formData, anniversaryDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Love Letter Title
                </label>
                <input
                  type="text"
                  value={formData.letterTitle}
                  onChange={(e) => setFormData({ ...formData, letterTitle: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Love Letter Body
                </label>
                <textarea
                  value={formData.letterBody}
                  onChange={(e) => setFormData({ ...formData, letterBody: e.target.value })}
                  rows={6}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Letter Signoff
                </label>
                <input
                  type="text"
                  value={formData.letterSignoff}
                  onChange={(e) => setFormData({ ...formData, letterSignoff: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-emerald-600 font-semibold">
                  {formSaved ? '✓ Saved to current session! Copy JSON to persist on GitHub.' : ''}
                </span>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Live Session</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-7 py-3 border-t border-rose-100 bg-slate-50 flex items-center justify-between flex-shrink-0 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Romantic Birthday Sanctuary • GitHub Sync Edition</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
