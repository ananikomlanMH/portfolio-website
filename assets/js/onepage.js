(function () {
    'use strict';
    // A little hello for developers exploring the portfolio.
    console.info('%c' + [
        "  /$$$$$$  /$$   /$$  /$$$$$$  /$$   /$$ /$$$$$$       /$$   /$$  /$$$$$$  /$$      /$$ /$$        /$$$$$$  /$$   /$$",
        " /$$__  $$| $$$ | $$ /$$__  $$| $$$ | $$|_  $$_/      | $$  /$$/ /$$__  $$| $$$    /$$$| $$       /$$__  $$| $$$ | $$",
        "| $$  \\ $$| $$$$| $$| $$  \\ $$| $$$$| $$  | $$        | $$ /$$/ | $$  \\ $$| $$$$  /$$$$| $$      | $$  \\ $$| $$$$| $$",
        "| $$$$$$$$| $$ $$ $$| $$$$$$$$| $$ $$ $$  | $$        | $$$$$/  | $$  | $$| $$ $$/$$ $$| $$      | $$$$$$$$| $$ $$ $$",
        "| $$__  $$| $$  $$$$| $$__  $$| $$  $$$$  | $$        | $$  $$  | $$  | $$| $$  $$$| $$| $$      | $$__  $$| $$  $$$$",
        "| $$  | $$| $$\\  $$$| $$  | $$| $$\\  $$$  | $$        | $$\\  $$ | $$  | $$| $$\\  $ | $$| $$      | $$  | $$| $$\\  $$$",
        "| $$  | $$| $$ \\  $$| $$  | $$| $$ \\  $$ /$$$$$$      | $$ \\  $$|  $$$$$$/| $$ \\/  | $$| $$$$$$$$| $$  | $$| $$ \\  $$",
        "|__/  |__/|__/  \\__/|__/  |__/|__/  \\__/|______/      |__/  \\__/ \\______/ |__/     |__/|________/|__/  |__/|__/  \\__/"
    ].join('\n'), 'font-family: monospace; font-size: 10px; line-height: 1.15; color: ' +
        (document.documentElement.dataset.theme === 'dark' ? '#ffea00' : '#806b00'));
    console.info([
        "ANANI KOMLAN | Software Engineer",
        "Backend & Architecture | Open Source",
        "",
        "Tiens, un dev dans les coulisses. Bienvenue !",
        "Tu as ouvert la console. Le code review commence donc ici.",
        "J'aime les API claires, les architectures solides",
        "et les bugs qui se reproduisent du premier coup. On peut r\u00eaver.",
        "",
        "Un bug rep\u00e9r\u00e9 ? Une id\u00e9e ? Un projet \u00e0 construire ?",
        "Discutons : inanakomlan@gmail.com",
        "Niamey, Niger | https://portfolio.ananikmh17.workers.dev/",
        "",
        "// TODO: prendre un caf\u00e9, puis simplifier encore ce code."
    ].join('\n'));

    var projectDialog = document.getElementById('project-drawer');
    var projects = JSON.parse(document.getElementById('project-data').textContent);
    var sliders = [],
        activeDialog = null,
        opener = null,
        previousOverflow,
        closeTimer;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    function syncAutoplay() {
        sliders.forEach(function (entry) {
            var paused =
                activeDialog ||
                document.hidden ||
                reducedMotion.matches ||
                entry.element.matches(':hover') ||
                entry.element.contains(document.activeElement);
            if (paused) entry.swiper.autoplay.stop();
            else entry.swiper.autoplay.start();
        });
    }
    document.querySelectorAll('.project-swiper').forEach(function (element) {
        if (typeof Swiper === 'undefined') return;
        var swiper = new Swiper(element, {
            slidesPerView: 1.12,
            spaceBetween: 20,
            speed: 850,
            rewind: true,
            grabCursor: true,
            autoplay: { delay: 3800, disableOnInteraction: false, pauseOnMouseEnter: true },
            breakpoints: { 768: { slidesPerView: 2, spaceBetween: 25 }, 1200: { slidesPerView: 3, spaceBetween: 30 } },
            a11y: {
                enabled: true,
                paginationBulletMessage: 'Aller au projet {{index}}',
                slideLabelMessage: '{{index}} sur {{slidesLength}}'
            }
        });
        sliders.push({ element: element, swiper: swiper });
        ['mouseenter', 'mouseleave', 'focusin'].forEach(function (name) {
            element.addEventListener(name, syncAutoplay);
        });
        element.addEventListener('focusout', function () {
            requestAnimationFrame(syncAutoplay);
        });
    });
    function openDrawer(dialog, trigger) {
        if (activeDialog) return;
        opener = trigger;
        activeDialog = dialog;
        previousOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'hidden';
        dialog.classList.remove('is-closing', 'is-visible');
        dialog.showModal();
        dialog.querySelector('.drawer-panel').scrollTop = 0;
        dialog.querySelector('.drawer-close').focus();
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                if (dialog.open && !dialog.classList.contains('is-closing')) dialog.classList.add('is-visible');
            });
        });
        syncAutoplay();
    }
    function closeDrawer(dialog) {
        if (!dialog.open || dialog.classList.contains('is-closing')) return;
        dialog.classList.add('is-closing');
        dialog.classList.remove('is-visible');
        closeTimer = setTimeout(
            function () {
                dialog.close();
            },
            reducedMotion.matches ? 0 : 420
        );
    }
    document.querySelectorAll('.project-drawer').forEach(function (dialog) {
        dialog.querySelector('.drawer-close').addEventListener('click', function () {
            closeDrawer(dialog);
        });
        dialog.addEventListener('click', function (e) {
            if (e.target === dialog) closeDrawer(dialog);
        });
        dialog.addEventListener('cancel', function (e) {
            e.preventDefault();
            closeDrawer(dialog);
        });
        dialog.addEventListener('close', function () {
            clearTimeout(closeTimer);
            dialog.classList.remove('is-visible', 'is-closing');
            document.documentElement.style.overflow = previousOverflow;
            activeDialog = null;
            if (opener) opener.focus({ preventScroll: true });
            syncAutoplay();
        });
    });
    document.addEventListener('click', function (event) {
        var trigger = event.target.closest('[data-project]');
        if (trigger) {
            var project = projects[trigger.dataset.project];
            if (!project) return;
            ['title', 'category', 'description', 'organization'].forEach(function (key) {
                document.getElementById('drawer-' + key).textContent = project[key === 'title' ? 'name' : key];
            });
            document.getElementById('drawer-image').src = project.image;
            openDrawer(projectDialog, trigger);
        }
        var booking = event.target.closest('[data-open-booking]');
        if (booking) {
            initializeBookingCalendar();
            openDrawer(document.getElementById('booking-drawer'), booking);
        }
    });
    // Animer les cartes sans modifier les transformations utilisées par Swiper.
    var observer =
        'IntersectionObserver' in window
            ? new IntersectionObserver(
                  function (entries) {
                      entries.forEach(function (entry) {
                          if (entry.isIntersecting) {
                              entry.target.classList.add('is-revealed');
                              observer.unobserve(entry.target);
                          }
                      });
                  },
                  { threshold: 0.08 }
              )
            : null;
    document.querySelectorAll('.project-reveal').forEach(function (theme) {
        theme.querySelectorAll('.card-reveal').forEach(function (card, index) {
            card.style.setProperty('--reveal-delay', (index % 3) * 130 + 'ms');
        });
        if (observer && !reducedMotion.matches) {
            theme.classList.add('reveal-ready');
            observer.observe(theme);
        }
    });
    var header = document.querySelector('.smart-header'),
        lastY = window.scrollY,
        directionAnchor = lastY,
        direction = 0,
        queued = false;
    var menuOrder = header.querySelector('.menu-order');
    var navLinks = Array.from(document.querySelectorAll('.navbar-nav .nav-link'));
    // Le menu mobile est cloné : regrouper les liens par section, pas par index.
    var sectionIds = Array.from(new Set(navLinks.map(function (link) {
        return link.getAttribute('href');
    })));
    var sections = sectionIds.map(function (id) { return document.querySelector(id); });
    var navLists = Array.from(document.querySelectorAll('.navbar-nav'));
    var aboutSection = document.getElementById('a-propos');
    var contactSection = document.getElementById('contact');
    function hasReachedAbout() {
        return !!aboutSection && aboutSection.getBoundingClientRect().top <= 35;
    }
    function updateNavIndicators() {
        navLists.forEach(function (list) {
            var activeLink = list.querySelector('.nav-link.active');
            if (!activeLink) {
                list.style.setProperty('--nav-active-opacity', '0');
                return;
            }
            var listRect = list.getBoundingClientRect();
            var linkRect = activeLink.getBoundingClientRect();
            if (!linkRect.width || !linkRect.height) {
                list.style.setProperty('--nav-active-opacity', '0');
                return;
            }
            var style = getComputedStyle(activeLink);
            var left = parseFloat(style.paddingLeft) || 0;
            var right = parseFloat(style.paddingRight) || 0;
            var x = linkRect.left - listRect.left + left;
            var width = Math.max(0, linkRect.width - left - right);
            var y = linkRect.bottom - listRect.top - 7;
            list.style.setProperty('--nav-active-x', x + 'px');
            list.style.setProperty('--nav-active-y', y + 'px');
            list.style.setProperty('--nav-active-width', width + 'px');
            list.style.setProperty('--nav-active-opacity', '1');
        });
    }
    function updateCurrent() {
        var current = -1;
        sections.forEach(function (section, index) {
            if (section && section.getBoundingClientRect().top <= 35) current = index;
        });
        // The short footer can dominate the viewport before reaching its top edge.
        if (hasReachedAbout() && contactSection) {
            var contactRect = contactSection.getBoundingClientRect();
            var visibleContact = Math.max(0, Math.min(contactRect.bottom, window.innerHeight) - Math.max(contactRect.top, 0));
            var contactThreshold = Math.min(contactRect.height, window.innerHeight) * 0.5;
            if (contactRect.height > 0 && contactRect.top <= window.innerHeight * 0.5 && visibleContact >= contactThreshold) {
                current = sectionIds.indexOf('#contact');
            }
        }
        if (hasReachedAbout() && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 5)
            current = sections.length - 1;
        navLinks.forEach(function (link) {
            var active = link.getAttribute('href') === sectionIds[current];
            link.classList.toggle('current', active);
            link.classList.toggle('active', active);
            link.closest('.nav-item').classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
        updateNavIndicators();
    }
    function updateHeader() {
        var y = Math.max(0, window.scrollY),
            delta = y - lastY;
        var nextDirection = Math.sign(delta);
        if (nextDirection && nextDirection !== direction) {
            directionAnchor = lastY;
            direction = nextDirection;
        }
        var mobileHeader = window.innerWidth < 1200;
        var pilled = hasReachedAbout();
        header.classList.toggle('is-pilled', pilled);
        var hideMenu = !pilled && y > 70;
        if (menuOrder) {
            menuOrder.classList.toggle('is-before-about-hidden', hideMenu);
            menuOrder.inert = hideMenu;
            if (hideMenu) menuOrder.setAttribute('aria-hidden', 'true');
            else menuOrder.removeAttribute('aria-hidden');
        }
        var menuOpen =
            document.body.classList.contains('navbar-collapse-show') ||
            header.querySelector('.navbar-toggler[aria-expanded="true"]');
        if (mobileHeader || !pilled || menuOpen) header.classList.remove('is-hidden');
        else if (Math.abs(y - directionAnchor) >= 8) header.classList.toggle('is-hidden', direction > 0);
        updateCurrent();
        lastY = y;
        queued = false;
    }
    window.addEventListener(
        'scroll',
        function () {
            if (!queued) {
                queued = true;
                requestAnimationFrame(updateHeader);
            }
        },
        { passive: true }
    );
    header.addEventListener('focusin', function () {
        header.classList.remove('is-hidden');
    });
    window.addEventListener('resize', updateHeader);
    // Home points to the document origin, not the section's header-offset position.
    function scrollHomeToTop(behavior) {
        window.scrollTo({ top: 0, left: 0, behavior: behavior });
        updateHeader();
    }
    function syncHomeAnchor() {
        if (window.location.hash !== '#accueil') return;
        requestAnimationFrame(function () { scrollHomeToTop('instant'); });
    }
    document.addEventListener('click', function (event) {
        if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        var link = event.target.closest('a[href]');
        if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
        var target = new URL(link.href, window.location.href);
        var normalizePath = function (path) { return path.replace(/\/index\.html$/, '/'); };
        if (target.hash !== '#accueil' || target.origin !== window.location.origin ||
            normalizePath(target.pathname) !== normalizePath(window.location.pathname) || target.search !== window.location.search) return;
        event.preventDefault();
        if (window.location.hash !== '#accueil') window.history.pushState(null, '', target.href);
        scrollHomeToTop(reducedMotion.matches ? 'instant' : 'smooth');
    });
    window.addEventListener('hashchange', syncHomeAnchor);
    window.addEventListener('load', syncHomeAnchor);
    if (document.readyState === 'complete') syncHomeAnchor();
    window.addEventListener('hashchange', updateHeader);
    window.addEventListener('load', updateHeader);
    document.addEventListener('shown.bs.collapse', updateNavIndicators);
    document.addEventListener('transitionend', function (event) {
        if (event.target.closest('.navbar-nav, .navbar-full-screen-menu-inner, .nav-pill-wrap')) {
            updateNavIndicators();
        }
    });
    if ('ResizeObserver' in window) {
        var navSizeObserver = new ResizeObserver(updateNavIndicators);
        navLists.concat(navLinks).forEach(function (element) { navSizeObserver.observe(element); });
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(updateNavIndicators);
    updateHeader();
    // Les créneaux sont proposés par e-mail ; aucun agenda distant n’est consulté.
    var bookingCalendar = null;
    function initializeBookingCalendar() {
        if (bookingCalendar) { bookingCalendar(); return; }
        function todayInNiamey() {
        var parts = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Africa/Niamey',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).formatToParts(new Date());
        var values = {};
        parts.forEach(function (p) {
            values[p.type] = p.value;
        });
        return new Date(+values.year, +values.month - 1, +values.day);
    }
    var today = todayInNiamey(),
        month = new Date(today.getFullYear(), today.getMonth(), 1),
        selected = null,
        selectedTime = null;
    var dayGrid = document.getElementById('calendar-days'),
        times = document.getElementById('booking-times');
    var submit = document.getElementById('booking-submit');
    function renderCalendar() {
        today = todayInNiamey();
        document.getElementById('calendar-month').textContent = month.toLocaleDateString('fr-FR', {
            month: 'long',
            year: 'numeric'
        });
        document.getElementById('previous-month').disabled =
            month <= new Date(today.getFullYear(), today.getMonth(), 1);
        dayGrid.replaceChildren();
        var offset = (month.getDay() + 6) % 7;
        for (var i = 0; i < offset; i++) dayGrid.appendChild(document.createElement('span'));
        var count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
        for (var day = 1; day <= count; day++) {
            var date = new Date(month.getFullYear(), month.getMonth(), day),
                button = document.createElement('button');
            button.type = 'button';
            button.textContent = day;
            button.dataset.day = day;
            button.disabled = date <= today;
            button.setAttribute(
                'aria-label',
                date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
            );
            button.setAttribute('aria-pressed', String(!!selected && selected.getTime() === date.getTime()));
            dayGrid.appendChild(button);
        }
    }
    dayGrid.addEventListener('click', function (event) {
        var button = event.target.closest('button[data-day]');
        if (!button || button.disabled) return;
        selected = new Date(month.getFullYear(), month.getMonth(), +button.dataset.day);
        selectedTime = null;
        renderCalendar();
        renderTimes();
    });
    function renderTimes() {
        document.getElementById('selected-date').textContent = selected.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
        times.replaceChildren();
        ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '15:00', '15:30', '16:00', '16:30', '17:00'].forEach(
            function (time) {
                var button = document.createElement('button');
                button.type = 'button';
                button.textContent = time;
                button.dataset.time = time;
                button.setAttribute('aria-pressed', String(time === selectedTime));
                times.appendChild(button);
            }
        );
        submit.disabled = !selectedTime;
    }
    times.addEventListener('click', function (event) {
        var button = event.target.closest('[data-time]');
        if (!button) return;
        selectedTime = button.dataset.time;
        renderTimes();
    });
    ['previous', 'next'].forEach(function (direction) {
        document.getElementById(direction + '-month').addEventListener('click', function () {
            month = new Date(month.getFullYear(), month.getMonth() + (direction === 'next' ? 1 : -1), 1);
            renderCalendar();
        });
    });
    document.getElementById('booking-form').addEventListener('submit', function (event) {
        event.preventDefault();
        if (!selected || !selectedTime || selected <= todayInNiamey()) {
            document.getElementById('booking-status').textContent = 'Choisissez une date future et un horaire.';
            return;
        }
        var form = new FormData(event.target),
            date = selected.toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        var body =
            'Bonjour Anani,\n\nJe souhaite proposer un échange de 30 minutes le ' +
            date +
            ' à ' +
            selectedTime +
            ' (Niamey, UTC+1).\n\nNom : ' +
            form.get('name') +
            '\nE-mail : ' +
            form.get('email') +
            '\nBesoin : ' +
            form.get('topic') +
            '\n\n' +
            form.get('message') +
            '\n\nMerci de me confirmer votre disponibilité.';
        window.location.href =
            'mailto:inanakomlan@gmail.com?subject=' +
            encodeURIComponent('Demande d’appel — ' + date + ' à ' + selectedTime) +
            '&body=' +
            encodeURIComponent(body);
        document.getElementById('booking-status').textContent =
            'Envoyez le message préparé dans votre messagerie pour transmettre la demande. Le rendez-vous sera confirmé par e-mail.';
    });
        bookingCalendar = renderCalendar;
        renderCalendar();
    }
    document.addEventListener('visibilitychange', syncAutoplay);
    reducedMotion.addEventListener('change', syncAutoplay);
    syncAutoplay();
})();
