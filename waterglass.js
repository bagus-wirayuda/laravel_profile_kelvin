'use strict';

(() => {
    const waterMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const panelSelector = [
        '.desktop-nav', '.bottom-nav', '.portrait-frame', '.portrait-badge',
        '.stats-grid', '.skill-card', '.company-card', '.profile-card',
        '.education-card', '.quote-content', '.contact-link', '.btn',
        '.header-contact', '.bottom-nav-item', '.company-details summary'
    ].join(', ');
    const panels = [...document.querySelectorAll(panelSelector)];
    const surfaces = new WeakMap();

    panels.forEach((panel, index) => {
        panel.classList.add('waterglass');
        panel.style.setProperty('--water-phase', `${-(index % 7) * 2.3}s`);
        const surface = document.createElement('span');
        surface.className = 'waterglass-surface';
        surface.setAttribute('aria-hidden', 'true');
        panel.append(surface);
        surfaces.set(panel, surface);
    });

    if ('IntersectionObserver' in window) {
        const lightObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                entry.target.classList.toggle('glass-resting', !entry.isIntersecting);
            });
        }, { threshold: 0 });
        panels.forEach(panel => lightObserver.observe(panel));
    }

    function rippleAt(panel, clientX, clientY) {
        if (waterMotion.matches) return;
        const surface = surfaces.get(panel);
        if (!surface) return;
        const rect = panel.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'water-ripple';
        ripple.style.setProperty('--ripple-x', `${clientX - rect.left}px`);
        ripple.style.setProperty('--ripple-y', `${clientY - rect.top}px`);
        ripple.style.setProperty('--ripple-size', `${Math.min(1000, Math.hypot(rect.width, rect.height) * 2)}px`);

        // Keep rapid taps bounded, and remove decorative nodes even in a hidden tab.
        while (surface.querySelectorAll('.water-ripple').length >= 3) {
            surface.querySelector('.water-ripple').remove();
        }
        surface.append(ripple);
        const cleanupTimer = window.setTimeout(() => ripple.remove(), 1400);
        ripple.addEventListener('animationend', () => {
            window.clearTimeout(cleanupTimer);
            ripple.remove();
        }, { once: true });
    }

    document.addEventListener('pointerdown', event => {
        if (!event.isPrimary || event.button !== 0 || !(event.target instanceof Element)) return;
        const panel = event.target.closest('.waterglass');
        if (panel) rippleAt(panel, event.clientX, event.clientY);
    }, { passive: true });

    document.addEventListener('keydown', event => {
        if (event.repeat || !(event.target instanceof Element)) return;
        const control = event.target.closest('a.waterglass, button.waterglass, summary.waterglass');
        const activates = event.key === 'Enter' ||
            (event.key === ' ' && control?.matches('button, summary'));
        if (!control || !activates) return;
        const rect = control.getBoundingClientRect();
        rippleAt(control, rect.left + rect.width / 2, rect.top + rect.height / 2);
    });

    waterMotion.addEventListener('change', () => {
        if (waterMotion.matches) {
            document.querySelectorAll('.water-ripple').forEach(ripple => ripple.remove());
        }
    });
})();
