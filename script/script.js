
(function () {
    const dashboard = document.getElementById('dashboardMain');
    const heroTitle = document.querySelector('.hero-heading');
    const heroSubtext = document.querySelector('.hero-subtext');

    // 1. ANIMATE TITLE & SUBTEXT (Smooth Fade Up)
    if (heroTitle) {
        setTimeout(() => {
            heroTitle.classList.add('revealed');
        }, 100);
    }

    if (heroSubtext) {
        setTimeout(() => {
            heroSubtext.classList.add('revealed');
        }, 350); // Slight delay after title
    }

    // 3. DASHBOARD ENTRANCE (Existing)
    if (dashboard) {
        function runEntranceAnimation() {
            setTimeout(function () {
                dashboard.style.transition = 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease';
                dashboard.style.transform = 'translateY(-28px)';
                dashboard.style.opacity = '1';

                setTimeout(function () {
                    dashboard.style.transition = 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease';
                    dashboard.style.transform = 'translateY(0)';
                }, 650);

            }, 200);
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', runEntranceAnimation);
        } else {
            runEntranceAnimation();
        }
    }

    // 4. MOBILE MENU TOGGLE
    const mobileMenuTrigger = document.getElementById('mobileMenuTrigger');
    const mobileOverlay = document.getElementById('mobileOverlay');

    if (mobileMenuTrigger && mobileOverlay) {
        mobileMenuTrigger.addEventListener('click', function () {
            this.classList.toggle('active');
            mobileOverlay.classList.toggle('active');

            // Lock body scroll when menu is open
            if (mobileOverlay.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu if CTA is clicked
        const mobileCta = mobileOverlay.querySelector('.btn-demo');
        if (mobileCta) {
            mobileCta.addEventListener('click', () => {
                mobileMenuTrigger.classList.remove('active');
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    }

    // 5. REVIEWS CAROUSEL
    const track = document.querySelector('.reviews-carousel-track');
    const prevBtn = document.getElementById('prevReview');
    const nextBtn = document.getElementById('nextReview');

    if (track && prevBtn && nextBtn) {
        let currentIndex = 0;

        const cards = Array.from(track.querySelectorAll('.review-card'));
        const totalOriginalCards = cards.length;

        // Clone for infinite loop
        cards.forEach(card => track.appendChild(card.cloneNode(true)));
        cards.forEach(card => track.insertBefore(card.cloneNode(true), track.firstChild));

        currentIndex = totalOriginalCards;

        function updateCarousel(instant = false) {
            const cardElement = track.querySelector('.review-card');
            const cardWidth = cardElement.offsetWidth + 30; // card width + gap

            track.style.transition = instant ? 'none' : 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

            // Calculate offset to center the current card in the viewport
            const centerOffset = (window.innerWidth / 2) - (cardWidth / 2);
            const moveAmount = (currentIndex * cardWidth) - centerOffset;

            track.style.transform = `translateX(-${moveAmount}px)`;
        }

        setTimeout(() => updateCarousel(true), 50);

        nextBtn.addEventListener('click', () => {
            currentIndex++;
            updateCarousel();
            if (currentIndex >= totalOriginalCards * 2) {
                setTimeout(() => {
                    currentIndex = totalOriginalCards;
                    updateCarousel(true);
                }, 600);
            }
        });

        prevBtn.addEventListener('click', () => {
            currentIndex--;
            updateCarousel();
            if (currentIndex < totalOriginalCards) {
                setTimeout(() => {
                    currentIndex = totalOriginalCards * 2 - 1;
                    updateCarousel(true);
                }, 600);
            }
        });

        window.addEventListener('resize', () => updateCarousel(true));
    }

})();

