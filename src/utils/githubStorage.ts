/**
 * Utility to upload files directly to a GitHub repository's `resources` directory
 * using the GitHub REST API (PUT /repos/{owner}/{repo}/contents/{path}).
 *
 * Supports both:
 * 1. Environment variables (VITE_GITHUB_TOKEN, VITE_GITHUB_OWNER, VITE_GITHUB_REPO, etc.)
 * 2. In-browser configuration stored in localStorage (can be edited in the Creator panel)
 */

import { GitHubConfig, GitHubUploadResult } from '../types';

const STORAGE_KEY = 'girlfriend_github_config';

/**
 * Retrieve GitHub configuration, merging environment variables with localStorage values.
 */
export function getGitHubConfig(): GitHubConfig {
  const envToken = (import.meta.env.VITE_GITHUB_TOKEN as string | undefined) || '';
  const envOwner = (import.meta.env.VITE_GITHUB_OWNER as string | undefined) || 'BatbayarTamir';
  const envRepo = (import.meta.env.VITE_GITHUB_REPO as string | undefined) || 'BatbayarTamir.github.io';
  const envBranch = (import.meta.env.VITE_GITHUB_BRANCH as string | undefined) || 'main';
  const envResourcesPath = (import.meta.env.VITE_GITHUB_RESOURCES_PATH as string | undefined) || 'resources';

  let localConfig: Partial<GitHubConfig> = {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      localConfig = JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to parse stored GitHub config', e);
  }

  const token = localConfig.token ?? envToken;
  let owner = (localConfig.owner ?? envOwner).trim();
  if (!owner || owner === 'Good0211V2') {
    owner = 'BatbayarTamir';
  }
  let repo = (localConfig.repo ?? envRepo).trim();
  if (!repo || repo === 'Good0211V2.github.io') {
    repo = 'BatbayarTamir.github.io';
  }
  const branch = localConfig.branch ?? envBranch;
  const resourcesPath = (localConfig.resourcesPath ?? envResourcesPath).replace(/^\/+|\/+$/g, '') || 'resources';

  const hasCredentials = Boolean(token.trim() && owner.trim() && repo.trim());
  const enabled = localConfig.enabled !== undefined ? localConfig.enabled : hasCredentials;

  return {
    enabled,
    token: token.trim(),
    owner: owner.trim(),
    repo: repo.trim(),
    branch: branch.trim() || 'main',
    resourcesPath,
  };
}

/**
 * Save GitHub configuration to localStorage.
 */
export function saveGitHubConfig(config: GitHubConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.warn('Failed to save GitHub config to localStorage', e);
  }
}

/**
 * Helper to convert Blob or File into base64 string (without the data URL prefix).
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // result format: data:mime/type;base64,xxxx
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error || new Error('FileReader failed'));
    reader.readAsDataURL(blob);
  });
}

/**
 * Check if a file already exists at the given path in GitHub to obtain its SHA (for update).
 */
async function getExistingFileSha(
  owner: string,
  repo: string,
  path: string,
  branch: string,
  token: string
): Promise<string | undefined> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      return data.sha;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

/**
 * Sanitize filename for safe git path
 */
function sanitizeFileName(fileName: string): string {
  return fileName
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '');
}

/**
 * Upload a file directly to the GitHub repository's `resources` directory.
 *
 * @param file The File or Blob to upload
 * @param fileName Name of the file (e.g. "photo-1.jpg", "sweet-song.mp3")
 * @param subfolder Optional subfolder inside resources, e.g. "photos" or "audio"
 * @param commitMessage Custom commit message
 */
export async function uploadFileToGitHub(
  file: File | Blob,
  fileName: string,
  subfolder?: 'photos' | 'audio' | string,
  commitMessage?: string
): Promise<GitHubUploadResult> {
  const config = getGitHubConfig();

  if (!config.enabled || !config.token || !config.owner || !config.repo) {
    return {
      success: false,
      error: 'GitHub repository sync is not configured or disabled.',
    };
  }

  const cleanFileName = sanitizeFileName(fileName) || `resource-${Date.now()}`;
  const basePath = config.resourcesPath.replace(/^\/+|\/+$/g, '');
  const cleanSubfolder = subfolder ? subfolder.replace(/^\/+|\/+$/g, '') : '';
  const fullPath = cleanSubfolder ? `${basePath}/${cleanSubfolder}/${cleanFileName}` : `${basePath}/${cleanFileName}`;

  try {
    const base64Content = await blobToBase64(file);
    const existingSha = await getExistingFileSha(
      config.owner,
      config.repo,
      fullPath,
      config.branch,
      config.token
    );

    const message = commitMessage || `Upload ${cleanFileName} to ${basePath} via sanctuary web app`;

    const body: Record<string, unknown> = {
      message,
      content: base64Content,
      branch: config.branch,
    };
    if (existingSha) {
      body.sha = existingSha;
    }

    const response = await fetch(
      `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${fullPath}`,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `Bearer ${config.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({ message: response.statusText }));
      return {
        success: false,
        error: `GitHub API error (${response.status}): ${errJson.message || response.statusText}`,
      };
    }

    const resData = await response.json();
    const downloadUrl = resData.content?.download_url || `https://raw.githubusercontent.com/${config.owner}/${config.repo}/${config.branch}/${fullPath}`;
    const htmlUrl = resData.content?.html_url || `https://github.com/${config.owner}/${config.repo}/blob/${config.branch}/${fullPath}`;

    return {
      success: true,
      url: htmlUrl,
      rawUrl: downloadUrl,
      path: fullPath,
      commitSha: resData.commit?.sha,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network error while uploading to GitHub',
    };
  }
}

/**
 * Verify GitHub repository access & credentials.
 */
export async function testGitHubConnection(config: GitHubConfig): Promise<{ success: boolean; message: string }> {
  if (!config.token.trim()) {
    return { success: false, message: 'Please provide a GitHub Personal Access Token (PAT).' };
  }
  if (!config.owner.trim() || !config.repo.trim()) {
    return { success: false, message: 'Please enter repository owner and repository name.' };
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${config.owner}/${config.repo}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${config.token}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        return { success: false, message: 'Invalid or expired GitHub Personal Access Token (401 Unauthorized).' };
      }
      if (res.status === 404) {
        return { success: false, message: `Repository "${config.owner}/${config.repo}" was not found or the token lacks access (404).` };
      }
      const data = await res.json().catch(() => ({}));
      return { success: false, message: `GitHub error (${res.status}): ${data.message || res.statusText}` };
    }

    const repoData = await res.json();
    const permissions = repoData.permissions;
    if (permissions && permissions.push === false) {
      return {
        success: false,
        message: `Token has read access to "${config.owner}/${config.repo}", but write/push permission is required to upload files to resources.`,
      };
    }

    return {
      success: true,
      message: `Connected successfully to "${repoData.full_name}" (Default branch: ${repoData.default_branch || config.branch})! Push permissions confirmed.`,
    };
  } catch (err: any) {
    return { success: false, message: `Could not connect to GitHub: ${err.message || 'Network error'}` };
  }
}
