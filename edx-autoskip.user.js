// ==UserScript==
// @name         edX Multi‑Video Auto‑Skip + Named Transcripts + Next (v2.8)
// @namespace    https://github.com/farrelraihan/edx-autoskip-userscript
// @version      2.8
// @description  Skip all videos, download each transcript named from its own video title, then click Next (observer fallback)
// @author       farrelraihan
// @match        https://*.edx.org/*
// @grant        GM_download
// @license      MIT
// @updateURL    https://raw.githubusercontent.com/farrelraihan/edx-autoskip-userscript/main/edx-autoskip.user.js
// @downloadURL  https://raw.githubusercontent.com/farrelraihan/edx-autoskip-userscript/main/edx-autoskip.user.js
// ==/UserScript==

(function(){
  'use strict';

  // ─── 1) SETTINGS ─────────────────────────────────────────────────────────
  const STORAGE_KEY = 'edx_autoskip_enabled';
  if (localStorage.getItem(STORAGE_KEY) === null) {
    localStorage.setItem(STORAGE_KEY, 'true');
  }
  const isEnabled = () => localStorage.getItem(STORAGE_KEY) === 'true';
  const setEnabled = on => {
    localStorage.setItem(STORAGE_KEY, on ? 'true' : 'false');
    toggleBtn.textContent = on ? '⏩ Auto‑Skip: ON' : '⛔ Auto‑Skip: OFF';
  };

  // ─── 2) SLUGIFY ──────────────────────────────────────────────────────────
  function slugify(text) {
    return text.toString().toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  }

  // ─── 3) TOGGLE BUTTON ────────────────────────────────────────────────────
  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = isEnabled() ? '⏩ Auto‑Skip: ON' : '⛔ Auto‑Skip: OFF';
  Object.assign(toggleBtn.style, {
    position: 'fixed', bottom: '20px', right: '20px',
    zIndex: 9999, padding: '8px 12px', fontSize: '14px',
    background: '#2c3e50', color: '#fff', border: 'none',
    borderRadius: '6px', cursor: 'pointer', opacity: '0.8'
  });
  toggleBtn.addEventListener('click', () => setEnabled(!isEnabled()));
  document.body.appendChild(toggleBtn);

  // ─── 4) FIND NEXT BUTTON ─────────────────────────────────────────────────
  function findNextButton() {
    return document.querySelector(
      'a.next-btn, button[class*="next"], a[aria-label="Next"], .seq_next, .action-next'
    );
  }

  // ─── 5) WAIT & CLICK NEXT ────────────────────────────────────────────────
  function waitAndClickNext() {
    const btn = findNextButton();
    if (btn) {
      btn.click();
      console.log('➡️ Auto‑clicked Next');
      return;
    }
    // fallback: observe for addition of Next
    const obs = new MutationObserver((_, observer) => {
      const b = findNextButton();
      if (b) {
        b.click();
        console.log('➡️ Auto‑clicked Next (observer)');
        observer.disconnect();
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  // ─── 6) DOWNLOAD ALL TRANSCRIPTS + NEXT ─────────────────────────────────
  function downloadAllTranscriptsThenNext() {
    const links = Array.from(document.querySelectorAll('a.btn.btn-link[data-value="txt"]'));
    if (!links.length) {
      console.warn('📝 No transcript links found');
    }
    links.forEach((link, idx) => {
      // try to find header in same video block
      const container = link.closest('[id*="type@video"]') || link.closest('section') || link.parentElement;
      let hdr = container?.querySelector('h3.hd.hd-2');
      if (!hdr) {
        const all = Array.from(document.querySelectorAll('h3.hd.hd-2'));
        hdr = all[idx] || all[0] || null;
      }
      const base = hdr ? slugify(hdr.textContent) : `edx_transcript_${Date.now()}_${idx+1}`;
      const url = new URL(link.getAttribute('href'), location.origin).href;
      GM_download({
        url,
        name: `${base}.txt`,
        onload: () => console.log(`📄 Saved transcript: ${base}.txt`),
        onerror: e => console.error('Transcript download failed', e)
      });
    });
    // then navigate forward
    setTimeout(waitAndClickNext, 500);
  }

  // ─── 7) OBSERVE & SKIP VIDEOS ─────────────────────────────────────────────
  const seen = new WeakSet();
  const observer = new MutationObserver(() => {
    if (!isEnabled()) return;
    document.querySelectorAll('video').forEach(video => {
      if (seen.has(video)) return;
      seen.add(video);

      video.addEventListener('play', () => {
        function onUpdate() {
          if (video.duration > 0) {
            video.currentTime = video.duration - 0.1;
            video.dispatchEvent(new Event('ended'));
            video.removeEventListener('timeupdate', onUpdate);
            console.log('⏭️ Skipped one video');
            // give the player a moment, then handle transcripts+next
            setTimeout(downloadAllTranscriptsThenNext, 300);
          }
        }
        video.addEventListener('timeupdate', onUpdate);
      }, { once: true });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // ─── 8) MANUAL FALLBACK (Shift+N) ────────────────────────────────────────
  window.addEventListener('keydown', e => {
    if (e.shiftKey && e.key.toLowerCase() === 'n') {
      console.log('🔧 Manual override: download all & Next');
      downloadAllTranscriptsThenNext();
    }
  });
})();
