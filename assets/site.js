'use strict';
// Presentation page: language toggle and installer links from the latest public release.
const REPO = 'alabastida/donghua-player-releases';
const RELEASES = `https://github.com/${REPO}/releases`;
const $ = id => document.getElementById(id);

const EN = {
  'nav.features': 'Features',
  'nav.screenshots': 'Screenshots',
  'nav.download': 'Download',
  'hero.eyebrow': 'Desktop app · Windows · macOS · Linux',
  'hero.title': 'Your donghua and anime, in one app',
  'hero.lead': 'Browse catalogs from several sources, open an episode and pick up where you left off. Your library stays on your computer.',
  'hero.download': 'Download',
  'hero.all': 'All downloads',
  'features.title': 'What you get',
  'f.sources.title': 'Four sources, one interface',
  'f.sources.text': 'Mundo Donghua, DonghuaStream, Lucifer Donghua and KickAssAnime, each with its catalog, search and latest episodes.',
  'f.continue.title': 'Continue watching',
  'f.continue.text': 'Library, followed series and history. Resume every series at the episode and minute where you stopped.',
  'f.player.title': 'A distraction-free player',
  'f.player.text': 'Previous and next episode, autoplay next, server switching, lights, wide mode and full screen.',
  'f.share.title': 'Shareable links',
  'f.share.text': 'Share a series or an episode with a link that opens it straight in the other person’s app.',
  'f.local.title': 'Your data stays with you',
  'f.local.text': 'No accounts and no sync. Follows and watched marks are kept in a local database on your computer.',
  'f.updates.title': 'Spanish and English, with updates',
  'f.updates.text': 'Switch language from the header. The app lets you know about new versions and updates when you confirm.',
  'shots.title': 'Screenshots',
  'shot.sources.alt': 'Source picker in the app header',
  'shot.home.alt': 'Donghua Player showing KickAssAnime episodes with Chinese audio',
  'shot.player.alt': 'Donghua Player’s player with a KickAssAnime episode',
  'shot.player.cap': 'The player fills the window. Switch servers from the top corner.',
  'shot.series.alt': 'A series page with its episode list',
  'shot.series.cap': 'Every series with its episode list and what you have already watched.',
  'shot.continue.alt': 'The Continue watching section of the library',
  'shot.continue.cap': 'Continue watching takes you back to the exact minute you left off.',
  'shot.lucifer.alt': 'The Lucifer Donghua catalog in the app',
  'shot.lucifer.cap': 'Each source keeps its own color, so you always know where you are.',
  'shot.actions.alt': 'The player’s actions panel',
  'shot.actions.cap': 'The actions panel groups navigation, watched marks and window settings.',
  'download.title': 'Download',
  'download.text': 'Free. Pick the installer for your system.',
  'download.releases': 'See downloads on GitHub',
  'download.for': 'Download for',
  'note.mac': 'macOS: Apple Silicon only. The app is not notarized by Apple; if macOS blocks the first launch, allow it in System Settings → Privacy & Security → Open Anyway.',
  'note.win': 'Windows: x64. SmartScreen may warn because the installer has no certificate; choose “More info” → “Run anyway”.',
  'note.linux': 'Linux: x64, AppImage (with built-in updates) or .deb.',
  'footer.disclaimer': 'Donghua Player is not affiliated with the sites it shows. Videos, ads and availability depend on each site.',
  'footer.releases': 'Versions and notes',
  version: 'Latest version',
};

const ES = {};
for (const el of document.querySelectorAll('[data-i18n]')) ES[el.dataset.i18n] = el.textContent;
for (const el of document.querySelectorAll('[data-i18n-alt]')) ES[el.dataset.i18nAlt] = el.alt;
ES['download.for'] = 'Descargar para';
ES.version = 'Última versión';

const INSTALLERS = [
  {os: 'windows', label: 'Windows', test: name => /_x64-setup\.exe$/.test(name)},
  {os: 'macos', label: 'macOS (Apple Silicon)', test: name => /\.dmg$/.test(name)},
  {os: 'linux', label: 'Linux AppImage', test: name => /\.AppImage$/.test(name)},
  {os: 'linux', label: 'Linux .deb', test: name => /\.deb$/.test(name)},
];

let lang = 'es', release = null;

function platform() {
  const value = (navigator.userAgentData?.platform || navigator.userAgent || '').toLowerCase();
  if (value.includes('win')) return 'windows';
  if (value.includes('mac')) return 'macos';
  if (value.includes('linux') || value.includes('x11')) return 'linux';
  return '';
}

function t(key) { return (lang === 'en' ? EN : ES)[key] ?? ES[key] ?? key; }

function link(text, href, className) {
  const a = document.createElement('a');
  a.className = className;
  a.href = href;
  a.rel = 'noreferrer';
  a.textContent = text;
  return a;
}

function renderDownloads() {
  if (!release) return;
  const os = platform(), links = [];
  for (const installer of INSTALLERS) {
    const asset = release.assets.find(a => installer.test(a.name));
    if (asset) links.push({...installer, href: asset.browser_download_url});
  }
  if (!links.length) return;
  links.sort((a, b) => (b.os === os) - (a.os === os));
  $('downloads').replaceChildren(...links.map((l, i) => link(l.label, l.href, 'button' + (i === 0 && l.os === os ? ' recommended' : ''))));
  const mine = links.find(l => l.os === os);
  const primary = $('primary-download');
  if (mine) {
    primary.href = mine.href;
    primary.textContent = `${t('download.for')} ${mine.label}`;
  }
  $('version').textContent = `${t('version')}: ${release.tag_name.replace(/^v/, '')}`;
}

function applyLanguage(next) {
  lang = next;
  document.documentElement.lang = lang;
  for (const el of document.querySelectorAll('[data-i18n]')) el.textContent = t(el.dataset.i18n);
  for (const el of document.querySelectorAll('[data-i18n-alt]')) el.alt = t(el.dataset.i18nAlt);
  $('lang').textContent = lang === 'en' ? 'ES' : 'EN';
  renderDownloads();
}

async function loadRelease() {
  try {
    const response = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=5`, {headers: {Accept: 'application/vnd.github+json'}});
    if (!response.ok) throw Error(String(response.status));
    release = (await response.json()).find(r => !r.draft) || null;
    renderDownloads();
  } catch {
    // Keep the static link to the releases page.
  }
}

function main() {
  let saved = null;
  try { saved = localStorage.getItem('lang'); } catch {}
  const preferred = saved || ((navigator.language || '').toLowerCase().startsWith('es') ? 'es' : 'en');
  applyLanguage(preferred === 'en' ? 'en' : 'es');
  $('lang').onclick = () => {
    applyLanguage(lang === 'en' ? 'es' : 'en');
    try { localStorage.setItem('lang', lang); } catch {}
  };
  loadRelease();
}

main();
