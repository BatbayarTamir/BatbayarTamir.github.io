# Romantic Birthday Sanctuary 💖

A romantic, interactive birthday celebration web application built with React, TypeScript, Tailwind CSS, Lucide icons, and Motion animations.

## Features

- **Love Mixtape & Cassette Player**: Vinyl and cassette player with customizable playlist and audio upload.
- **Sealed Love Letter**: Interactive wax-sealed envelope that opens to reveal a handwritten letter.
- **Polaroid Photo Memories**: Interactive 3D flip photo cards with customizable photos and sweet notes on the back.
- **Our Journey Milestones**: Timeline of your relationship chapters with custom icons and stories.
- **Reasons Why I Love You**: Animated cards celebrating all the reasons she is cherished.
- **Love Coupons**: Interactive redeemable coupons for hugs, dates, back rubs, and breakfast in bed.
- **Birthday Cake & Sky Lanterns**: Blow out virtual candles and release sky lanterns into the starry night sky.

---

## 🌐 Publishing to BatbayarTamir.github.io

This project is fully configured for **GitHub Pages** user site hosting at `https://BatbayarTamir.github.io`.

### How GitHub Pages User Sites Work
In GitHub, when you create a repository named `<your-username>.github.io` (specifically `BatbayarTamir.github.io`), GitHub automatically designates it as your primary user website, served at:
**`https://BatbayarTamir.github.io`**

### Steps to Deploy

1. **Create the GitHub Repository**:
   - Go to [GitHub New Repository](https://github.com/new).
   - Name the repository **`BatbayarTamir.github.io`** (make it Public).

2. **Enable GitHub Actions for Pages**:
   - Go to your repository on GitHub: `https://github.com/BatbayarTamir/BatbayarTamir.github.io`.
   - Click **Settings** → **Pages** (in the left sidebar).
   - Under **Build and deployment** → **Source**, change the dropdown to **GitHub Actions**.

3. **Push this project to GitHub**:
   Run the following commands in your terminal from this project root:

   ```bash
   # Initialize git repository
   git init

   # Stage and commit all files
   git add .
   git commit -m "Deploy Romantic Sanctuary to BatbayarTamir.github.io"

   # Set branch to main and link to your repo
   git branch -M main
   git remote add origin https://github.com/BatbayarTamir/BatbayarTamir.github.io.git

   # Push to deploy!
   git push -u origin main --force
   ```

4. **Automatic Deployment**:
   - The included workflow file (`.github/workflows/deploy.yml`) will automatically trigger, build the Vite app, and publish it to GitHub Pages.
   - Within 1–2 minutes, open your browser and navigate to:
     👉 **`https://BatbayarTamir.github.io`**

### ⚠️ Troubleshooting: Got `(Line: 2, Col: 1): Unexpected value 'git init...'`?
If you see this error, you pasted the terminal commands (`git init ...`) into the **GitHub website file editor** (such as editing `.github/workflows/deploy.yml` or creating a new workflow on github.com).
- Terminal commands like `git init` must be run in your computer's **Terminal / PowerShell** inside the project folder.
- If you are editing `.github/workflows/deploy.yml` on GitHub.com, that file must only contain **YAML** (see `.github/workflows/deploy.yml`).

---

## 🚀 GitHub Repository Synchronization (Uploads to /resources/)

This project is built to be completely compatible with GitHub repositories and can upload files (polaroid photos, songs) directly into your repository's `/resources/` folder.

### How It Works

1. In the application, open the **Creator Control Panel** (press <kbd>~</kbd>, <kbd>Ctrl+P</kbd>, or click the vinyl center 3 times).
2. Navigate to the **GitHub Sync** tab.
3. Enter your repository settings:
   - **Repository Owner / Username**: e.g., `your-username`
   - **Repository Name**: e.g., `romantic-sanctuary`
   - **Branch**: `main` (or whichever branch you use)
   - **Target Folder**: `resources` (or any custom folder like `assets`)
   - **Personal Access Token (PAT)**: A GitHub token with `repo` or `Contents (Read and write)` permissions.
4. Click **Test Repository Access** to verify the connection.
5. Once configured and enabled:
   - Every uploaded Polaroid memory photo is automatically committed directly to `resources/photos/<filename>`.
   - Every uploaded song MP3 is automatically committed directly to `resources/audio/<filename>`.
   - Local IndexedDB storage continues to cache the files for instant preview and offline playback.

### Environment Variable Setup (Optional)

You can also pre-configure your GitHub repository credentials in `.env`:

```bash
VITE_GITHUB_TOKEN="your_personal_access_token"
VITE_GITHUB_OWNER="your_username"
VITE_GITHUB_REPO="your_repo_name"
VITE_GITHUB_BRANCH="main"
VITE_GITHUB_RESOURCES_PATH="resources"
```
