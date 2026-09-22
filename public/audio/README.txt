=======================================================
HOW TO MAKE SONGS PLAY ON ALL DEVICES (PHONES, TABLETS, COMPUTERS)
=======================================================

When your website is visited from other devices (like your girlfriend's phone at https://BatbayarTamir.github.io), the browser loads files directly from your GitHub repository.

To have your songs play on any device in the world:

Option 1: Put your MP3 files in this folder (public/audio/):
- song-1.mp3          -> Dear My Feelings
- song-waiting.mp3    -> Waiting for you
- song-5.mp3          -> Lofi Starry Night
- song-nexz.mp3       -> mchk mchk
- song-saucin.mp3     -> Saucin

Then commit and push your repository to GitHub:
  git add public/audio/
  git commit -m "Add songs for all devices"
  git push origin main

Option 2: Direct Audio Links (Cloud URLs):
In the website, click "Customize Sanctuary" (top right) -> Songs -> edit any song -> paste a direct MP3 web link (Dropbox, Google Drive direct, Catbox, Discord, or any web MP3 link). It will instantly play on all devices!
