document.addEventListener('DOMContentLoaded', () => {

    // Smooth scroll with navbar offset
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    // Intersection Observer — fade-in for .animate-card elements
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.animate-card').forEach(el => observer.observe(el));

    // Founder photo — swap for the YouTube video on click
    document.querySelectorAll('.founder-video-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const card = document.createElement('div');
            card.className = 'founder-photo-card';
            card.innerHTML = `<iframe src="https://www.youtube.com/embed/${trigger.dataset.youtubeId}?autoplay=1&rel=0&playsinline=1" title="Apresentação Lucélia Guedes" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
            trigger.replaceWith(card);
        });
    });

    // Stagger pilar cards
    document.querySelectorAll('.pilar-card').forEach((card, i) => {
        card.style.transitionDelay = `${i * 80}ms`;
    });

    // Stagger prova items
    document.querySelectorAll('.prova-item').forEach((item, i) => {
        item.style.transitionDelay = `${i * 100}ms`;
    });

    // Approvals carousel arrows
    document.querySelectorAll('.approvals-carousel').forEach(carousel => {
        const track = carousel.querySelector('.approvals-track');
        const prev = carousel.querySelector('.approvals-arrow.prev');
        const next = carousel.querySelector('.approvals-arrow.next');
        if (!track || !prev || !next) return;
        const scrollAmount = () => track.clientWidth * 0.7;
        prev.addEventListener('click', () => track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
        next.addEventListener('click', () => track.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
    });

    // Course slides carousel
    document.querySelectorAll('.course-slides').forEach(carousel => {
        const slides = [...carousel.querySelectorAll('.slide')];
        const prev = carousel.querySelector('.slides-arrow.prev');
        const next = carousel.querySelector('.slides-arrow.next');
        const dotsWrap = carousel.querySelector('.slides-dots');
        const count = carousel.querySelector('.slides-count');
        let current = 0;

        const dots = slides.map((_, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Ir para o slide ${i + 1}`);
            dot.addEventListener('click', () => go(i));
            dotsWrap.appendChild(dot);
            return dot;
        });

        function go(index) {
            current = Math.max(0, Math.min(slides.length - 1, index));
            slides.forEach((slide, i) => {
                const active = i === current;
                slide.classList.toggle('is-active', active);
                slide.setAttribute('aria-hidden', String(!active));
                slide.inert = !active;
            });
            dots.forEach((dot, i) => dot.setAttribute('aria-selected', String(i === current)));
            prev.disabled = current === 0;
            next.disabled = current === slides.length - 1;
            if (count) count.textContent = `${current + 1} / ${slides.length}`;
        }

        prev.addEventListener('click', () => go(current - 1));
        next.addEventListener('click', () => go(current + 1));

        carousel.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft') go(current - 1);
            if (e.key === 'ArrowRight') go(current + 1);
        });

        let startX = null;
        carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
        carousel.addEventListener('touchend', e => {
            if (startX === null) return;
            const dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 50) go(current + (dx < 0 ? 1 : -1));
            startX = null;
        });

        go(0);
    });

    // "Minha exportação em 8 perguntas" quick check
    document.querySelectorAll('.quiz-list').forEach(list => {
        const result = list.parentElement.querySelector('.quiz-result');
        const items = [...list.querySelectorAll('li')];

        list.addEventListener('click', e => {
            const btn = e.target.closest('.quiz-opts button');
            if (!btn) return;
            btn.parentElement.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));

            const answered = items.filter(li => li.querySelector('[aria-pressed="true"]'));
            const pending = items.filter(li => li.querySelector('[data-v="nao"][aria-pressed="true"]')).length;
            if (answered.length < items.length) {
                result.textContent = `${answered.length} de ${items.length} respondidas.`;
            } else if (pending === 0) {
                result.textContent = 'Excelente! Sua empresa já tem uma boa base. O curso ajuda a organizar e acelerar os próximos passos.';
            } else {
                result.textContent = `Você marcou “ainda não” em ${pending} ${pending === 1 ? 'ponto' : 'pontos'}. É exatamente isso que o curso ajuda a preparar.`;
            }
        });
    });

    // Navbar: add scrolled class for subtle shadow
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.style.boxShadow = window.scrollY > 40
            ? '0 4px 24px rgba(0,0,0,0.4)'
            : 'none';
    });
});
