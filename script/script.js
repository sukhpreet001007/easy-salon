
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
    const menuTriggers = document.querySelectorAll('.custom-toggler');
    const mobileOverlay = document.getElementById('mobileOverlay');

    if (menuTriggers.length > 0 && mobileOverlay) {
        const mobileVideoIframe = mobileOverlay.querySelector('.mobile-video-box iframe');
        const originalVideoSrc = mobileVideoIframe ? mobileVideoIframe.getAttribute('src') : '';

        function stopMobileVideo() {
            if (mobileVideoIframe) {
                // Resetting src stops the video
                mobileVideoIframe.setAttribute('src', '');
                mobileVideoIframe.setAttribute('src', originalVideoSrc);
            }
        }

        menuTriggers.forEach(trigger => {
            trigger.addEventListener('click', function () {
                const isActive = this.classList.contains('active');
                menuTriggers.forEach(t => t.classList.toggle('active', !isActive));
                mobileOverlay.classList.toggle('active', !isActive);

                if (!isActive) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                    stopMobileVideo();
                }
            });
        });

        const mobileCta = mobileOverlay.querySelector('.btn-demo');
        if (mobileCta) {
            mobileCta.addEventListener('click', () => {
                menuTriggers.forEach(t => t.classList.remove('active'));
                mobileOverlay.classList.remove('active');
                stopMobileVideo();
            });
        }

        // Fix for Mobile Scroll Lock (Conflict between menu and modal)
        const demoModal = document.getElementById('ModalTogglesix');
        if (demoModal) {
            demoModal.addEventListener('hidden.bs.modal', function () {
                // Force restore overflow if menu is closed
                if (!mobileOverlay.classList.contains('active')) {
                    document.body.style.overflow = '';
                    document.body.style.paddingRight = ''; // Cleanup scrollbar compensation
                }
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

    // 6. BRANDS SLIDER (Infinite Paging)
    const brandRows = document.querySelectorAll('.brands-slider-row');
    if (brandRows.length > 0) {
        brandRows.forEach(row => {
            const track = row.querySelector('.brands-slider-track');
            const direction = row.getAttribute('data-direction'); // rtl or ltr

            // 1. Clone items for infinite loop
            const originalItems = Array.from(track.children);
            originalItems.forEach(item => {
                const clone = item.cloneNode(true);
                track.appendChild(clone);
            });

            let currentIndex = 0;

            function getPerView() {
                return window.innerWidth <= 991 ? 2 : 4;
            }

            function getOriginalSlidesCount() {
                return Math.ceil(originalItems.length / getPerView());
            }

            // Initial setup for LTR (start at the offset)
            if (direction === 'ltr') {
                currentIndex = getOriginalSlidesCount();
                track.style.transition = 'none';
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
            }

            function moveSlide() {
                const originalSlidesCount = getOriginalSlidesCount();

                track.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';

                if (direction === 'rtl') {
                    currentIndex++;
                    const offset = currentIndex * 100;
                    track.style.transform = `translateX(-${offset}%)`;

                    // If reached the duplicate set, snap back to start
                    if (currentIndex >= originalSlidesCount) {
                        setTimeout(() => {
                            track.style.transition = 'none';
                            currentIndex = 0;
                            track.style.transform = `translateX(0)`;
                        }, 800);
                    }
                } else {
                    // LTR Direction
                    currentIndex--;
                    const offset = currentIndex * 100;
                    track.style.transform = `translateX(-${offset}%)`;

                    // If reached the start of the original set (scrolling right), snap back to clone end
                    if (currentIndex <= 0) {
                        setTimeout(() => {
                            track.style.transition = 'none';
                            currentIndex = originalSlidesCount;
                            track.style.transform = `translateX(-${currentIndex * 100}%)`;
                        }, 800);
                    }
                }
            }

            // Start auto-slide every 4 seconds
            let slideInterval = setInterval(moveSlide, 4000);

            // Handle Resize
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    currentIndex = (direction === 'ltr') ? getOriginalSlidesCount() : 0;
                    track.style.transition = 'none';
                    track.style.transform = `translateX(-${currentIndex * 100}%)`;
                }, 250);
            });
        });
    }

    // 7. FLOATING NAVBAR SCROLL LOGIC
    const floatingNav = document.getElementById('floatingNav');
    if (floatingNav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                floatingNav.classList.add('visible');
            } else {
                floatingNav.classList.remove('visible');
            }
        });
    }

    // 8. VIDEO MODAL PLAYER CONTROL
    const videoModal = document.getElementById('videoModal');
    const heroVideo = document.getElementById('heroVideo');
    const videoUrl = "https://www.youtube.com/embed/Y8nN8GL813c?autoplay=1&mute=1&controls=1&rel=0";

    if (videoModal && heroVideo) {
        // Use 'show' to start loading immediately
        videoModal.addEventListener('show.bs.modal', function () {
            heroVideo.setAttribute('src', videoUrl);
        });

        // Ensure source is cleared when hidden to stop playback
        videoModal.addEventListener('hidden.bs.modal', function () {
            heroVideo.setAttribute('src', '');
        });
    }

})();

document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,  
        rootMargin: '0px',
        threshold: 0.15  
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach(el => observer.observe(el));
});

document.addEventListener('DOMContentLoaded', () => {
   
    const rowsContainer = document.querySelector('.marketing-features-rows');
    const progressLine = document.querySelector('.marketing-thread-progress');
    const threadLine = document.querySelector('.marketing-thread-line');
    const ticks = document.querySelectorAll('.marketing-tick');

    if (!rowsContainer || !progressLine || !threadLine) return;

    
    window.addEventListener('scroll', () => {
      
        const containerRect = rowsContainer.getBoundingClientRect();
        const startOffset = containerRect.top; 
        const totalHeight = containerRect.height;
        const windowHeight = window.innerHeight;

       
        const activationPoint = windowHeight * 0.5;

        

        let progress = 0;

        
        const triggerPoint = windowHeight * 0.6;

        if (startOffset < triggerPoint) {
            const scrolledAmount = triggerPoint - startOffset;
            progress = (scrolledAmount / (totalHeight * 0.8)) * 100;
        }

        
        progress = Math.max(0, Math.min(progress, 100));

        
        progressLine.style.height = `${progress}%`;

       
        const endOfSection = containerRect.bottom;
        if (endOfSection < windowHeight * 0.2) {
            threadLine.classList.add('thread-hidden');
           
            ticks.forEach(tick => tick.style.opacity = '0');
        } else {
            threadLine.classList.remove('thread-hidden');
            
            ticks.forEach(tick => tick.style.opacity = '1');
        }

        
        ticks.forEach((tick, index) => {
            const tickRect = tick.getBoundingClientRect();
            const tickTop = tickRect.top;

            
            const tickRelativeTop = tickTop - startOffset;
            const currentLineHeight = (progress / 100) * totalHeight;

           
            const lineStart = startOffset + 50;
            const lineTipY = lineStart + ((containerRect.height - 100) * (progress / 100));
            

            if (lineTipY >= tickTop + 20) {
                tick.classList.add('active');
            } else {
                tick.classList.remove('active');
            }
        });
    });
});
