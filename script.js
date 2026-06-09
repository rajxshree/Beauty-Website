document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Mobile Navigation Toggle
       ========================================================================== */
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileNavToggle && navMenu) {
        mobileNavToggle.addEventListener('click', () => {
            mobileNavToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when a nav link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNavToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }


    /* ==========================================================================
       2. Sticky Header & Scroll Progress Indicator & Scroll Spy
       ========================================================================== */
    const navbar = document.querySelector('.navbar');
    const scrollProgress = document.getElementById('scroll-progress');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        
        // Sticky Header shadow state
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll progress indicator width
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (documentHeight > 0) {
            const scrollPercent = (scrollTop / documentHeight) * 100;
            scrollProgress.style.width = `${scrollPercent}%`;
        }

        // Scroll Spy active nav links highlight
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });


    /* ==========================================================================
       3. Scroll-Triggered Reveal Animations (Intersection Observer)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));


    /* ==========================================================================
       4. Animated Statistics Counters
       ========================================================================== */
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    const startCounters = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 2000; // Total count-up time in ms
            const stepTime = 30; // ms per update
            const totalSteps = duration / stepTime;
            const increment = target / totalSteps;
            
            let current = 0;
            let step = 0;

            const timer = setInterval(() => {
                current += increment;
                step++;
                
                if (step >= totalSteps) {
                    stat.textContent = target; // Ensure exact final value
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, stepTime);
        });
    };

    // Trigger counters when the stats section enters the viewport
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersStarted) {
                    countersStarted = true;
                    startCounters();
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(statsSection);
    }


    /* ==========================================================================
       5. Interactive Before-After Transformation Slider
       ========================================================================== */
    const baContainer = document.querySelector('.before-after-container');
    const beforeWrapper = document.querySelector('.before-img-wrapper');
    const beforeImg = document.querySelector('.img-before');
    const divider = document.querySelector('.slider-divider');

    if (baContainer && beforeWrapper && beforeImg && divider) {
        let isDragging = false;

        // Ensure internal image matches the container width dynamically on resize
        const adjustImageSize = () => {
            const width = baContainer.offsetWidth;
            beforeImg.style.width = `${width}px`;
        };
        
        adjustImageSize();
        window.addEventListener('resize', adjustImageSize);

        const slide = (clientX) => {
            const rect = baContainer.getBoundingClientRect();
            const posX = clientX - rect.left;
            let percentage = (posX / rect.width) * 100;

            // Constrain between 0% and 100%
            if (percentage < 0) percentage = 0;
            if (percentage > 100) percentage = 100;

            beforeWrapper.style.width = `${percentage}%`;
            divider.style.left = `${percentage}%`;
        };

        // Desktop mouse actions
        divider.addEventListener('mousedown', () => {
            isDragging = true;
            baContainer.classList.add('active-dragging');
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
            baContainer.classList.remove('active-dragging');
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            slide(e.clientX);
        });

        // Mobile touch actions
        divider.addEventListener('touchstart', () => {
            isDragging = true;
        }, { passive: true });

        window.addEventListener('touchend', () => {
            isDragging = false;
        });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            if (e.touches.length > 0) {
                slide(e.touches[0].clientX);
            }
        }, { passive: true });

        // Click directly on container slides to that spot
        baContainer.addEventListener('click', (e) => {
            if (e.target === divider || divider.contains(e.target)) return;
            slide(e.clientX);
        });
    }


    /* ==========================================================================
       6. Testimonials Auto-sliding Carousel
       ========================================================================== */
    const carouselSlides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let activeSlideIndex = 0;
    let carouselTimer = null;
    const autoSlideInterval = 5000; // 5 seconds

    const showSlide = (index) => {
        // Reset indexes bounds
        if (index >= carouselSlides.length) {
            index = 0;
        } else if (index < 0) {
            index = carouselSlides.length - 1;
        }
        
        activeSlideIndex = index;

        // Clear active classes
        carouselSlides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Set active slide and dot
        carouselSlides[activeSlideIndex].classList.add('active');
        if (dots[activeSlideIndex]) {
            dots[activeSlideIndex].classList.add('active');
        }
    };

    const startCarouselAutoPlay = () => {
        stopCarouselAutoPlay(); // Prevent duplicates
        carouselTimer = setInterval(() => {
            showSlide(activeSlideIndex + 1);
        }, autoSlideInterval);
    };

    const stopCarouselAutoPlay = () => {
        if (carouselTimer) {
            clearInterval(carouselTimer);
        }
    };

    // Navigation buttons
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showSlide(activeSlideIndex + 1);
            startCarouselAutoPlay(); // Reset interval
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            showSlide(activeSlideIndex - 1);
            startCarouselAutoPlay(); // Reset interval
        });
    }

    // Dots navigation
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            showSlide(idx);
            startCarouselAutoPlay(); // Reset interval
        });
    });

    // Start auto-play initially
    if (carouselSlides.length > 0) {
        startCarouselAutoPlay();
    }


    /* ==========================================================================
       7. Smooth FAQ Accordion
       ========================================================================== */
    const faqTriggers = document.querySelectorAll('.faq-trigger');

    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const faqItem = trigger.parentElement;
            const faqPanel = faqItem.querySelector('.faq-panel');
            const isActive = faqItem.classList.contains('active');

            // Close all other active FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    item.querySelector('.faq-panel').style.maxHeight = null;
                }
            });

            // Toggle selected FAQ item
            if (isActive) {
                faqItem.classList.remove('active');
                faqPanel.style.maxHeight = null;
            } else {
                faqItem.classList.add('active');
                faqPanel.style.maxHeight = `${faqPanel.scrollHeight}px`;
            }
        });
    });


    /* ==========================================================================
       8. Booking Appointment Form Simulation
       ========================================================================== */
    const appointmentForm = document.getElementById('appointment-form');
    const bookingSuccessOverlay = document.getElementById('booking-success');
    const closeSuccessBtn = document.getElementById('close-success-btn');

    if (appointmentForm && bookingSuccessOverlay) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Fetch input data for validation or styling
            const submitBtn = appointmentForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Simulation visual loading transition
            submitBtn.textContent = 'Processing Reservation...';
            submitBtn.disabled = true;

            setTimeout(() => {
                // Show booking success slide overlay
                bookingSuccessOverlay.classList.add('active');
                
                // Reset submit button state and form fields
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                appointmentForm.reset();
            }, 1000);
        });

        // Close booking success overlay
        if (closeSuccessBtn) {
            closeSuccessBtn.addEventListener('click', () => {
                bookingSuccessOverlay.classList.remove('active');
            });
        }
    }

    // Set today's date as the minimum date in selection picker
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
});
