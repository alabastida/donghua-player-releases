# Donghua Player

Desktop app to browse and watch donghua (Chinese animation) from several streaming sites in one place, with your own local library. Interface in Spanish and English.

Download the installers from [Releases](https://github.com/alabastida/donghua-player-releases/releases). This repository only hosts installers and signed update manifests; the source code is private.

## Sources

| Source | Site | Notes |
|---|---|---|
| Mundo Donghua | mundodonghua.com | Remembers the last server you picked |
| DonghuaStream | donghuastream.org | |
| Lucifer Donghua | luciferdonghua.in | Premium-only episodes are hidden or flagged |
| Mister Donghua | misterdonghua.com | |
| KickAssAnime | kaa.lt | Language versions (subbed, dubbed, Chinese audio) |
| Series Donghua | seriesdonghua.com | Complete, verified episode lists |
| DonghuaLife | donghualife.com | Every season in one list; VIP episodes hidden |
| TioDonghua | tiodonghua.lat | The site's own player and server picker; VIP servers hidden |
| Donghua World | donghuaworld.com | Dailymotion or the site's own player, both with saved progress |

Each source keeps its own color, catalog, search, followed series and history.

## Features

- **Browse** each site's home, latest episodes, full catalog, A–Z lists and search, with the app's own pager.
- **Series pages** with the episode list, sort order, filter and a marker on the last episode you played.
- **Your library, on your computer**: Continue watching, followed series with a check for new episodes, history, and watched marks (all at once when the list is verified complete).
- **Progress and resume** on supported players (Dailymotion, Rumble and each site's own player where available); other servers play normally and you mark episodes yourself.
- **Auto-advance** to the next episode and optional autoplay when opening one.
- **Series start and end**: start every episode of a series after its intro and stop before the credits.
- **A clean player**: only the video is shown; known ad overlays and fake "not a robot" ads are removed. Real verification screens from a video host are left alone.
- **Player controls**: server menu, previous/next episode, lights off, wide mode, fit the window to the video, fullscreen, and keyboard shortcuts (Space, N, P, F, W).
- **Shareable links** (`donghuaplayer://`) that open a series or episode straight in the app.
- **In-app updates**: new versions are offered inside the app and verified by signature before installing.

The app does not host or download video; it shows each site's original player. Availability, ads and video quality depend on the sites.

## Platforms

| Platform | Package |
|---|---|
| Windows x64 | NSIS installer `.exe` |
| macOS Apple Silicon | `.dmg` / `.app.zip` |
| Linux x64 | `.AppImage` (in-app updates) and `.deb` |

The first version with in-app updates needs a manual install; later versions are offered inside the app. Installers are not code-signed by Apple or Microsoft: macOS may ask you to confirm opening the app, and Windows may show a reputation warning. Update packages are signed, and every release lists `SHA256SUMS.txt`.

Your library stays on your computer. There are no accounts and no sync.

## Reporting a problem

Include your system, app version, source, episode and server. Please don't attach your library database or any credentials.
