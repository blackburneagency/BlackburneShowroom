/* =========================================================
   BLACKBURNE AGENCY — SOVEREIGN SHOWROOM
   Vanilla JavaScript. No frameworks, no dependencies.
   ========================================================= */

(function () {
    'use strict';

    var REVEAL_SELECTOR = [
        '.section-header',
        '.video-item',
        '.track-item',
        '.insta-item',
        '.genre-title',
        '.channel-links',
        '.contact-info'
    ].join(', ');

    /* ---------------------------------------------------------
       1. SCROLL REVEAL
       Elements fade and lift into place as they enter the
       viewport, staggered slightly within each group.
       --------------------------------------------------------- */
    function revealAll(elements) {
        for (var i = 0; i < elements.length; i++) {
            elements[i].classList.add('is-visible');
        }
    }

    function initScrollReveal() {
        var elements = document.querySelectorAll(REVEAL_SELECTOR);
        if (!elements.length) {
            return;
        }

        // No IntersectionObserver support: show everything immediately.
        if (!('IntersectionObserver' in window)) {
            revealAll(elements);
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                    return;
                }
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Reveal once, then stop watching
            });
        }, {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.12
        });

        for (var i = 0; i < elements.length; i++) {
            // Stagger siblings so a grid row cascades in rather than snapping together
            var siblingIndex = 0;
            var node = elements[i].previousElementSibling;
            while (node && siblingIndex < 5) {
                siblingIndex++;
                node = node.previousElementSibling;
            }
            elements[i].style.transitionDelay = (siblingIndex * 90) + 'ms';
            observer.observe(elements[i]);
        }

        // Safety net: if anything goes wrong, never leave content hidden.
        setTimeout(function () {
            revealAll(elements);
        }, 4000);
    }

    /* ---------------------------------------------------------
       2. REACTIVE NAV BAR
       Condenses on scroll and highlights the section currently
       in view. #av-techno and #youtube-playlists both map to
       the YouTube nav link, since they're one visual section.
       --------------------------------------------------------- */
    function initNav() {
        var nav = document.querySelector('.showroom-nav');
        var links = document.querySelectorAll('.nav-links a');
        if (!nav || !links.length) {
            return;
        }

        var sectionToLink = {
            'home': '#home',
            'youtube': '#youtube',
            'av-techno': '#youtube',
            'youtube-playlists': '#youtube',
            'soundcloud': '#soundcloud',
            'instagram': '#instagram'
        };

        var sections = [];
        Object.keys(sectionToLink).forEach(function (id) {
            var el = document.getElementById(id);
            if (el) {
                sections.push(el);
            }
        });

        function setActive(hash) {
            for (var i = 0; i < links.length; i++) {
                if (links[i].getAttribute('href') === hash) {
                    links[i].classList.add('active');
                } else {
                    links[i].classList.remove('active');
                }
            }
        }

        function onScroll() {
            // Condense the nav once past the top of the page
            if (window.scrollY > 80) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }

            // Whichever section's top is nearest above the nav wins
            var marker = window.scrollY + nav.offsetHeight + 40;
            var currentId = null;
            for (var i = 0; i < sections.length; i++) {
                if (sections[i].offsetTop <= marker) {
                    currentId = sections[i].id;
                }
            }
            setActive(currentId ? sectionToLink[currentId] : null);
        }

        var ticking = false;
        window.addEventListener('scroll', function () {
            if (ticking) {
                return;
            }
            ticking = true;
            window.requestAnimationFrame(function () {
                onScroll();
                ticking = false;
            });
        }, { passive: true });

        onScroll();
    }

    /* ---------------------------------------------------------
       3. INSTAGRAM EMBED WIDTH SYNC
       Instagram's embed.js measures each card's width once, when
       it first processes the page. On mobile that can happen
       before our grid has settled, leaving cards at inconsistent
       widths. Re-running Instagram's own processor after load
       (and after resize) keeps every embed aligned.
       --------------------------------------------------------- */
    function reprocessInstagramEmbeds() {
        if (window.instgrm && window.instgrm.Embeds) {
            window.instgrm.Embeds.process();
        }
    }

    function initInstagramSync() {
        window.addEventListener('load', function () {
            setTimeout(reprocessInstagramEmbeds, 300);
        });

        var resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(reprocessInstagramEmbeds, 300);
        });
    }

    /* --- BOOT --- */
    function init() {
        initScrollReveal();
        initNav();
        initInstagramSync();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
