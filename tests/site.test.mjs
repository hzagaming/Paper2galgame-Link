import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const readOptional = url => readFile(url, 'utf8').catch(() => '');
const [readme, announcement, historyV282, historyV281, historyV28, historyV27, historyV26, historyV25, historyV24, historyV23, historyV22, historyV21, historyV20] = await Promise.all([
  readOptional(new URL('../README.md', import.meta.url)),
  readOptional(new URL('../ANNOUNCEMENT.md', import.meta.url)),
  readOptional(new URL('../docs/announcements/history/v2.8.2.md', import.meta.url)),
  readOptional(new URL('../docs/announcements/history/v2.8.1.md', import.meta.url)),
  readOptional(new URL('../docs/announcements/history/v2.8.0.md', import.meta.url)),
  readOptional(new URL('../docs/announcements/history/v2.7.0.md', import.meta.url)),
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
  assert.match(html, /await context\.resume\(\)/);
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
  assert.match(html, /if \(document\.hidden && context\.state === ['"]running['"]\)/);
  assert.match(html, /resumeAfterVisibility = hasActiveAudioIntent\(\);\s*await suspendAudioPlayback\(\);/);
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

test('isolates pending resumes when a closed audio context is replaced', () => {
  assert.match(html, /let resumeContext;/);
  assert.match(html, /async function resumeAudio\(context\)/);
  assert.match(html, /const context = audioContext;\s*if \(context\.state !== ['"]running['"]\)/);
  assert.match(html, /if \(!resumePromise \|\| resumeContext !== context\)/);
  assert.match(html, /resumeContext = context;/);
  assert.match(html, /const tracked = resumeAudio\(context\)\.finally\(\(\) =>\s*{\s*if \(resumePromise === tracked\)/);
  assert.match(html, /if \(resumeContext === context\) resumeContext = null;/);
});

test('keeps disabled audio suspended across lifecycle restores', () => {
  assert.match(html, /function hasActiveAudioIntent\(\)\s*{\s*return sfxEnabled \|\| bgmEnabled;\s*}/);
  assert.match(html, /function restoreAudioPlayback\(\)\s*{\s*if \(!hasActiveAudioIntent\(\)\) return;/);
  assert.match(html, /async function ensureAudio\(\)\s*{\s*if \(suspendPromise\) await suspendPromise;\s*if \(!AudioEngine\)/);
  assert.match(html, /if \(suspendPromise\) await suspendPromise;\s*if \(!hasActiveAudioIntent\(\)\) return;/);
  assert.match(html, /const context = await ensureAudio\(\);\s*if \(context && !hasActiveAudioIntent\(\)\)\s*{\s*await suspendAudioPlayback\(\);\s*return;\s*}/);
  assert.match(html, /resumeAfterVisibility = shouldRestoreAudio\(audioContext\);/);
  assert.match(html, /resumeAfterPageShow = shouldRestoreAudio\(audioContext\);/);
});

test('restores active BGM after the browser auto-suspends audio first', () => {
  assert.match(html, /function shouldRestoreAudio\(context\)/);
  assert.match(html, /return hasActiveAudioIntent\(\) && \([\s\S]*?context\.state === 'running'[\s\S]*?context\.state === 'interrupted'[\s\S]*?bgmEnabled && Boolean\(bgmVoice\)/);
  assert.equal((html.match(/shouldRestoreAudio\(audioContext\)/g) ?? []).length, 2);
});

test('does not wake audio for disabled interaction sounds', () => {
  assert.match(
    html,
    /document\.querySelectorAll\('\[data-sfx\]'\)[\s\S]*?element\.addEventListener\('click',\s*\(\)\s*=>\s*{\s*if \(!sfxEnabled\) return;\s*ensureAudio\(\)\.then/,
  );
});

test('keeps intro and pointer effects idempotent and input-aware', () => {
  assert.match(html, /intro\.classList\.contains\(['"]is-exiting['"]\)/);
  assert.ok(
    html.indexOf("window.addEventListener('keydown', finishIntro)") < html.indexOf('if (reduceMotion.matches)'),
  );
  assert.match(html, /event\.pointerType\s*===\s*['"]mouse['"]/);
  assert.match(html, /document\.querySelectorAll\('\[data-sfx\]'\)[\s\S]*?element\.addEventListener\('click',\s*\(\)\s*=>\s*{\s*if \(!sfxEnabled\) return;\s*ensureAudio\(\)\.then/);
  assert.doesNotMatch(
    html,
    /document\.querySelectorAll\('\[data-sfx\]'\)[\s\S]*?element\.addEventListener\('pointerdown'/,
  );
  assert.match(html, /requestAnimationFrame\(/);
  assert.match(html, /\.backdrop::after\s*{[\s\S]*?transform:\s*translate3d\(/);
  assert.doesNotMatch(html, /\.backdrop::after\s*{[\s\S]*?transition:\s*margin/);
});

test('orchestrates viewport motion, spatial feedback, and live audio visuals', () => {
  assert.match(html, /class="scroll-progress" aria-hidden="true"/);
  assert.match(html, /class="aurora aurora--warm"/);
  assert.match(html, /id="introCounter"/);
  assert.match(html, /class="audio-meter" aria-hidden="true"/);
  assert.match(html, /data-magnetic/);
  assert.equal((html.match(/class="link-card[^"]*"[^>]*data-reveal/g) ?? []).length, 4);
  assert.match(html, /new IntersectionObserver\(/);
  assert.match(html, /classList\.add\(['"]is-visible['"]\)/);
  assert.match(html, /--scroll-progress/);
  assert.match(html, /function updateScrollMotion\(/);
  assert.match(html, /Math\.min\(Math\.max\(scrollY \/ scrollLimit, 0\), 1\)/);
  assert.match(html, /--card-rx/);
  assert.match(html, /perspective\(\d+px\) rotateX\(var\(--card-rx\)\) rotateY\(var\(--card-ry\)\)/);
  assert.match(html, /function resetCardTilt\(/);
  assert.match(html, /cancelAnimationFrame\(cardFrame\);\s*cardFrame = null;\s*card\.classList\.remove\('is-touch-active'\);\s*resetCardTilt\(card\);/);
  assert.match(html, /cancelAnimationFrame\(magneticFrame\);\s*magneticFrame = null;\s*resetMagnetic\(element\);/);
  assert.match(html, /function resetArtTilt\(\)\s*{\s*cancelAnimationFrame\(artFrame\);\s*artFrame = null;/);
  assert.match(html, /function createRipple\(/);
  assert.match(html, /ripple\.addEventListener\(['"]animationend['"],\s*\(\)\s*=>\s*ripple\.remove\(\)/);
  assert.match(html, /if \(typeof IntersectionObserver !== ['"]function['"] \|\| reduceMotion\.matches\)/);
  assert.match(html, /let keyboardNavigation = false;/);
  assert.match(html, /event\.key === ['"]Tab['"][\s\S]*?keyboardNavigation = true/);
  assert.match(html, /item\.addEventListener\(['"]focusin['"],\s*\(\)\s*=>\s*{[\s\S]*?item\.classList\.add\(['"]is-visible['"]\);[\s\S]*?if \(keyboardNavigation\)[\s\S]*?item\.scrollIntoView\(/);
});

test('layers inertial pointer, scene progress, and kinetic card choreography', () => {
  assert.match(html, /class="pointer-lens" aria-hidden="true"/);
  assert.match(html, /class="scene-rail" aria-hidden="true"/);
  assert.match(html, /class="motion-marquee" aria-hidden="true"/);
  assert.match(html, /\.scene-rail i::after\s*{[\s\S]*?scaleY\(var\(--scroll-progress\)\)/);
  assert.match(html, /\.motion-marquee > div\s*{[\s\S]*?animation:\s*marqueeFlow/);
  assert.match(html, /@keyframes marqueeFlow/);
  assert.match(html, /function updatePointerMotion\(\)/);
  assert.match(html, /function resetPointerMotion\(\)\s*{\s*cancelAnimationFrame\(pointerFrame\);\s*pointerFrame = null;/);
  assert.match(html, /body\.classList\.add\('has-pointer'\)/);
  assert.match(html, /document\.querySelectorAll\('a, button'\)/);
  assert.match(html, /--pointer-drift-x/);
  assert.match(html, /--pointer-counter-x/);
  assert.match(html, /is-destination-scene/);
  assert.match(html, /\.link-card:is\(:hover, :focus-visible\) \.card-copy h3/);
  assert.match(html, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.pointer-lens\s*{\s*display:\s*none\s*!important/);
});

test('adds pointer velocity and staged section choreography', () => {
  assert.match(html, /--pointer-angle:\s*0deg/);
  assert.match(html, /--pointer-tail:\s*0px/);
  assert.match(html, /Math\.atan2\(deltaY, deltaX\)/);
  assert.match(html, /Math\.hypot\(deltaX, deltaY\)/);
  assert.match(html, /const pointerSettled = pointerDistance <= 0\.2;/);
  assert.match(html, /pointerCurrentX = pointerSettled \? pointerTargetX/);
  assert.match(html, /setProperty\('--pointer-tail'/);
  assert.match(html, /<h2 id="links-title"><span class="section-title-main">Choose your next scene\.<\/span><span class="section-title-echo" aria-hidden="true">Choose your next scene\.<\/span><\/h2>/);
  assert.match(html, /\.is-ready \.section-heading\.is-visible \.section-title-main\s*{[\s\S]*?animation:\s*sectionTitleSlice/);
  assert.match(html, /\.is-ready \.link-card\.is-visible \.card-top\s*{[\s\S]*?animation:\s*cardLayerIn/);
  assert.match(html, /\.is-ready \.link-card\.is-visible::before\s*{[\s\S]*?animation:\s*cardRevealGlow/);
  assert.match(html, /@keyframes sectionTitleSlice/);
  assert.match(html, /@keyframes cardLayerIn/);
  assert.match(html, /@keyframes cardRevealGlow/);
  assert.match(html, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.section-title-main,[\s\S]*?\.link-card \.card-bottom\s*{[\s\S]*?animation:\s*none\s*!important/);
});

test('adds a bounded motion field and momentum-linked depth', () => {
  assert.match(html, /class="motion-field" aria-hidden="true"/);
  assert.match(html, /\.motion-field\s*{[\s\S]*?pointer-events:\s*none/);
  assert.match(html, /const motionContext = motionField\.getContext\('2d'\)/);
  assert.match(html, /const finePointer = matchMedia\('\(any-hover: hover\) and \(any-pointer: fine\)'\)/);
  assert.match(html, /const hasMotionPointer = finePointer\.matches \|\| coarsePointer\.matches;/);
  assert.match(html, /if \(!motionContext \|\| !hasMotionPointer \|\| reduceMotion\.matches\)/);
  assert.match(html, /Math\.min\(devicePixelRatio \|\| 1, coarsePointer\.matches \? 1\.5 : 2\)/);
  assert.match(html, /if \(motionParticles\.length >= particleLimit\) motionParticles\.shift\(\)/);
  assert.match(html, /function renderMotionField\(\)/);
  assert.match(html, /motionFieldFrame = requestAnimationFrame\(renderMotionField\)/);
  assert.match(html, /function resetMotionField\(\)/);
  assert.match(html, /--scroll-kick-y:\s*0px/);
  assert.match(html, /--scroll-skew:\s*0deg/);
  assert.match(html, /let scrollVelocity = 0/);
  assert.match(html, /scrollVelocity \+= \(scrollDelta - scrollVelocity\) \* 0\.38/);
  assert.match(html, /\.motion-marquee\s*{[\s\S]*?translate:\s*0 var\(--scroll-kick-y\);[\s\S]*?transform:\s*skewX\(var\(--scroll-skew\)\)/);
  assert.match(html, /h2\s*{[\s\S]*?transform:\s*skewX\(var\(--scroll-skew\)\)/);
  assert.match(html, /h2\s*{[\s\S]*?transition:\s*transform 160ms ease-out;\s*}\s*\.section-title-main\s*{/);
  assert.match(html, /--card-copy-x:\s*0px/);
  assert.match(html, /setProperty\('--card-copy-x'/);
  assert.match(html, /\.link-grid:has\(\.link-card:is\(:hover, :focus-visible\)\)/);
  assert.match(html, /class="section-title-echo" aria-hidden="true"/);
  assert.doesNotMatch(html, /content:\s*attr\(data-text\)/);
  assert.match(html, /animation:\s*sectionTitleEcho/);
  assert.match(html, /@keyframes sectionTitleEcho/);
  assert.match(html, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.motion-field\s*{[\s\S]*?display:\s*none\s*!important/);
});

test('gives coarse pointers a bounded tactile motion system', () => {
  assert.match(html, /const coarsePointer = matchMedia\('\(any-pointer: coarse\)'\);/);
  assert.match(html, /@media\s*\(hover:\s*none\)\s*and\s*\(pointer:\s*coarse\)[\s\S]*?\.motion-field\s*{[\s\S]*?display:\s*block/);
  assert.match(html, /@media\s*\(hover:\s*none\)\s*and\s*\(pointer:\s*coarse\)[\s\S]*?\.sound-toggle\s*{[\s\S]*?width:\s*44px;[\s\S]*?min-width:\s*44px/);
  assert.match(html, /finePointer\.matches \|\| coarsePointer\.matches/);
  assert.match(html, /coarsePointer\.matches \? 1\.5 : 2/);
  assert.match(html, /const particleLimit = coarsePointer\.matches \? 24 : 48;/);
  assert.match(html, /const ringLimit = coarsePointer\.matches \? 2 : 4;/);
  assert.match(html, /const burstCount = coarsePointer\.matches \? 6 : 10;/);
  assert.match(html, /event\.pointerType === 'touch'[\s\S]*?classList\.add\('is-touching'\)/);
  assert.match(html, /card\.classList\.add\('is-touch-active'\)/);
  assert.match(html, /function resetTouchMotion\(\{ preserveSettling = false \} = \{\}\)/);
  assert.match(html, /coarsePointer\.addEventListener\?\.\('change'/);
  assert.match(html, /function syncMotionPreference\(event\)[\s\S]*?resetTouchMotion\(\)/);
});

test('keeps native touch scrolling available during reveal choreography', () => {
  assert.match(html, /@media\s*\(hover:\s*none\)\s*and\s*\(pointer:\s*coarse\)[\s\S]*?\[data-reveal\]\s*{[\s\S]*?filter:\s*none;[\s\S]*?scale:\s*1;[\s\S]*?translate:\s*none;[\s\S]*?transition:\s*none;/);
  assert.match(html, /@media\s*\(hover:\s*none\)\s*and\s*\(pointer:\s*coarse\)[\s\S]*?\.is-ready \[data-reveal\]\.is-visible\s*{\s*animation:\s*touchRevealIn 620ms var\(--ease\) var\(--delay, 0ms\) both;/);
  assert.match(html, /@keyframes touchRevealIn\s*{\s*from\s*{\s*opacity:\s*0;\s*}\s*to\s*{\s*opacity:\s*1;\s*}\s*}/);
  assert.match(html, /@media\s*\(hover:\s*none\)\s*and\s*\(pointer:\s*coarse\)[\s\S]*?\.link-card\[data-reveal\]\s*{\s*transition:\s*transform 180ms ease-out, border-color 320ms ease, box-shadow 420ms var\(--ease\);/);
});

test('preserves sticky navigation and natural mobile scroll boundaries', () => {
  assert.match(html, /body\s*{[^}]*overflow-x:\s*clip;/);
  assert.doesNotMatch(html, /body\s*{[^}]*overscroll-behavior-y:\s*none;/);
  assert.doesNotMatch(html, /\.links-section\s*{[^}]*scroll-margin-top:/);
});

test('stabilizes mobile browser chrome and touch feedback', () => {
  assert.match(html, /body\s*{[\s\S]*?min-height:\s*100svh/);
  assert.match(html, /\.site-shell\s*{[\s\S]*?min-height:\s*100svh/);
  assert.match(html, /@supports\s*\(height:\s*100dvh\)[\s\S]*?min-height:\s*100dvh/);
  assert.match(html, /\.link-card\.is-touch-active\s*{/);
  assert.match(html, /body\.is-touching \.motion-field/);
  assert.match(html, /\.link-card\.is-touch-active::after/);
});

test('synchronizes live reduced-motion changes across mobile engines', () => {
  assert.match(html, /function syncMotionPreference\(event\)/);
  assert.match(html, /let motionPreferenceChanges;/);
  assert.match(html, /function observeMotionPreferenceChanges\(\)/);
  assert.match(html, /motionPreferenceChanges = matchMedia\('\(prefers-reduced-motion: reduce\)'\);/);
  assert.match(html, /motionPreferenceChanges\.addEventListener\?\.\('change', syncMotionPreference\)/);
  assert.match(html, /motionPreferenceChanges\.addListener\?\.\(syncMotionPreference\)/);
  assert.match(html, /window\.addEventListener\('load', observeMotionPreferenceChanges, \{ once: true \}\)/);
  assert.match(html, /syncMotionPreference\(motionPreferenceChanges\)/);
  assert.match(html, /function syncMotionPreference\(event\)[\s\S]*?resetTouchMotion\(\);[\s\S]*?resetMotionField\(\);[\s\S]*?resizeMotionField\(\);/);
});

test('backs up motion media listeners with a layout observer', () => {
  assert.match(html, /let lastMotionPreference = reduceMotion\.matches;/);
  assert.match(html, /function syncMotionPreference\(event\)\s*{\s*lastMotionPreference = event\.matches;/);
  assert.match(html, /const motionPreferenceObserver = typeof ResizeObserver === 'function'/);
  assert.match(html, /new ResizeObserver\(\(\) =>\s*{\s*if \(reduceMotion\.matches !== lastMotionPreference\) syncMotionPreference\(reduceMotion\);/);
  assert.match(html, /motionPreferenceObserver\?\.observe\(motionField\)/);
});

test('polls frozen motion media queries without a continuous animation frame', () => {
  assert.match(html, /setInterval\(\(\) =>\s*{\s*if \(reduceMotion\.matches !== lastMotionPreference\) syncMotionPreference\(reduceMotion\);\s*}, 200\)/);
  assert.doesNotMatch(html, /requestAnimationFrame\([^)]*syncMotionPreference/);
});

test('supports hybrid pointers and batches high-frequency touch motion', () => {
  assert.match(html, /@media\s*\(any-hover:\s*hover\)\s*and\s*\(any-pointer:\s*fine\)/);
  assert.match(html, /const finePointer = matchMedia\('\(any-hover: hover\) and \(any-pointer: fine\)'\);/);
  assert.match(html, /const coarsePointer = matchMedia\('\(any-pointer: coarse\)'\);/);
  assert.match(html, /let touchFrame;/);
  assert.match(html, /function requestTouchMotion\(event, emitTrail = false\)/);
  assert.match(html, /touchFrame = requestAnimationFrame\(\(\) =>/);
  assert.match(html, /cancelAnimationFrame\(touchFrame\);\s*touchFrame = null;/);
  assert.match(html, /event\.pointerType === 'touch'[\s\S]*?requestTouchMotion\(event, true\)/);
});

test('finishes touch cards with a primary-pointer release choreography', () => {
  assert.match(html, /\.link-card\.is-touch-settling::after/);
  assert.match(html, /@keyframes touchCardSettle/);
  assert.match(html, /@keyframes touchArrowSettle/);
  assert.match(html, /card\.classList\.add\('is-touch-settling'\)/);
  assert.match(html, /cardResetTimer = setTimeout\(resetCardMotion, 480\)/);
  assert.match(html, /event\.pointerType !== 'touch' \|\| !event\.isPrimary \|\| reduceMotion\.matches/);
  assert.match(html, /function resetTouchMotion\(\{ preserveSettling = false \} = \{\}\)/);
  assert.match(html, /setTimeout\(\(\) => resetTouchMotion\(\{ preserveSettling: true \}\), 360\)/);
});

test('keeps secondary touch pointers from cancelling primary motion', () => {
  assert.match(html, /const resetCardPointerMotion = event =>\s*{\s*if \(event\.pointerType === 'touch' && !event\.isPrimary\) return;\s*resetCardMotion\(\);/);
  assert.match(html, /card\.addEventListener\('pointerleave', resetCardPointerMotion\)/);
  assert.match(html, /card\.addEventListener\('pointercancel', resetCardPointerMotion\)/);
  assert.match(html, /heroArt\.addEventListener\('pointerup', event =>\s*{\s*if \(event\.pointerType === 'touch' && event\.isPrimary\) resetArtTilt\(\);/);
  assert.match(html, /window\.addEventListener\('pointercancel', event =>\s*{\s*if \(event\.pointerType === 'touch'\)\s*{\s*if \(event\.pointerId === activeTouchPointer\) resetTouchMotion\(\);\s*return;/);
});

test('contains extreme layouts and cancels motion races', () => {
  assert.match(html, /html\s*{[\s\S]*?overflow-x:\s*clip/);
  assert.match(html, /class="sound-label">SFX ON<\/span>/);
  assert.match(html, /class="sound-label">BGM OFF<\/span>/);
  assert.match(html, /@media\s*\(max-width:\s*900px\)[\s\S]*?\.sound-label,[\s\S]*?\.audio-meter\s*{\s*display:\s*none/);
  assert.match(html, /@media\s*\(max-width:\s*900px\)[\s\S]*?\.sound-toggle\s*{[\s\S]*?width:\s*44px;[\s\S]*?min-width:\s*44px/);
  assert.match(html, /@media\s*\(max-width:\s*480px\)[\s\S]*?\.brand-copy\s*{\s*display:\s*none/);
  assert.match(html, /const cardMotionScale = isTouch[\s\S]*?: Math\.min\(Math\.max\(\(bounds\.width - 300\) \/ 240, 0\), 1\)/);
  assert.match(html, /@media\s*\(max-width:\s*720px\)[\s\S]*?\.link-card\s*{[\s\S]*?--card-top-z:\s*0px;[\s\S]*?--card-copy-z:\s*0px;[\s\S]*?--card-bottom-z:\s*0px/);
  assert.match(html, /\.card-top,[\s\S]*?\.card-copy,[\s\S]*?\.card-bottom\s*{\s*min-width:\s*0;/);
  assert.match(html, /\.topbar\[data-reveal\],[\s\S]*?\.hero-cta\[data-reveal\]\s*{\s*scale:\s*1;/);
  assert.match(html, /function resetScrollMomentum\(\)\s*{\s*cancelAnimationFrame\(scrollFrame\);/);
  assert.match(html, /function syncMotionPreference\(event\)[\s\S]*?resetScrollMomentum\(\)/);
  assert.match(html, /const motionRings = \[\]/);
  assert.match(html, /if \(motionRings\.length >= ringLimit\) motionRings\.shift\(\)/);
  assert.match(html, /motionRings\.length = 0/);
  assert.match(html, /motionParticles\.length \|\| motionRings\.length/);
  assert.match(html, /body\.is-destination-scene \.links-section::after\s*{[\s\S]*?animation:\s*sceneBeamPulse/);
  assert.match(html, /@keyframes sceneBeamPulse/);
  assert.match(html, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.links-section::after\s*{\s*animation:\s*none\s*!important/);
});

test('keeps authored HTML and CSS free of browser-repaired structure', () => {
  assert.doesNotMatch(html, /<span class="brand-copy">[\s\S]*?<\/span>\s*<\/span>\s*<\/a>/);
  assert.doesNotMatch(html, /main:focus\s*{\s*outline:\s*none;\s*}\s*}\s*\.link-card--featured/);
});

test('does not depend on the previous signed image or legacy widgets', () => {
  assert.doesNotMatch(html, /byteimg\.com|galgame-img|paper2gal_settings/);
  assert.doesNotMatch(html, /id="clock"|configModal|fullscreenBtn/);
});

test('constrains the hero and header controls on narrow screens', () => {
  assert.match(html, /@media\s*\(max-width:\s*900px\)[\s\S]*?\.sound-label,[\s\S]*?\.audio-meter\s*{\s*display:\s*none/);
  assert.match(html, /@media\s*\(min-width:\s*35rem\)\s*and\s*\(max-height:\s*500px\)\s*and\s*\(orientation:\s*landscape\)/);
  assert.match(html, /\.sound-toggle\s*{[\s\S]*?min-height:\s*2\.75rem/);
  assert.match(html, /@media\s*\(max-width:\s*720px\)[\s\S]*?\.link-card\s*{[\s\S]*?flex-basis:\s*100%/);
});

test('reflows controls and cards when text is enlarged', () => {
  assert.match(html, /\.topbar\s*{[\s\S]*?flex-wrap:\s*wrap/);
  assert.match(html, /@media\s*\(max-width:\s*720px\)[\s\S]*?\.site-shell\s*{[\s\S]*?max\(16px,\s*env\(safe-area-inset-left/);
  assert.match(html, /@media\s*\(max-width:\s*720px\)[\s\S]*?\.brand,[\s\S]*?\.hero-cta,[\s\S]*?\.sound-toggle\s*{\s*min-height:\s*45px/);
  assert.match(html, /@media\s*\(max-width:\s*900px\)[\s\S]*?\.sound-toggle\s*{[\s\S]*?width:\s*44px;[\s\S]*?min-width:\s*44px/);
  assert.match(html, /@media\s*\(max-width:\s*480px\)[\s\S]*?\.brand-copy\s*{\s*display:\s*none/);
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
  assert.match(html, /@media\s*\(any-hover:\s*hover\)\s*and\s*\(any-pointer:\s*fine\)[\s\S]*?\.link-card:hover/);
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

test('publishes v2.8.3 and archives earlier announcements', () => {
  assert.match(html, /name="application-version" content="2\.8\.3"/);
  assert.equal((html.match(/v2\.8\.3/g) ?? []).length, 2);
  assert.match(html, /data-version="2\.8\.3"/);
  assert.match(readme, /Current release: \*\*v2\.8\.3\*\*/);
  assert.match(readme, /v2\.8\.2 archive/);
  assert.match(announcement, /v2\.8\.3/);
  assert.match(announcement, /history\/v2\.8\.2\.md/);
  assert.match(historyV282, /v2\.8\.2/);
  assert.match(historyV282, /当前公告/);
  assert.match(historyV281, /v2\.8\.1/);
  assert.match(historyV281, /当前公告/);
  assert.match(historyV28, /v2\.8\.0/);
  assert.match(historyV28, /当前公告/);
  assert.match(historyV27, /v2\.7\.0/);
  assert.match(historyV27, /当前公告/);
  assert.match(historyV26, /v2\.6\.0/);
  assert.match(historyV25, /v2\.5\.0/);
  assert.match(historyV24, /v2\.4\.0/);
  assert.match(historyV23, /v2\.3\.0/);
  assert.match(historyV22, /v2\.2\.0/);
  assert.match(historyV21, /v2\.1\.0/);
  assert.match(historyV20, /v2\.0\.0/);
});
