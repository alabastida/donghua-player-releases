'use strict';
// Shared link landing page. The payload lives in the fragment (never sent to the server):
//   #/<provider id>/<site path and query>  ->  donghuaplayer://open/<provider id>/<site path and query>
const SCHEME = 'donghuaplayer';
const REPO = 'alabastida/donghua-player-releases';
const PROVIDERS = {
  mundodonghua: {name: 'Mundo Donghua', origin: 'https://www.mundodonghua.com'},
  donghuastream: {name: 'DonghuaStream', origin: 'https://donghuastream.org'},
  luciferdonghua: {name: 'Lucifer Donghua', origin: 'https://luciferdonghua.in'},
  kickassanime: {name: 'KickAssAnime', origin: 'https://kaa.lt'},
};
const MAX_LENGTH = 2000;
const $ = id => document.getElementById(id);

function parse(hash) {
  const raw = hash.replace(/^#/, '');
  if (!raw || raw.length > MAX_LENGTH) return null;
  const match = /^\/([a-z]+)(\/.*)?$/.exec(raw);
  if (!match || !Object.hasOwn(PROVIDERS, match[1])) return null;
  const provider = PROVIDERS[match[1]], rest = match[2] || '/';
  let site;
  try { site = new URL(rest, provider.origin); } catch { return null; }
  if (site.origin !== provider.origin || site.username || site.password) return null;
  const route = site.pathname + site.search;
  return {id: match[1], provider, site: site.href, app: `${SCHEME}://open/${match[1]}${route}`};
}

function openApp(link) {
  let left = false;
  const mark = () => { left = true; };
  window.addEventListener('blur', mark, {once: true});
  document.addEventListener('visibilitychange', mark, {once: true});
  location.href = link.app;
  setTimeout(() => {
    if (left) return;
    $('fallback-title').textContent = '¿No se abrió la app?';
    $('fallback-text').textContent = 'Si no tienes Donghua Player, descárgalo e instálalo, y vuelve a abrir este link. Mientras tanto puedes verlo en el sitio original.';
  }, 2000);
}

function platform() {
  const value = (navigator.userAgentData?.platform || navigator.userAgent || '').toLowerCase();
  if (value.includes('win')) return 'windows';
  if (value.includes('mac')) return 'macos';
  if (value.includes('linux') || value.includes('x11')) return 'linux';
  return '';
}

const INSTALLERS = [
  {os: 'windows', label: 'Windows', test: name => /_x64-setup\.exe$/.test(name)},
  {os: 'macos', label: 'macOS (Apple Silicon)', test: name => /\.dmg$/.test(name)},
  {os: 'linux', label: 'Linux AppImage', test: name => /\.AppImage$/.test(name)},
  {os: 'linux', label: 'Linux .deb', test: name => /\.deb$/.test(name)},
];

function downloadLink(label, href, recommended, text = recommended ? `Descargar para ${label}` : label) {
  const a = document.createElement('a');
  a.className = 'download' + (recommended ? ' recommended' : '');
  a.href = href;
  a.rel = 'noreferrer';
  a.textContent = text;
  return a;
}

async function loadDownloads() {
  const box = $('downloads'), releases = `https://github.com/${REPO}/releases`;
  try {
    const response = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=5`, {headers: {Accept: 'application/vnd.github+json'}});
    if (!response.ok) throw Error(String(response.status));
    const release = (await response.json()).find(r => !r.draft);
    if (!release) throw Error('no release');
    const os = platform(), links = [];
    for (const installer of INSTALLERS) {
      const asset = release.assets.find(a => installer.test(a.name));
      if (asset) links.push({...installer, href: asset.browser_download_url});
    }
    if (!links.length) throw Error('no assets');
    links.sort((a, b) => (b.os === os) - (a.os === os));
    box.replaceChildren(...links.map((l, i) => downloadLink(l.label, l.href, i === 0 && l.os === os)));
  } catch {
    box.replaceChildren(downloadLink('', releases, true, 'Ver descargas'));
  }
}

function main() {
  const link = parse(location.hash);
  if (link) {
    document.documentElement.dataset.provider = link.id;
    $('title').textContent = 'Te compartieron algo';
    $('subtitle').textContent = 'Ábrelo en Donghua Player';
    $('provider').textContent = link.provider.name;
    $('path').textContent = link.site;
    $('target').hidden = false;
    $('open').onclick = () => openApp(link);
    const original = $('original');
    original.href = link.site;
    original.hidden = false;
    const copy = $('copy');
    copy.hidden = !navigator.clipboard;
    copy.onclick = () => navigator.clipboard.writeText(link.app).then(() => { copy.textContent = 'Link copiado'; }, () => {});
    openApp(link);
  } else if (location.hash.length > 1) {
    $('invalid').hidden = false;
  }
  loadDownloads();
}

main();
