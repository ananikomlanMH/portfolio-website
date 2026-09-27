(function ($) {
    'use strict';
    const animeBreakPoint = 1199;
    const headerTransition = 300;
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) $('body').addClass('is-touchable');
    $('footer, [data-anime], [data-fancy-text]').each(function () {
        $(this).appear().trigger('resize');
    });

    // Le menu plein écran réutilise le balisage et les transitions du template.
    if (!$('.navbar-full-screen-menu-inner').length) {
        $('section').wrapAll('<div class="page-layout"></div>');
        $('.navbar .navbar-toggler').clone(true).addClass('navbar-toggler-clone').insertAfter('.page-layout');
        $('.navbar .navbar-collapse')
            .clone(true)
            .addClass('navbar-collapse-clone')
            .attr('id', 'navbarNav-clone')
            .insertAfter('.page-layout');
        $('.navbar-toggler-clone, .navbar-collapse-clone').wrapAll('<div class="navbar-full-screen-menu-inner"></div>');
        $('.navbar-toggler')
            .attr('data-bs-target', '#navbarNav-clone')
            .attr('data-target', '#navbarNav-clone')
            .attr('aria-controls', 'navbarNav-clone');
        if (typeof $.fn.mCustomScrollbar === 'function')
            $('.navbar-collapse-clone').mCustomScrollbar({ theme: 'light' });
    }
    function closeMenu() {
        $('.navbar-collapse.collapse').collapse('hide');
    }
    $('.navbar-collapse.collapse')
        .on('show.bs.collapse', function () {
            $('body').addClass('navbar-collapse-show');
            $('html').addClass('overflow-hidden');
            $('.navbar-full-screen-menu-inner').css('background', $('body').attr('data-mobile-nav-bg-color'));
            $('.navbar-collapse-clone').css('max-height', getWindowHeight());
        })
        .on('hide.bs.collapse', function () {
            $('body').removeClass('navbar-collapse-show');
            $('html').removeClass('overflow-hidden');
        });
    $(document).on('keydown', function (event) {
        if (event.key === 'Escape') closeMenu();
    });
    $(document).on('click', function (event) {
        if (!$(event.target).closest('.navbar-full-screen-menu-inner, .navbar-toggler').length) closeMenu();
    });
    if (typeof $.fn.smoothScroll === 'function') {
        $('.inner-link').smoothScroll({ speed: 800, offset: 1, beforeScroll: closeMenu });
    }
    function getHeaderHeight() {
        return $('header nav.navbar').outerHeight() || 0;
    }
    function setTopSpaceHeight() {
        $('.top-space-margin').css('margin-top', getHeaderHeight());
    }
    function getWindowHeight() {
        return $(window).height();
    }
    function getWindowWidth() {
        return $(window).width();
    }
    function fullScreenHeight() {
        $('.full-screen').css('height', getWindowHeight() - getHeaderHeight());
    }
    function animeAnimation(target, options) {
        let child = target;
        let staggerValue = options.staggervalue || 0;
        let delay = options.delay || 0;
        let anime_animation = anime.createTimeline();

        function applyTransitionStyles(elements) {
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                element.style.opacity = 0;
                element.style.transition = 'none';
                element.style.transform = 'none';
            }
        }

        if (options.el === 'childs') {
            child = target.children;
            applyTransitionStyles(target.children);
        }

        if (options.el === 'lines') {
            function lineSplitting() {
                const lines = Splitting({
                    target: target,
                    by: 'lines'
                });
                const line = lines[0].lines.map((item) => item.map((i) => i.innerHTML).join(' '));
                target.innerHTML = line.map((item) => `<span class="d-inline-flex">${item}</span>`).join(' ');
            }
            lineSplitting();
            applyTransitionStyles(target.children);
            child = target.children;
        }

        if (options.perspective) {
            target.style.perspective = `${options.perspective}px`;
        }

        anime_animation.add(child, {
            ...options,
            delay: anime.stagger(staggerValue, {
                start: delay
            }),
            onComplete: function () {
                if (options.el) {
                    target.classList.add('anime-child');
                    target.classList.add('anime-complete');

                    for (let i = 0; i < target.children.length; i++) {
                        const element = target.children[i];
                        element.style.removeProperty('opacity');
                        element.style.removeProperty('transform');
                        element.style.removeProperty('transition');
                    }

                    if (options.el === 'lines') {
                        for (let i = 0; i < target.children.length; i++) {
                            const element = target.children[i];
                            element.classList.remove('d-inline-flex');
                            element.classList.add('d-inline');
                            element.style.willChange = 'inherit';
                        }
                    }
                } else {
                    target.classList.add('anime-complete');
                    target.style.removeProperty('opacity');
                    target.style.removeProperty('transform');
                    target.style.removeProperty('transition');
                }
            }
        });
    }

    const $dataAnimeElements = $('[data-anime]:not(.swiper [data-anime])');

    $dataAnimeElements.each(function () {
        const $self = $(this);
        const animeOptions = $self.data('anime');

        const delayValue = animeOptions.delay;

        if (animeOptions && getWindowWidth() > animeBreakPoint) {
            try {
                $self.on('appear', function () {
                    if ($self.hasClass('appear') || $self.hasClass('animating')) {
                        return;
                    }
                    $self.addClass('animating');

                    if (!$self.hasClass('appear')) {
                        setTimeout(function () {
                            $self.removeClass('animating').addClass('appear');
                        }, delayValue);

                        animeAnimation(this, animeOptions);
                    }
                });
            } catch (error) {
                console.error('Error parsing anime options:', error);
            }
        } else {
            $self.removeAttr('data-anime');
            $('body').addClass('no-animation');
        }
    });

    function revealSectionTitles() {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

        const titles = Array.from(
            document.querySelectorAll('section h2, section h3, section h4, #expertise .row.mb-7 .text-uppercase')
        ).filter((title) => !title.closest('[data-anime], .project-reveal, [data-title-reveal]'));
        const pending = new Map();
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const content = pending.get(entry.target);
                    if (!content) return;
                    observer.unobserve(entry.target);
                    pending.delete(entry.target);
                    animeAnimation(content, {
                        opacity: [0, 1],
                        translateY: [26, 0],
                        duration: 800,
                        ease: 'outQuad'
                    });
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -35px 0px' }
        );

        titles.forEach((title) => {
            // Animer le contenu préserve le positionnement sticky du titre.
            const content = document.createElement('span');
            content.style.display = 'block';
            content.style.opacity = '0';
            while (title.firstChild) content.appendChild(title.firstChild);
            title.appendChild(content);
            title.setAttribute('data-title-reveal', '');
            pending.set(title, content);
            observer.observe(title);
        });

        reducedMotion.addEventListener('change', () => {
            if (!reducedMotion.matches) return;
            observer.disconnect();
            pending.forEach((content) => content.style.removeProperty('opacity'));
            pending.clear();
        });
    }

    revealSectionTitles();

    const rotateTextAnimation = (target, options) => {
        let duration = options.duration ? options.duration : 3000,
            content = options.string,
            speed = options.speed,
            rotateText = anime.createTimeline();
        const rotateTextchar = target.querySelectorAll('.anime-text > .word > .char');
        rotateTextchar.forEach((rotate) => {
            rotate.style.opacity = 0;
            rotate.style.transform = 'none';
            rotate.style.willChange = 'transform';
        });

        rotateText
            .add(rotateTextchar, {
                opacity: [0, 1],
                rotateX: [-70, 0],
                duration: 150,
                delay: anime.stagger(speed ? speed : 50),
                ease: 'linear'
            })
            .add(rotateTextchar, {
                opacity: content.length > 1 ? 0 : 1,
                rotateX: content.length > 1 ? [0, 70] : [0, 0],
                duration: 150,
                delay: anime.stagger(speed ? speed : 50, {
                    start: duration - 1500
                }),
                ease: 'linear'
            });
    };

    const rubberbandTextAnimation = (target, options) => {
        let duration = options.duration || 3000,
            content = options.string,
            speed = options.speed || 75,
            direction = options.direction,
            rubberband = anime.createTimeline();

        const rubberbandchars = target.querySelectorAll('.anime-text > .word > .char');
        if (!rubberbandchars.length) return;

        rubberbandchars.forEach((rubberBand) => {
            rubberBand.style.opacity = 0;
            rubberBand.style.transform = 'none';
            rubberBand.style.willChange = 'transform';
        });

        rubberband
            .add(rubberbandchars, {
                translateX: direction === 'right' ? [-40, 0] : [40, 0],
                translateZ: 0,
                opacity: [0, 1],
                ease: 'outExpo',
                duration: 1200,
                delay: anime.stagger(speed, {
                    direction: direction === 'right' ? 'reverse' : 'normal'
                })
            })
            .add(rubberbandchars, {
                translateX: content.length > 1 ? (direction === 'left' ? -40 : 40) : 0,
                opacity: content.length > 1 ? 0 : 1,
                ease: 'inExpo',
                duration: 500,
                delay: anime.stagger(speed, {
                    start: duration - 2500,
                    direction: direction === 'right' ? 'reverse' : 'normal'
                })
            });
    };

    function FancyTextDefault(item, ftOptions) {
        let text_effect = ftOptions.effect,
            duration = ftOptions.duration ? ftOptions.duration : 3000,
            content = ftOptions.string;

        if (content) {
            item.innerHTML = `<span class="anime-text">${content[0]}</span>`;
            item.querySelector('.anime-text').setAttribute('data-splitting', true);
            Splitting();

            if (getWindowWidth() > animeBreakPoint) {
                switch (text_effect) {
                    case 'rotate':
                        rotateTextAnimation(item, ftOptions);
                        break;

                    case 'rubber-band':
                        rubberbandTextAnimation(item, ftOptions);
                        break;

                    default:
                }
            }

            if (content.length > 1) {
                let counter = 1;
                setInterval(function () {
                    let new_el = document.createElement('span');
                    new_el.classList.add('anime-text');
                    new_el.innerHTML = content[counter];
                    new_el.setAttribute('data-splitting', true);

                    item.querySelector('.anime-text').replaceWith(new_el);
                    Splitting();
                    counter++;

                    if (counter === content.length) {
                        counter = 0;
                    }

                    switch (text_effect) {
                        case 'rotate':
                            rotateTextAnimation(item, ftOptions);
                            break;

                        case 'rubber-band':
                            rubberbandTextAnimation(item, ftOptions);
                            break;

                        default:
                    }
                }, duration);
            }
        }
    }

    $('[data-fancy-text]').each(function () {
        const _this = $(this);
        const ftOptions = _this.data('fancy-text');
        if (ftOptions) {
            _this.on('appear', function () {
                if (!_this.hasClass('appear')) {
                    _this.addClass('appear');
                    FancyTextDefault(this, ftOptions);
                }
            });
        }
    });

    if ($('.magic-cursor').length > 0) {
        $('<div class="magic-cursor-wrapper"><div id="ball-cursor"><div id="ball-cursor-loader"></div></div></div>')
            .clone(false)
            .appendTo('body');

        if ($('.magic-cursor').hasClass('round-cursor')) {
            $('.magic-cursor-wrapper').addClass('magic-round-cursor');
        }

        var mouse = {
                x: 0,
                y: 0
            },
            pos = {
                x: 0,
                y: 0
            },
            ratio = 0.65,
            active = !1,
            ball = document.getElementById('ball-cursor');

        function mouseMove(e) {
            var a = window.pageYOffset || document.documentElement.scrollTop;
            ((mouse.x = e.pageX), (mouse.y = e.pageY - a));
        }

        function updatePosition() {
            active ||
                ((pos.x += (mouse.x - pos.x) * ratio),
                (pos.y += (mouse.y - pos.y) * ratio),
                TweenLite.to(ball, 0.4, {
                    x: pos.x,
                    y: pos.y
                }));
        }
        if (typeof TweenLite !== 'undefined') {
            TweenLite.set(ball, {
                xPercent: -50,
                yPercent: -50,
                scale: 0,
                borderWidth: '0',
                opacity: 1
            });
        }
        document.addEventListener('mousemove', mouseMove);
        if (typeof gsap !== 'undefined') {
            gsap.ticker.add(updatePosition);
        }

        if (typeof TweenMax !== 'undefined' && typeof TweenMax !== null) {
            $('.magic-cursor').mouseenter(function (e) {
                TweenMax.to('#ball-cursor', 0.3, {
                    borderWidth: '2px',
                    scale: 1
                });
                TweenMax.to('#ball-cursor-loader', 0.2, {
                    borderWidth: '2px',
                    top: 2,
                    left: 2
                });
                $('.magic-cursor-wrapper').addClass('sliderhover');
            });
        }
        if (typeof TweenMax !== 'undefined' && typeof TweenMax !== null) {
            $('.magic-cursor').mouseleave(function (e) {
                TweenMax.to('#ball-cursor', 0.3, {
                    borderWidth: '2px',
                    scale: 1,
                    borderColor: 'transparent',
                    opacity: 1
                });
                TweenMax.to('#ball-cursor-loader', 0.2, {
                    borderWidth: '2px',
                    top: 0,
                    left: 0
                });
                $('.magic-cursor-wrapper').removeClass('sliderhover');
            });
        }
    }

    $(document)
        .on('mouseenter', 'a', function () {
            $('.magic-cursor-wrapper').css({
                'opacity': 0
            });
        })
        .on('mouseleave', 'a', function () {
            $('.magic-cursor-wrapper').css({
                'opacity': 1
            });
        });

    $(window).scroll(function (event) {
        $('[data-shadow-animation="true"]').each(function () {
            addBoxAnimationClass($(this));
        });
    });

    $('[data-shadow-animation="true"]').removeClass('shadow-in');

    $('[data-shadow-animation="true"]').each(function () {
        addBoxAnimationClass($(this));
    });

    function addBoxAnimationClass(boxObj) {
        if (boxObj.length) {
            var w = boxObj.width();
            var h = boxObj.height();
            var offset = boxObj.offset();
            var right = offset.left + parseInt(boxObj.width());
            var bottom = offset.top + parseInt(boxObj.height());
            var visibleX = Math.max(
                0,
                Math.min(w, window.pageXOffset + window.innerWidth - offset.left, right - window.pageXOffset)
            );
            var visibleY = Math.max(
                0,
                Math.min(h, window.pageYOffset + window.innerHeight - offset.top, bottom - window.pageYOffset)
            );
            var visible = (visibleX * visibleY) / (w * h);
            if (visible >= 0.5) {
                if (
                    typeof boxObj.attr('data-animation-delay') !== 'undefined' &&
                    boxObj.attr('data-animation-delay') > 10
                ) {
                    setTimeout(function () {
                        boxObj.addClass('shadow-in');
                    }, boxObj.attr('data-animation-delay'));
                } else {
                    boxObj.addClass('shadow-in');
                }
            }
        }
    }

    var skroller;

    function initSkrollr() {
        if (typeof skrollr !== 'undefined' && typeof skrollr !== null) {
            skroller = skrollr.init({
                'forceHeight': false,
                'smoothScrollingDuration': 1000,
                'mobileCheck': function () {
                    return false;
                }
            });
        }
    }

    function destroySkrollr() {
        if (typeof skroller !== typeof undefined && skroller != 'undefined') {
            skroller.destroy();
        }
    }

    if ($(window).width() >= 1200) {
        initSkrollr();
    }

    $('[data-particle="true"]').each(function () {
        if (typeof particlesJS === 'function')
            particlesJS(this.id, JSON.parse(this.getAttribute('data-particle-options')));
    });

    var customCursorInit = false;

    handleCustomCursor();

    forceHideCustomCursor();

    $(window).resize(function () {
        if (
            !customCursorInit &&
            !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        ) {
            handleCustomCursor();
        }
        forceHideCustomCursor();
    });

    function forceHideCustomCursor() {
        setTimeout(function () {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                $('.cursor-page-inner').hide();
            } else {
                $('.cursor-page-inner').show();
            }
        }, 250);
    }

    function handleCustomCursor() {
        if ($('body').hasClass('custom-cursor')) {
            const cursorInnerEl = document.querySelector('.circle-cursor-inner');
            const cursorOuterEl = document.querySelector('.circle-cursor-outer');

            if (!cursorInnerEl || !cursorOuterEl) {
                console.warn('Custom cursor elements not found.');
                return;
            }

            customCursorInit = true;

            window.onmousemove = function (event) {
                cursorOuterEl.style.transform = 'translate(' + event.clientX + 'px, ' + event.clientY + 'px' + ')';
                if ((cursorInnerEl.style.opacity = '0')) {
                    cursorInnerEl.style.opacity = '1';
                }
                cursorInnerEl.style.transform = 'translate(' + event.clientX + 'px, ' + event.clientY + 'px' + ')';
            };

            $('body').on('mouseenter', 'a', function () {
                cursorInnerEl.classList.add('cursor-link-hover');
                cursorOuterEl.classList.add('cursor-link-hover');
            });

            $('body').on('mouseenter', '.magic-cursor', function () {
                cursorInnerEl.style.visibility = 'hidden';
                cursorOuterEl.style.visibility = 'hidden';
            });

            $('body').on('mouseleave', '.magic-cursor', function () {
                cursorInnerEl.style.visibility = 'visible';
                cursorOuterEl.style.visibility = 'visible';
            });

            $('body').on('mouseleave', 'a', function () {
                cursorInnerEl.classList.remove('cursor-link-hover');
                cursorOuterEl.classList.remove('cursor-link-hover');
            });

            cursorInnerEl.style.visibility = 'visible';
            cursorOuterEl.style.visibility = 'visible';
        }
    }

    $(document)
        .on('appear', 'footer', function (e) {
            $('.sticky-wrap').addClass('sticky-hidden');
        })
        .on('disappear', 'footer', function (e) {
            $('.sticky-wrap').removeClass('sticky-hidden');
        });

    $(document).on('click', '.scroll-top', function () {
        $('html, body').animate(
            {
                scrollTop: 0
            },
            800
        );
        return false;
    });

    function scrollIndicator() {
        var scrollTop = document.documentElement.scrollTop;
        if (scrollTop > 200) {
            $('.scroll-progress').addClass('visible');
        } else {
            $('.scroll-progress').removeClass('visible');
        }

        var scrollHeight = document.documentElement.scrollHeight;
        var windowHeight = document.documentElement.clientHeight;
        var maxScrollTop = scrollHeight - windowHeight;
        var scrollTop = document.documentElement.scrollTop;
        var scrollPercentage = (scrollTop / (maxScrollTop - 200)) * 100;

        $('.scroll-point').css('height', Math.min(scrollPercentage, 100) + '%');
    }

    $(window).scroll(function () {
        scrollIndicator();
    });
    function updateLayout() {
        fullScreenHeight();
        setTopSpaceHeight();
        if ($.fn.mCustomScrollbar) $('.navbar-collapse-clone').mCustomScrollbar('update');
        if (getWindowWidth() < 1200) destroySkrollr();
        else initSkrollr();
    }
    $(window).on('load', function () {
        $('img:not([data-at2x])').attr('data-no-retina', '');
        setTimeout(updateLayout, headerTransition);
        scrollIndicator();
    });
    $(window).on('resize', updateLayout);
    $(window).on('orientationchange', function () {
        closeMenu();
        setTimeout(updateLayout, headerTransition);
    });
})(jQuery);
