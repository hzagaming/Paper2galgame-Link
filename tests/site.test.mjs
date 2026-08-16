import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const readOptional = url => readFile(url, 'utf8').catch(() => '');
const [readme, announcement, historyV21, historyV20] = await Promise.all([
  readOptional(new URL('../README.md', import.meta.url)),
  readOptional(new URL('../ANNOUNCEMENT.md', import.meta.url)),
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
});

test('uses semantic landmarks and accessible controls', () => {
  assert.match(html, /<main\b/);
  assert.match(html, /<h1\b/);
  assert.match(html, /<nav\b[^>]*aria-label=/);
  assert.match(html, /id="soundToggle"[^>]*aria-pressed="true"/);
  assert.match(html, /role="group"[^>]*aria-label="声音控制"/);
  assert.match(html, /:focus-visible/);
  assert.doesNotMatch(html, /<span class="card-(?:top|copy|bottom)"/);
});

test('ships an animated intro with a reduced-motion escape hatch', () => {
  assert.match(html, /class="intro"/);
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
});

test('keeps intro and pointer effects idempotent and input-aware', () => {
  assert.match(html, /intro\.classList\.contains\(['"]is-exiting['"]\)/);
  assert.match(html, /event\.pointerType\s*===\s*['"]mouse['"]/);
  assert.match(html, /event\.detail\s*===\s*0/);
  assert.match(html, /requestAnimationFrame\(/);
});

test('does not depend on the previous signed image or legacy widgets', () => {
  assert.doesNotMatch(html, /byteimg\.com|galgame-img|paper2gal_settings/);
  assert.doesNotMatch(html, /id="clock"|configModal|fullscreenBtn/);
});

test('constrains the hero and header controls on narrow screens', () => {
  assert.match(html, /grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(html, /@media\s*\(max-width:\s*720px\)[\s\S]*?\.sound-toggle span\s*{[\s\S]*?display:\s*none/);
  assert.match(html, /@media\s*\(max-height:\s*500px\)\s*and\s*\(orientation:\s*landscape\)/);
  assert.match(html, /\.sound-toggle\s*{[\s\S]*?min-height:\s*2\.75rem/);
});

test('guides users to links and handles touch-only browser chrome', () => {
  assert.match(html, /content="width=device-width, initial-scale=1, viewport-fit=cover"/);
  assert.match(html, /rel="icon"[^>]*data:image\/svg\+xml/);
  assert.match(html, /class="hero-cta"[^>]*href="#destinations"/);
  assert.match(html, /id="destinations"/);
  assert.match(html, /@media\s*\(hover:\s*hover\)\s*and\s*\(pointer:\s*fine\)[\s\S]*?\.link-card:hover/);
  assert.match(html, /safe-area-inset-left/);
  assert.match(html, /\.hero-cta\s*{[\s\S]*?min-height:\s*2\.75rem/);
});

test('publishes v2.2.0 and archives earlier announcements', () => {
  assert.match(html, /name="application-version" content="2\.2\.0"/);
  assert.match(html, /v2\.2\.0/);
  assert.match(readme, /v2\.2\.0/);
  assert.match(announcement, /v2\.2\.0/);
  assert.match(announcement, /history\/v2\.1\.0\.md/);
  assert.match(historyV21, /v2\.1\.0/);
  assert.match(historyV20, /v2\.0\.0/);
});
