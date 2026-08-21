import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const readOptional = url => readFile(url, 'utf8').catch(() => '');
const [readme, announcement, historyV26, historyV25, historyV24, historyV23, historyV22, historyV21, historyV20] = await Promise.all([
  readOptional(new URL('../README.md', import.meta.url)),
  readOptional(new URL('../ANNOUNCEMENT.md', import.meta.url)),
  readOptional(new URL('../docs/announcements/history/v2.6.0.md', import.meta.url)),
  readOptional(new URL('../docs/announcements/history/v2.5.0.md', import.meta.url)),
  readOptional(new URL('../docs/announcements/history/v2.4.0.md', import.meta.url)),
  readOptional(new URL('../docs/announcements/history/v2.3.0.md', import.meta.url)),
  readOptional(new URL('../docs/announcements/history/v2.2.0.md', import.meta.url)),
  readOptional(new URL('../docs/announcements/history/v2.1.0.md', import.meta.url)),
  readOptional(new URL('../docs/announcements/history/v2.0.0.md', import.meta.url)),
]);

test('presents Hanazar Ochikawa as the creator', () => {
  assert.match(html, /Hanazar Ochikawa/);
  assert.doesNotMatch(html, />\s*TON\s*</i);
  assert.doesNotMatch(html, /35°41/);
});

test('keeps the four destination links and protects new tabs', () => {
  const destinations = [
    'https://paper2gal.com',
    'https://www.bilibili.com/video/BV1HSU8B3EcK/',
    'https://www.bilibili.com/video/BV1UT42167xb/',
    'https://www.bilibili.com/video/BV1b3cEzQEHb/',
  ];

  for (const destination of destinations) {
    assert.match(html, new RegExp(`href=["']${destination}["']`));
  }

  assert.equal((html.match(/rel="noopener noreferrer"/g) ?? []).length, 4);
  assert.equal((html.match(/aria-label="[^"]*在新标签页打开[^"]*"/g) ?? []).length, 4);
});

test('uses semantic landmarks and accessible controls', () => {
  assert.match(html, /<main\b/);
  assert.match(html, /<main id="main" tabindex="-1">/);
  assert.match(html, /main:focus\s*{\s*outline:\s*none;/);
  assert.match(html, /<h1\b/);
  assert.match(html, /<nav\b[^>]*aria-label=/);
  assert.match(html, /id="soundToggle"[^>]*aria-pressed="true"/);
  assert.match(html, /role="group"[^>]*aria-label="声音控制"/);
  assert.match(html, /:focus-visible/);
  assert.doesNotMatch(html, /<span class="card-(?:top|copy|bottom)"/);
});

test('ships an animated intro with a reduced-motion escape hatch', () => {
  assert.match(html, /class="intro"/);
  assert.match(html, /\.intro\[hidden\]\s*{\s*display:\s*none/);
  assert.match(html, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(html, /matchMedia\(['"]\(prefers-reduced-motion: reduce\)['"]\)/);
  assert.match(html, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\[data-reveal\]\s*{[\s\S]*?opacity:\s*1\s*!important;[\s\S]*?animation:\s*none\s*!important;/);
});

test('generates SFX and opt-in ambient BGM without audio assets', () => {
  assert.match(html, /AudioContext|webkitAudioContext/);
  assert.match(html, /createOscillator\(/);
  assert.match(html, /id="bgmToggle"[^>]*aria-pressed="false"/);
  assert.match(html, /createBiquadFilter\(/);
  assert.match(html, /function startBgm\(/);
  assert.match(html, /function stopBgm\(/);
  assert.doesNotMatch(html, /<audio\b|\.mp3|\.wav|\.ogg/i);
});

test('manages Web Audio lifecycle and unavailable browsers', () => {
  assert.match(html, /await audioContext\.resume\(\)/);
  assert.match(html, /visibilitychange/);
  assert.match(html, /pagehide/);
  assert.match(html, /audioContext\.close\(\)/);
  assert.match(html, /\.onended\s*=/);
  assert.match(html, /\.disconnect\(\)/);
  assert.match(html, /function disableAudioControls\(/);
  assert.match(html, /if \(!AudioEngine\)\s*{\s*disableAudioControls\(\);\s*}\s*else\s*{\s*syncAudioControls\(\);/);
  assert.match(html, /voice\.cleaned/);
  assert.match(html, /resumeAfterPageShow/);
  assert.match(html, /const nextEnabled = !sfxEnabled;\s*sfxEnabled = nextEnabled;/);
  assert.match(html, /const nextEnabled = !bgmEnabled;\s*bgmEnabled = nextEnabled;/);
  assert.match(html, /let sfxIntentRevision = 0;/);
  assert.match(html, /let bgmIntentRevision = 0;/);
  assert.match(html, /intentRevision !== sfxIntentRevision/);
  assert.match(html, /intentRevision !== bgmIntentRevision/);
  assert.match(html, /if \(!bgmEnabled\) return;/);
  assert.match(html, /if \(document\.hidden && audioContext\.state === ['"]running['"]\)/);
  assert.match(html, /resumeAfterVisibility = true;\s*await suspendAudioPlayback\(\);/);
  assert.match(html, /function restoreAudioPlayback\(/);
  assert.match(html, /let suspendPromise;/);
  assert.match(html, /function suspendAudioPlayback\(/);
  assert.match(html, /function resumeAudio\([\s\S]*?await suspendAudioPlayback\(\);/);
  assert.match(html, /function restoreAudioPlayback\([\s\S]*?if \(suspendPromise\) await suspendPromise;/);
  assert.match(html, /visibilitychange[\s\S]*?await suspendAudioPlayback\(\);/);
  assert.match(html, /pagehide[\s\S]*?await suspendAudioPlayback\(\);/);
  assert.match(html, /function restoreAudioPlayback\([\s\S]*?if \(!context\)\s*{[\s\S]*?sfxEnabled = false;[\s\S]*?bgmEnabled = false;[\s\S]*?syncAudioControls\(\);/);
  assert.match(html, /context && bgmEnabled && !bgmVoice/);
  assert.match(html, /const failedContext = audioContext;[\s\S]*?failedContext\?\.close\(\)/);
  assert.match(html, /function playTone\([\s\S]*?catch\s*{[\s\S]*?oscillator\?\.disconnect\(\)/);
  assert.match(html, /function startBgm\([\s\S]*?catch\s*{[\s\S]*?return false;/);
  assert.match(html, /if \(!startBgm\(\)\)\s*{\s*bgmEnabled = false;\s*syncAudioControls\(\);/);
});

test('keeps intro and pointer effects idempotent and input-aware', () => {
  assert.match(html, /intro\.classList\.contains\(['"]is-exiting['"]\)/);
  assert.ok(
    html.indexOf("window.addEventListener('keydown', finishIntro)") < html.indexOf('if (reduceMotion.matches)'),
  );
  assert.match(html, /event\.pointerType\s*===\s*['"]mouse['"]/);
  assert.match(html, /card\.addEventListener\('click',\s*\(\)\s*=>\s*{\s*ensureAudio\(\)\.then/);
  assert.doesNotMatch(
    html,
    /document\.querySelectorAll\('\[data-sfx\]'\)[\s\S]*?card\.addEventListener\('pointerdown'/,
  );
  assert.match(html, /requestAnimationFrame\(/);
  assert.match(html, /\.backdrop::after\s*{[\s\S]*?transform:\s*translate3d\(/);
  assert.doesNotMatch(html, /\.backdrop::after\s*{[\s\S]*?transition:\s*margin/);
});

test('does not depend on the previous signed image or legacy widgets', () => {
  assert.doesNotMatch(html, /byteimg\.com|galgame-img|paper2gal_settings/);
  assert.doesNotMatch(html, /id="clock"|configModal|fullscreenBtn/);
});

test('constrains the hero and header controls on narrow screens', () => {
  assert.match(html, /@media\s*\(max-width:\s*720px\)[\s\S]*?\.sound-toggle span\s*{[\s\S]*?display:\s*none/);
  assert.match(html, /@media\s*\(min-width:\s*35rem\)\s*and\s*\(max-height:\s*500px\)\s*and\s*\(orientation:\s*landscape\)/);
  assert.match(html, /\.sound-toggle\s*{[\s\S]*?min-height:\s*2\.75rem/);
  assert.match(html, /@media\s*\(max-width:\s*720px\)[\s\S]*?\.link-card\s*{[\s\S]*?flex-basis:\s*100%/);
});

test('reflows controls and cards when text is enlarged', () => {
  assert.match(html, /\.topbar\s*{[\s\S]*?flex-wrap:\s*wrap/);
  assert.match(html, /@media\s*\(max-width:\s*720px\)[\s\S]*?\.site-shell\s*{[\s\S]*?max\(16px,\s*env\(safe-area-inset-left/);
  assert.match(html, /@media\s*\(max-width:\s*720px\)[\s\S]*?\.sound-toggle\s*{[\s\S]*?width:\s*44px;[\s\S]*?min-height:\s*44px/);
  assert.match(html, /@media\s*\(max-width:\s*360px\)[\s\S]*?\.brand-copy\s*{\s*display:\s*none/);
  assert.match(html, /\.link-grid\s*{[\s\S]*?display:\s*flex;[\s\S]*?flex-wrap:\s*wrap/);
  assert.match(html, /\.link-card\s*{[\s\S]*?flex:\s*1 1 calc\(50% - 0\.5rem\);[\s\S]*?min-width:\s*min\(100%,\s*20rem\)/);
  assert.match(html, /\.card-copy h3\s*{[\s\S]*?overflow-wrap:\s*anywhere/);
  assert.match(html, /\.hero-cta\s*{[\s\S]*?max-width:\s*100%/);
  assert.match(html, /\.author-line\s*{[\s\S]*?flex-wrap:\s*wrap/);
  assert.match(html, /\.author-line p\s*{[\s\S]*?flex:\s*1 1 12rem;[\s\S]*?min-width:\s*min\(100%,\s*12rem\);[\s\S]*?overflow-wrap:\s*anywhere/);
  assert.match(html, /@media\s*\(min-width:\s*35rem\)[\s\S]*?\.hero-copy,[\s\S]*?\.hero-art\s*{\s*flex-basis:\s*15rem/);
  assert.match(html, /\.eyebrow,[\s\S]*?\.lede,[\s\S]*?\.section-kicker,[\s\S]*?h2\s*{[\s\S]*?min-width:\s*0;[\s\S]*?overflow-wrap:\s*anywhere/);
  assert.match(html, /\.art-label\s*{[\s\S]*?font-size:\s*clamp\(10px,\s*0\.64rem,\s*14px\)/);
  assert.match(html, /@media\s*\(max-width:\s*900px\)[\s\S]*?\.art-label\s*{[\s\S]*?bottom:\s*4%/);
});

test('guides users to links and handles touch-only browser chrome', () => {
  assert.match(html, /content="width=device-width, initial-scale=1, viewport-fit=cover"/);
  assert.match(html, /rel="icon"[^>]*data:image\/svg\+xml/);
  assert.match(html, /class="hero-cta"[^>]*href="#destinations"/);
  assert.match(html, /id="destinations"/);
  assert.match(html, /@media\s*\(hover:\s*hover\)\s*and\s*\(pointer:\s*fine\)[\s\S]*?\.link-card:hover/);
  assert.match(html, /safe-area-inset-left/);
  assert.match(html, /\.hero-cta\s*{[\s\S]*?min-height:\s*2\.75rem/);
  assert.match(html, /\.brand\s*{[\s\S]*?min-height:\s*2\.75rem/);
  assert.match(html, /\.skip-link\s*{[\s\S]*?min-height:\s*2\.75rem/);
  assert.match(html, /safe-area-inset-top/);
  assert.match(html, /safe-area-inset-bottom/);
  assert.match(html, /\.skip-link\s*{[\s\S]*?transform:\s*translateY\(calc\(-100% - env\(safe-area-inset-top,\s*0px\) - 1rem\)\)/);
  assert.match(html, /\.link-card--featured\s*{[\s\S]*?color:\s*#090a0d/);
  assert.match(html, /\.link-card--featured:focus-visible\s*{\s*outline-color:\s*#090a0d;/);
  assert.doesNotMatch(html, /\.link-card--featured \.card-(?:type|copy p)\s*{\s*color:\s*rgba\(255/);
});

test('finishes the intro when restoring from the back-forward cache', () => {
  assert.match(
    html,
    /window\.addEventListener\('pageshow', event => \{\s*if \(!event\.persisted\) return;\s*finishIntro\(\{ immediate: true \}\);/,
  );
});

test('publishes v2.7.0 and archives earlier announcements', () => {
  assert.match(html, /name="application-version" content="2\.7\.0"/);
  assert.match(html, /v2\.7\.0/);
  assert.match(readme, /v2\.7\.0/);
  assert.match(announcement, /v2\.7\.0/);
  assert.match(announcement, /history\/v2\.6\.0\.md/);
  assert.match(historyV26, /v2\.6\.0/);
  assert.match(historyV25, /v2\.5\.0/);
  assert.match(historyV24, /v2\.4\.0/);
  assert.match(historyV23, /v2\.3\.0/);
  assert.match(historyV22, /v2\.2\.0/);
  assert.match(historyV21, /v2\.1\.0/);
  assert.match(historyV20, /v2\.0\.0/);
});
