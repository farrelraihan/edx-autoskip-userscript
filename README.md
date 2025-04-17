# edx‑autoskip‑userscript

> A Tampermonkey userscript that auto‑skips all videos on edX, downloads each transcript (named from its video title), and advances to the next section.

## Features

- **Multi‑video support**: handles any number of videos on a single page  
- **Slugified filenames**: e.g. `company-aims-and-values.txt`  
- **Silent downloads** via `GM_download` (no Save As… dialogs)  
- **Observer fallback** to reliably click “Next” as soon as it appears  
- **User toggle** and **keyboard shortcut** (Shift + N) for on‑demand control  

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) in your browser.  
2. Open the Tampermonkey dashboard and click **“Install from URL”**.  
3. Paste the raw script URL:  https://raw.githubusercontent.com/farrelraihan/edx-autoskip-userscript/main/edx-autoskip.user.js
4. Click **Install**, then reload any edX course page.

*Alternatively*, create a new script in Tampermonkey and paste in the contents of  
[`edx-autoskip.user.js`](https://raw.githubusercontent.com/farrelraihan/edx-autoskip-userscript/main/edx-autoskip.user.js).

## Usage

- **Toggle ON/OFF**: click the fixed button at the bottom‑right of the page.  
- **Automatic workflow**: once enabled, play any video → it jumps to the end, downloads the transcript, and after processing all videos, advances to the next unit.  
- **Manual override**: press **Shift + N** to download all transcripts and click “Next” without playing videos.

## Configuration

- The script stores your ON/OFF preference in `localStorage` under the key `edx_autoskip_enabled`.  
- To default to OFF, simply click the toggle button so it reads `⛔ Auto‑Skip: OFF`.

## Development & Updates

- **Source**: https://github.com/farrelraihan/edx-autoskip-userscript  
- **Issues & PRs**: use GitHub Issues to report bugs or request features. Contributions welcome!  
- Automatic updates via `@updateURL` and `@downloadURL` in the script metadata.

## License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

### Script Metadata (`edx-autoskip.user.js`)

```js
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
