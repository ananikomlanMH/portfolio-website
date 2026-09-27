(function () {
    'use strict';
    var root = document.documentElement,
        media = window.matchMedia('(prefers-color-scheme: dark)');
    var radios = document.querySelectorAll('input[name="theme-mode"]');
    var video = document.querySelector('video.body-overlay');
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    function syncVideo() {
        if (!video) return;
        video.muted = true;
        if (root.dataset.theme === 'dark' && !reducedMotion.matches && !document.hidden) {
            var playback = video.play();
            if (playback && playback.catch) playback.catch(function () {});
        } else video.pause();
    }
    function apply(mode) {
        if (!['system', 'light', 'dark'].includes(mode)) mode = 'system';
        var dark = mode === 'dark' || (mode === 'system' && media.matches),
            color = dark ? '#f2f2ed' : '#000000';
        root.dataset.themeMode = mode;
        root.dataset.theme = dark ? 'dark' : 'light';
        radios.forEach(function (radio) {
            radio.checked = radio.value === mode;
        });
        syncVideo();
        document.querySelector('meta[name="theme-color"]').content = dark ? '#171717' : '#ffffff';
        document.body.setAttribute('data-mobile-nav-bg-color', dark ? '#171717' : '#ffffff');
        document.querySelectorAll('.navbar-brand img').forEach(function (img) {
            if (!img.dataset.lightSrc) {
                img.dataset.lightSrc = img.getAttribute('src');
                img.dataset.lightRetina = img.getAttribute('data-at2x') || img.src;
            }
            img.setAttribute('src', dark ? 'assets/images/brand/logo-white.png' : img.dataset.lightSrc);
            img.setAttribute('data-at2x', dark ? 'assets/images/brand/logo-white@2x.png' : img.dataset.lightRetina);
        });
        document.querySelectorAll('[data-particle-options]').forEach(function (el) {
            var options = JSON.parse(el.getAttribute('data-particle-options'));
            options.particles.color.value = color;
            el.setAttribute('data-particle-options', JSON.stringify(options));
        });
        (window.pJSDom || []).forEach(function (instance) {
            var particles = instance.pJS.particles;
            particles.color.value = color;
            particles.array.forEach(function (p) {
                p.color.value = color;
                p.color.rgb = dark ? { r: 242, g: 242, b: 237 } : { r: 0, g: 0, b: 0 };
            });
        });
    }
    radios.forEach(function (radio) {
        radio.addEventListener('change', function () {
            if (!radio.checked) return;
            try {
                localStorage.setItem('portfolio-theme', radio.value);
            } catch (e) {}
            apply(radio.value);
        });
    });
    reducedMotion.addEventListener('change', syncVideo);
    document.addEventListener('visibilitychange', syncVideo);
    media.addEventListener('change', function () {
        if (root.dataset.themeMode === 'system') apply('system');
    });
    window.addEventListener('storage', function (e) {
        if (e.key === 'portfolio-theme') apply(e.newValue || 'system');
    });
    window.addEventListener('load', function () {
        apply(root.dataset.themeMode || 'system');
    });
    apply(root.dataset.themeMode || 'system');
})();
