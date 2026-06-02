
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SET CURRENT YEAR IN FOOTER ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        // Automatically fetches the current system year (e.g. 2026)
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- 2. STICKY NAVBAR ACTION ---
    const navbar = document.getElementById('navbar');

    // Function that shrinks the navbar when scrolling down the page
    const handleNavbarScroll = () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled'); // Adds shadow and reduces height
        } else {
            navbar.classList.remove('scrolled'); // Restores default height
        }
    };

    // Listen to scroll events on the window
    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // Run immediately on load in case the user page is already scrolled down

    // --- 3. MOBILE MENU SIDEBAR DRAWER (LEFT SIDE SLIDE) ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileSidebar = document.getElementById('mobile-sidebar');
    const mobileOverlay = document.getElementById('mobile-overlay');

    // Opens the mobile drawer menu
    const openMenu = () => {
        mobileToggle.classList.add('active');     // Turns hamburger into cross
        mobileSidebar.classList.add('active');    // Slides drawer into screen
        mobileOverlay.classList.add('active');    // Fades in the dark backdrop overlay
        document.body.style.overflow = 'hidden';  // Disables page scrolling while sidebar is open
    };

    // Closes the mobile drawer menu
    const closeMenu = () => {
        mobileToggle.classList.remove('active');
        mobileSidebar.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';        // Restores page scroll
    };

    // Toggle menu state when clicking the hamburger icon
    mobileToggle.addEventListener('click', () => {
        if (mobileSidebar.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close the drawer if the user clicks anywhere on the dark overlay background
    mobileOverlay.addEventListener('click', closeMenu);

    // Close the drawer when clicking links inside the mobile scroll area or actions
    const drawerLinks = mobileSidebar.querySelectorAll('.mobile-nav-scroll a, .mobile-actions a, .mobile-actions button');
    drawerLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // --- 4. NESTED ACCORDION DROP-DOWNS FOR MOBILE SIDEBAR ---
    const sidebarHeaders = mobileSidebar.querySelectorAll('.nav-list-header');

    sidebarHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const parentList = header.parentElement;

            // Toggle the open class to show/hide the nested submenu
            parentList.classList.toggle('open');

            // Slide toggle display using style block
            const subMenu = parentList.querySelector('.sub-nav-list');
            if (subMenu) {
                if (parentList.classList.contains('open')) {
                    subMenu.style.display = 'flex';
                } else {
                    subMenu.style.display = 'none';
                }
            }
        });
    });

    // --- 5. REVEAL-ON-SCROLL ANIMATION (Using Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal');

    // Set up observer that detects when elements scroll into view
    const observerOptions = {
        threshold: 0.1, // Element is considered visible when 10% is inside viewport
        rootMargin: '0px 0px -30px 0px'
    };

    const scrollRevealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // Adds fade-in class
                observer.unobserve(entry.target);     // Stops watching this element once visible
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        scrollRevealObserver.observe(element);
    });

    // --- 6. STATS COUNT-UP ANIMATION ---
    const statsSection = document.getElementById('stats');
    const statElements = document.querySelectorAll('.stat-number');

    const countUpStatistics = () => {
        statElements.forEach(stat => {
            const targetValue = parseFloat(stat.getAttribute('data-target'));
            const hasDecimal = stat.getAttribute('data-decimal') === 'true';

            let currentValue = 0;
            const stepsCount = 50;                  // Total increments in animation
            const delayTime = 2000 / stepsCount;    // Delays between steps (total time 2 seconds)
            const incrementStep = targetValue / stepsCount;

            const counterTimer = setInterval(() => {
                currentValue += incrementStep;

                if (currentValue >= targetValue) {
                    // Lock exact target value on completion
                    stat.textContent = hasDecimal ? targetValue.toFixed(1) : Math.floor(targetValue);
                    clearInterval(counterTimer);
                } else {
                    stat.textContent = hasDecimal ? currentValue.toFixed(1) : Math.floor(currentValue);
                }
            }, delayTime);
        });
    };

    // Watch stats section to trigger count-up once scrolled into view
    if (statsSection) {
        const statsSectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    countUpStatistics();
                    observer.unobserve(entry.target); // Runs only once
                }
            });
        }, { threshold: 0.2 });

        statsSectionObserver.observe(statsSection);
    }

    // --- 7. TESTIMONIALS CAROUSEL SLIDER ---
    const trackElement = document.getElementById('testimonial-track');
    const prevButton = document.getElementById('slide-prev');
    const nextButton = document.getElementById('slide-next');
    const dotsContainer = document.getElementById('slider-dots');

    if (trackElement && trackElement.children.length > 0) {
        const testimonialSlides = Array.from(trackElement.children);
        let activeSlideIndex = 0;
        let autoplayTimer;

        // Dynamically create a slider dot indicator for each testimonial slide
        testimonialSlides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (index === 0) {
                dot.classList.add('active'); // First dot is active initially
            }

            // Allow user to click dots to jump to slides
            dot.addEventListener('click', () => {
                showSlide(index);
                restartAutoplay();
            });
            dotsContainer.appendChild(dot);
        });

        const sliderDots = Array.from(dotsContainer.children);

        // Core slider transition function
        const showSlide = (index) => {
            // Loop slides if they reach boundaries
            if (index < 0) {
                index = testimonialSlides.length - 1;
            } else if (index >= testimonialSlides.length) {
                index = 0;
            }

            // Move slide track using CSS transform translate offsets
            trackElement.style.transform = `translateX(-${index * 100}%)`;

            // Toggle active classes on dot indicators
            sliderDots[activeSlideIndex].classList.remove('active');
            sliderDots[index].classList.add('active');

            activeSlideIndex = index;
        };

        // Arrow button click triggers
        nextButton.addEventListener('click', () => {
            showSlide(activeSlideIndex + 1);
            restartAutoplay();
        });

        prevButton.addEventListener('click', () => {
            showSlide(activeSlideIndex - 1);
            restartAutoplay();
        });

        // Autoplay loop timer (Cycles every 5 seconds)
        const runAutoplay = () => {
            autoplayTimer = setInterval(() => {
                showSlide(activeSlideIndex + 1);
            }, 5000);
        };

        const restartAutoplay = () => {
            clearInterval(autoplayTimer);
            runAutoplay();
        };

        runAutoplay(); // Start cycle on load

        // Pause testimonial cycling when mouse enters slider area
        const sliderFrame = document.querySelector('.slider-container');
        if (sliderFrame) {
            sliderFrame.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
            sliderFrame.addEventListener('mouseleave', runAutoplay);
        }
    }

    // --- 8. FAQ ACCORDION TRIGGER PANEL TOGGLE ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        const body = item.querySelector('.faq-body');

        header.addEventListener('click', () => {
            const isCurrentlyActive = item.classList.contains('active');

            // Close all other FAQ items first
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-body').style.maxHeight = null;
            });

            // If the item wasn't open, open it now by calculating its content scroll height
            if (!isCurrentlyActive) {
                item.classList.add('active');
                body.style.maxHeight = body.scrollHeight + 'px';
            }
        });
    });

    // --- 9. LOGIN & REGISTER SLIDE-IN POPUPS LOGIC ---
    const btnLoginDesktop = document.getElementById('btn-login-desktop');
    const btnLoginMobile = document.getElementById('btn-login-mobile');
    const loginPopup = document.getElementById('login-popup');
    const registerPopup = document.getElementById('register-popup');
    const authOverlay = document.getElementById('auth-overlay');
    const loginClose = document.getElementById('login-close');
    const registerClose = document.getElementById('register-close');
    const linkToRegister = document.getElementById('link-to-register');
    const linkToLogin = document.getElementById('link-to-login');

    const openLogin = () => {
        if (loginPopup) loginPopup.classList.add('active');
        if (authOverlay) authOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevents background scroll
    };

    const openRegister = () => {
        if (registerPopup) registerPopup.classList.add('active');
        if (authOverlay) authOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeAllAuth = () => {
        if (loginPopup) loginPopup.classList.remove('active');
        if (registerPopup) registerPopup.classList.remove('active');
        if (authOverlay) authOverlay.classList.remove('active');

        // Restore background scroll ONLY if mobile menu is not active
        const mobileSidebar = document.getElementById('mobile-sidebar');
        if (!mobileSidebar || !mobileSidebar.classList.contains('active')) {
            document.body.style.overflow = '';
        }
    };

    // Open Login popup from desktop or mobile triggers
    if (btnLoginDesktop) btnLoginDesktop.addEventListener('click', openLogin);
    if (btnLoginMobile) {
        btnLoginMobile.addEventListener('click', () => {
            // Close mobile sidebar first if opening from mobile nav
            const mobileToggle = document.getElementById('mobile-toggle');
            const mobileSidebar = document.getElementById('mobile-sidebar');
            const mobileOverlay = document.getElementById('mobile-overlay');
            if (mobileToggle) mobileToggle.classList.remove('active');
            if (mobileSidebar) mobileSidebar.classList.remove('active');
            if (mobileOverlay) mobileOverlay.classList.remove('active');

            openLogin();
        });
    }

    // Close buttons and backdrop overlay trigger closing
    if (loginClose) loginClose.addEventListener('click', closeAllAuth);
    if (registerClose) registerClose.addEventListener('click', closeAllAuth);
    if (authOverlay) authOverlay.addEventListener('click', closeAllAuth);

    // Cross switches between Login and Register panels
    if (linkToRegister) {
        linkToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            if (loginPopup) loginPopup.classList.remove('active');
            // Small transition delay for smooth aesthetic effect
            setTimeout(openRegister, 200);
        });
    }

    if (linkToLogin) {
        linkToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            if (registerPopup) registerPopup.classList.remove('active');
            // Small transition delay for smooth aesthetic effect
            setTimeout(openLogin, 200);
        });
    }

    // Close popups on Escape keypress
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllAuth();
        }
    });

    // --- 10. PASSWORD VISIBILITY TOGGLE LOGIC ---
    const setupPasswordToggle = (toggleId, inputId) => {
        const toggleBtn = document.getElementById(toggleId);
        const passwordInput = document.getElementById(inputId);

        if (toggleBtn && passwordInput) {
            toggleBtn.addEventListener('click', () => {
                const isPassword = passwordInput.getAttribute('type') === 'password';
                passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
                toggleBtn.classList.toggle('visible', isPassword);
            });
        }
    };

    setupPasswordToggle('login-password-toggle', 'login-password');
    setupPasswordToggle('register-password-toggle', 'register-password');

    // --- 11. PREMIUM SERVICE SECTION CONTROLLER ---
    // A. Service switching logic & Sliding Indicator
    const navButtons = document.querySelectorAll('.svc-nav-btn');
    const formPanels = document.querySelectorAll('.svc-form-panel');
    const activeIndicator = document.getElementById('svc-active-indicator');

    const updateActiveIndicator = (activeBtn) => {
        if (activeIndicator && activeBtn) {
            activeIndicator.style.left = `${activeBtn.offsetLeft}px`;
            activeIndicator.style.width = `${activeBtn.offsetWidth}px`;
        }
    };

    // Initialize position on page load
    const initialActive = document.querySelector('.svc-nav-btn.active');
    if (initialActive) {
        setTimeout(() => {
            updateActiveIndicator(initialActive);
        }, 150);
    }

    // Recalculate on window resize
    window.addEventListener('resize', () => {
        const currentActive = document.querySelector('.svc-nav-btn.active');
        if (currentActive) {
            updateActiveIndicator(currentActive);
        }
    });

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            navButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            formPanels.forEach(p => p.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            
            // Slide active indicator
            updateActiveIndicator(btn);

            // Show corresponding form panel
            const serviceId = btn.dataset.service;
            const targetForm = document.getElementById(`form-${serviceId}`);
            if (targetForm) {
                targetForm.classList.add('active');
            }
        });
    });

    // B. Chip selector logic for Mobile Recharge
    const chips = document.querySelectorAll('.svc-chip');
    const mobileAmountInput = document.getElementById('mobile-amount-input');

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            if (mobileAmountInput) {
                mobileAmountInput.value = chip.dataset.val;
            }
        });
    });

    // C. Browse Plans Modal Logic
    const browseBtn = document.getElementById('browse-plans-btn');
    const plansModal = document.getElementById('plans-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalOverlaySvc = document.querySelector('.svc-modal-overlay');
    const planCards = document.querySelectorAll('.svc-plan-card');

    if (browseBtn && plansModal) {
        browseBtn.addEventListener('click', () => {
            plansModal.classList.add('show');
        });
    }

    const hideModal = () => {
        if (plansModal) plansModal.classList.remove('show');
    };

    if (closeModalBtn) closeModalBtn.addEventListener('click', hideModal);
    if (modalOverlaySvc) modalOverlaySvc.addEventListener('click', hideModal);

    planCards.forEach(card => {
        card.addEventListener('click', () => {
            if (mobileAmountInput) {
                mobileAmountInput.value = card.dataset.val;
            }
            hideModal();
        });
    });

    // D. Form Submit & Transaction Flow simulation
    const svcForms = document.querySelectorAll('.svc-form');
    const toast = document.getElementById('svc-payment-toast');
    const toastTitle = document.getElementById('svc-toast-title');
    const toastMsg = document.getElementById('svc-toast-msg');

    const showToast = (title, message) => {
        if (toast && toastTitle && toastMsg) {
            toastTitle.textContent = title;
            toastMsg.textContent = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 4000);
        }
    };

    svcForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            if (!submitBtn) return;

            // Put button into loading state
            submitBtn.classList.add('loading');

            // Simulate server request delay
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                
                // Success actions
                showToast('Payment Successful', 'Your transaction was completed and updated in your balance.');

                // Subtract balance or do general transaction animation
                animateWalletBalance();

                // Clear input fields
                form.reset();
            }, 2000);
        });
    });

    // E. Wallet Counter Animation
    const walletBalanceSpan = document.getElementById('wallet-balance');
    const screenWalletBalanceSpan = document.getElementById('screen-wallet-balance');
    let balanceVal = 4850;

    const animateWalletBalance = () => {
        const newBalanceVal = Math.max(100, balanceVal - Math.floor(Math.random() * 500 + 100));
        
        let current = balanceVal;
        const duration = 1000; // 1 second
        const start = performance.now();

        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const value = Math.floor(current - progress * (current - newBalanceVal));
            if (walletBalanceSpan) {
                walletBalanceSpan.textContent = value.toLocaleString('en-IN');
            }
            if (screenWalletBalanceSpan) {
                screenWalletBalanceSpan.textContent = value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                balanceVal = newBalanceVal;
            }
        };

        requestAnimationFrame(step);
    };

    // Initial counter effect on page load
    let current = 0;
    const target = 4850;
    const duration = 1200;
    const start = performance.now();

    const initialStep = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(progress * target);
        if (walletBalanceSpan) {
            walletBalanceSpan.textContent = value.toLocaleString('en-IN');
        }
        if (screenWalletBalanceSpan) {
            screenWalletBalanceSpan.textContent = value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        if (progress < 1) {
            requestAnimationFrame(initialStep);
        }
    };
    requestAnimationFrame(initialStep);

});