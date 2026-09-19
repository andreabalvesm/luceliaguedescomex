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

    // Navbar: add scrolled class for subtle shadow
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.style.boxShadow = window.scrollY > 40
            ? '0 4px 24px rgba(0,0,0,0.4)'
            : 'none';
    });
});
