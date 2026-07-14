// Blackburne Agency — Sovereign Showroom
// Vanilla JS only.

// Instagram's embed.js measures each card's width once, at the moment it first
// processes the page. On mobile that can happen before our grid has finished
// settling, so cards can end up at slightly different widths. Re-running
// Instagram's own processor after load (and after resize/orientation change)
// keeps every embed consistent with the current layout.
function reprocessInstagramEmbeds() {
    if (window.instgrm && window.instgrm.Embeds) {
        window.instgrm.Embeds.process();
    }
}

window.addEventListener('load', function () {
    setTimeout(reprocessInstagramEmbeds, 300);
});

let instagramResizeTimer;
window.addEventListener('resize', function () {
    clearTimeout(instagramResizeTimer);
    instagramResizeTimer = setTimeout(reprocessInstagramEmbeds, 300);
});
