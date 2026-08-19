(function () {
    const progress = document.querySelector('.case-scroll-progress');
    const updateProgress = function () {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const value = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
        if (progress) progress.style.setProperty('--case-scroll-progress', value);
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    const heroTimeline = gsap.timeline({ defaults: { ease: 'power4.out' } });
    heroTimeline
        .from('.case-nav', { opacity: 0, y: -18, duration: 0.55 })
        .from('.case-hero .case-tag', { opacity: 0, y: 18, duration: 0.55 }, '-=0.2')
        .from('.case-hero h1', { opacity: 0, y: 36, duration: 0.8 }, '-=0.28')
        .from('.case-hero .case-tagline', { opacity: 0, y: 22, duration: 0.65 }, '-=0.42')
        .from('.case-hero .case-meta > *', { opacity: 0, y: 12, stagger: 0.08, duration: 0.4 }, '-=0.32')
        .from('.case-project-facts > div', { opacity: 0, y: 16, stagger: 0.08, duration: 0.48 }, '-=0.24')
        .from('.case-hero .case-visual', { opacity: 0, x: 34, rotateY: -5, duration: 0.85 }, '-=0.72');

    gsap.utils.toArray('.case-section-label').forEach(function (label) {
        gsap.from(label, {
            opacity: 0,
            x: -14,
            duration: 0.45,
            ease: 'power3.out',
            scrollTrigger: { trigger: label, start: 'top 88%', once: true }
        });
    });

    gsap.utils.toArray('.case-section h2').forEach(function (heading) {
        gsap.from(heading, {
            opacity: 0,
            y: 24,
            duration: 0.68,
            ease: 'power3.out',
            scrollTrigger: { trigger: heading, start: 'top 86%', once: true }
        });
    });

    gsap.from('.case-deliverable', {
        opacity: 0,
        y: 28,
        scale: 0.97,
        stagger: 0.09,
        duration: 0.58,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.case-deliverables-grid', start: 'top 82%', once: true }
    });

    gsap.utils.toArray('.case-two-col').forEach(function (columns) {
        gsap.from(columns.querySelectorAll('.case-col'), {
            opacity: 0,
            y: 30,
            stagger: 0.12,
            duration: 0.65,
            ease: 'power3.out',
            scrollTrigger: { trigger: columns, start: 'top 82%', once: true }
        });
    });

    gsap.utils.toArray('.case-flow').forEach(function (flow) {
        gsap.to(flow, {
            '--flow-progress': 1,
            ease: 'none',
            scrollTrigger: { trigger: flow, start: 'top 78%', end: 'bottom 58%', scrub: 0.7 }
        });
        gsap.from(flow.querySelectorAll('.case-flow-step'), {
            opacity: 0,
            y: 24,
            stagger: 0.1,
            duration: 0.58,
            ease: 'power3.out',
            scrollTrigger: { trigger: flow, start: 'top 82%', once: true }
        });
    });

    gsap.from('.case-decision', {
        opacity: 0,
        x: 24,
        stagger: 0.1,
        duration: 0.58,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.case-decisions', start: 'top 82%', once: true }
    });

    gsap.from('.case-result-item', {
        opacity: 0,
        y: 24,
        stagger: 0.1,
        duration: 0.58,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.case-results-grid', start: 'top 82%', once: true }
    });

    gsap.from('.case-stack-tag', {
        opacity: 0,
        y: 12,
        stagger: 0.05,
        duration: 0.4,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.case-stack-tags', start: 'top 88%', once: true }
    });

    gsap.from('.case-cta', {
        opacity: 0,
        y: 30,
        scale: 0.985,
        duration: 0.78,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.case-cta', start: 'top 86%', once: true }
    });

    const visual = document.querySelector('.case-visual');
    const preview = document.querySelector('.case-app-preview');
    if (visual && preview && window.matchMedia('(pointer: fine)').matches) {
        visual.addEventListener('pointermove', function (event) {
            const bounds = visual.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - 0.5;
            const y = (event.clientY - bounds.top) / bounds.height - 0.5;
            gsap.to(preview, {
                rotateY: x * 7,
                rotateX: y * -7,
                x: x * 5,
                y: y * 5,
                duration: 0.35,
                ease: 'power2.out'
            });
        });
        visual.addEventListener('pointerleave', function () {
            gsap.to(preview, { rotateY: 0, rotateX: 0, x: 0, y: 0, duration: 0.55, ease: 'power3.out' });
        });
    }
})();
