/* 
  =========================================
  VELOPAY FINTECH GATEWAY - JAVASCRIPT
  Author: Junior Frontend Developer
  Features: Sticky Scroll, Sidebar Drawer, Accordion, Slider, Count-Up
  =========================================
*/

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

});