'use strict';

// Native anchors and <details> remain usable with JavaScript disabled.
const header = document.getElementById('navbar');
const progress = document.querySelector('.scroll-indicator');
const sections = [...document.querySelectorAll('main > section[id]')];
const navGroups = [
    [...document.querySelectorAll('.nav-link')],
    [...document.querySelectorAll('.bottom-nav-item')]
];
let scrollPending = false;

function updateNavigation() {
    const offset = window.innerWidth > 800 ? 130 : 60;
    const currentSection = [...sections].reverse().find(section => section.getBoundingClientRect().top <= offset) || sections[0];
    const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 5;
    const activeSection = atBottom ? sections[sections.length - 1] : currentSection;

    navGroups.forEach(links => {
        const activeIndex = sections.indexOf(activeSection);
        const activeLink = [...links].reverse().find(link => {
            const targetIndex = sections.findIndex(section => `#${section.id}` === link.hash);
            return targetIndex >= 0 && targetIndex <= activeIndex;
        });
        links.forEach(link => {
            const active = link === activeLink;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
    });

    const contactLink = document.querySelector('.header-contact');
    if (contactLink) {
        const contactActive = activeSection.id === 'contact';
        if (contactActive) contactLink.setAttribute('aria-current', 'location');
        else contactLink.removeAttribute('aria-current');
        if (contactActive) navGroups[0].forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        });
    }

    header?.classList.toggle('scrolled', window.scrollY > 24);
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollableHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight)) : 0;
    if (progress) progress.style.transform = `scaleX(${ratio})`;
    scrollPending = false;
}

function scheduleUpdate() {
    if (!scrollPending) {
        scrollPending = true;
        window.requestAnimationFrame(updateNavigation);
    }
}

window.addEventListener('scroll', scheduleUpdate, { passive: true });
window.addEventListener('resize', scheduleUpdate);
window.addEventListener('hashchange', scheduleUpdate);
window.addEventListener('load', scheduleUpdate);
document.getElementById('copyright-year').textContent = String(new Date().getFullYear());
updateNavigation();

// Progressive enhancement: content stays visible without JavaScript or with reduced motion.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const activeCounters = new Map();

function finishCounter(counter) {
    const frame = activeCounters.get(counter);
    if (frame !== undefined) window.cancelAnimationFrame(frame);
    activeCounters.delete(counter);
    counter.querySelector('.counter-value').textContent = counter.dataset.countTo;
    counter.dataset.countComplete = 'true';
}

function animateCounter(counter) {
    if (counter.dataset.countComplete || activeCounters.has(counter)) return;
    if (motionPreference.matches) return finishCounter(counter);

    const target = Number(counter.dataset.countTo);
    const value = counter.querySelector('.counter-value');
    let startedAt;
    const tick = now => {
        startedAt ??= now;
        const ratio = Math.min(1, (now - startedAt) / 1000);
        value.textContent = String(Math.floor(target * (1 - Math.pow(1 - ratio, 2))));
        if (ratio < 1 && !motionPreference.matches) {
            activeCounters.set(counter, window.requestAnimationFrame(tick));
        } else finishCounter(counter);
    };
    activeCounters.set(counter, window.requestAnimationFrame(tick));
}

if (!motionPreference.matches && 'IntersectionObserver' in window) {
    [...document.querySelector('.hero-copy').children].forEach((element, index) => {
        element.style.setProperty('--entrance-order', String(index));
    });
    document.querySelectorAll('.skills-grid, .companies-grid, .timeline, .education-stack, .contact-channels, .stats-grid, .product-list').forEach(group => {
        [...group.children].forEach((element, index) => {
            element.style.setProperty('--reveal-delay', `${(index % 4) * 90}ms`);
        });
    });

    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            entry.target.querySelectorAll('[data-count-to]').forEach(animateCounter);
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

    document.querySelectorAll('.section-heading, .skill-card, .company-card, .profile-card, .education-card, .timeline-item, .quote-content, .contact-link, .stat, .product-list li').forEach(element => {
        element.classList.add('reveal');
        revealObserver.observe(element);
    });
    document.documentElement.classList.add('motion-ready');
}

motionPreference.addEventListener('change', () => {
    if (motionPreference.matches) {
        document.querySelectorAll('[data-count-to]').forEach(finishCounter);
    }
});
document.addEventListener('visibilitychange', () => {
    document.documentElement.classList.toggle('page-hidden', document.hidden);
});

// A subtle reflection follows the pointer on glass panels; touch layouts remain still.
if (!motionPreference.matches && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.skill-card, .company-card, .profile-card, .education-card').forEach(card => {
        card.classList.add('interactive-glass');
        let frame = null;
        let pointer = null;

        card.addEventListener('pointermove', event => {
            pointer = { x: event.clientX, y: event.clientY };
            if (frame !== null) return;
            frame = window.requestAnimationFrame(() => {
                const bounds = card.getBoundingClientRect();
                const x = pointer.x - bounds.left;
                const y = pointer.y - bounds.top;
                card.style.setProperty('--light-x', `${x}px`);
                card.style.setProperty('--light-y', `${y}px`);
                card.style.setProperty('--tilt-x', `${(0.5 - y / bounds.height) * 3}deg`);
                card.style.setProperty('--tilt-y', `${(x / bounds.width - 0.5) * 3}deg`);
                frame = null;
            });
        }, { passive: true });

        card.addEventListener('pointerleave', () => {
            if (frame !== null) window.cancelAnimationFrame(frame);
            frame = null;
            ['--light-x', '--light-y', '--tilt-x', '--tilt-y'].forEach(property => card.style.removeProperty(property));
        });
    });
}
