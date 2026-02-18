
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

})();

