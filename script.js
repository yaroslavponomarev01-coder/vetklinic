document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. Initialize Lucide Icons
    // ==========================================================================
    try {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } catch (e) { console.warn('Lucide init error:', e); }

    // ==========================================================================
    // 2. Initialize AOS (Animate On Scroll)
    // ==========================================================================
    try {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: true,
                offset: 60,
                easing: 'ease-out-cubic',
            });
        }
    } catch (e) { console.warn('AOS init error:', e); }

    // ==========================================================================
    // 3. Initialize Lenis (Smooth Scroll)
    // ==========================================================================
    let lenis = null;
    try {
        if (typeof Lenis !== 'undefined') {
            lenis = new Lenis({
                duration: 1.4,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                direction: 'vertical',
                gestureDirection: 'vertical',
                smooth: true,
                mouseMultiplier: 1,
                smoothTouch: false,
                touchMultiplier: 2,
                infinite: false,
            });

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        }
    } catch (e) { console.warn('Lenis init error:', e); }

    // ==========================================================================
    // 4. Navbar — scroll effect + progress bar
    // ==========================================================================
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scrollProgress');
    const backToTop = document.getElementById('backToTop');

    function updateScroll() {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

        if (navbar) {
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        if (scrollProgress) {
            scrollProgress.style.width = scrollPercent + '%';
        }

        if (backToTop) {
            if (scrollY > 600) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    }

    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            if (lenis) {
                lenis.scrollTo(0, { duration: 1.5 });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    // ==========================================================================
    // 5. Mobile Menu
    // ==========================================================================
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');

    function toggleMobileMenu() {
        if (!mobileNav) return;
        const isActive = mobileNav.classList.contains('active');
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        if (mobileNavOverlay) mobileNavOverlay.classList.toggle('active');
        document.body.style.overflow = isActive ? '' : 'hidden';
    }

    function closeMobileMenu() {
        if (hamburger) hamburger.classList.remove('active');
        if (mobileNav) mobileNav.classList.remove('active');
        if (mobileNavOverlay) mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', closeMobileMenu);
    }

    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // ==========================================================================
    // 6. Initialize Swiper for Reviews
    // ==========================================================================
    try {
        if (typeof Swiper !== 'undefined') {
            new Swiper('.reviews-swiper', {
                slidesPerView: 1,
                spaceBetween: 24,
                loop: true,
                autoplay: {
                    delay: 4500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                breakpoints: {
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 28,
                    },
                    992: {
                        slidesPerView: 3,
                        spaceBetween: 28,
                    },
                },
            });
        }
    } catch (e) { console.warn('Swiper init error:', e); }

    // ==========================================================================
    // 7. Animated Counters (IntersectionObserver + vanilla animation)
    // ==========================================================================
    const counters = document.querySelectorAll('.counter');

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        if (isNaN(target)) return;
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * eased);
            el.textContent = current.toLocaleString('ru-RU');

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.counted) {
                    entry.target.dataset.counted = 'true';
                    animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    // ==========================================================================
    // 8. Parallax effect on hero image
    // ==========================================================================
    const heroImage = document.getElementById('heroImage');
    const heroBlobs = document.querySelectorAll('.hero-blob');

    if (heroImage || heroBlobs.length > 0) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const heroHeight = window.innerHeight;

            if (scrollY < heroHeight && heroImage) {
                heroImage.style.transform = `translateY(${scrollY * 0.15}px) scale(${1 + scrollY * 0.0001})`;
            }

            heroBlobs.forEach((blob, i) => {
                if (scrollY < heroHeight) {
                    const rate = 0.05 + i * 0.03;
                    blob.style.transform = `translateY(${scrollY * rate}px)`;
                }
            });
        }, { passive: true });
    }

    // ==========================================================================
    // 9. Tilt effect on service cards (desktop only)
    // ==========================================================================
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.querySelectorAll('.service-card, .equipment-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -4;
                const rotateY = ((x - centerX) / centerX) * 4;

                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ==========================================================================
    // 10. Cursor Spotlight (desktop only)
    // ==========================================================================
    const spotlight = document.getElementById('cursorSpotlight');

    if (spotlight && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        let spotlightX = 0, spotlightY = 0;
        let currentX = 0, currentY = 0;

        document.addEventListener('mousemove', (e) => {
            spotlightX = e.clientX;
            spotlightY = e.clientY;
        });

        function animateSpotlight() {
            currentX += (spotlightX - currentX) * 0.08;
            currentY += (spotlightY - currentY) * 0.08;
            spotlight.style.left = currentX + 'px';
            spotlight.style.top = currentY + 'px';
            requestAnimationFrame(animateSpotlight);
        }
        animateSpotlight();
    }

    // ==========================================================================
    // 11. Button magnetic hover effect (desktop only)
    // ==========================================================================
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.querySelectorAll('.hero-actions .btn-primary, .final-cta .btn-cta').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.setProperty('--ripple-x', ((e.clientX - rect.left) / rect.width * 100) + '%');
                btn.style.setProperty('--ripple-y', ((e.clientY - rect.top) / rect.height * 100) + '%');

                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) translateY(-3px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // ==========================================================================
    // 12. Smooth anchor scrolling via Lenis
    // ==========================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                if (lenis) {
                    lenis.scrollTo(target, { offset: -80, duration: 1.2 });
                } else {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // ==========================================================================
    // 13. Reveal animation on scroll
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // ==========================================================================
    // 14. Stagger animation for grid items
    // ==========================================================================
    document.querySelectorAll('.services-grid, .approach-grid, .equipment-grid').forEach(container => {
        Array.from(container.children).forEach((item, i) => {
            item.style.animationDelay = `${i * 0.08}s`;
        });
    });

    // ==========================================================================
    // 15. Booking Modal
    // ==========================================================================
    const modalOverlay = document.getElementById('bookingModalOverlay');
    const modalCloseBtn = document.getElementById('modalClose');
    const bookingForm = document.getElementById('bookingForm');
    const modalSuccess = document.getElementById('modalSuccess');
    const modalSuccessClose = document.getElementById('modalSuccessClose');
    const serviceSelect = document.getElementById('booking-service');
    const phoneInput = document.getElementById('booking-phone');

    // Open modal
    function openModal(serviceName) {
        if (!modalOverlay) return;

        // Reset to form view
        if (bookingForm) bookingForm.style.display = '';
        if (modalSuccess) modalSuccess.style.display = 'none';

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Pre-select service if provided
        if (serviceName && serviceSelect) {
            for (let i = 0; i < serviceSelect.options.length; i++) {
                if (serviceSelect.options[i].value === serviceName) {
                    serviceSelect.selectedIndex = i;
                    break;
                }
            }
        }

        // Re-init Lucide icons for modal
        try {
            if (typeof lucide !== 'undefined') {
                setTimeout(() => lucide.createIcons(), 50);
            }
        } catch (e) {}
    }

    // Close modal
    function closeModal() {
        if (!modalOverlay) return;

        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';

        // Reset form after close animation
        setTimeout(() => {
            if (bookingForm) {
                bookingForm.style.display = '';
                bookingForm.reset();
            }
            if (modalSuccess) {
                modalSuccess.style.display = 'none';
            }
        }, 400);
    }

    // Bind all "Записаться" buttons
    document.querySelectorAll('.open-booking-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const service = btn.getAttribute('data-service') || '';
            openModal(service);
        });
    });

    // Close button
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    // Close on overlay click
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    // Phone number formatting
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');

            // Handle leading 7 or 8
            if (value.startsWith('7') || value.startsWith('8')) {
                value = value.substring(1);
            }

            // Limit to 10 digits
            value = value.substring(0, 10);

            let formatted = '+7';
            if (value.length > 0) formatted += ' (' + value.substring(0, 3);
            if (value.length >= 3) formatted += ') ' + value.substring(3, 6);
            if (value.length >= 6) formatted += '-' + value.substring(6, 8);
            if (value.length >= 8) formatted += '-' + value.substring(8, 10);

            e.target.value = formatted;
        });
    }

    // Form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(bookingForm);
            const data = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                service: formData.get('service'),
                note: formData.get('note') || '',
            };

            // Log the data (in production — send to server/Telegram/email)
            console.log('📋 Новая заявка:', data);

            // Show success state
            bookingForm.style.display = 'none';
            if (modalSuccess) {
                modalSuccess.style.display = 'block';
                try {
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                } catch (e) {}
            }
        });
    }

    // Success close button
    if (modalSuccessClose) {
        modalSuccessClose.addEventListener('click', closeModal);
    }

    console.log('✅ Дядя Фёдор — все скрипты загружены');
});
