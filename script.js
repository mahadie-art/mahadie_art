// script.js
console.log("Portfolio script loaded.");

document.addEventListener('DOMContentLoaded', function () {
    // Removed custom JS smooth scroll for menu navigation

    // Fix smooth scroll for anchor links with offset for fixed header
    const navbar = document.querySelector('.navbar');
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.length > 1 && document.querySelector(targetId)) {
                e.preventDefault();
                const target = document.querySelector(targetId);
                const headerOffset = navbar ? navbar.offsetHeight : 0;
                const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset - 8; // 8px extra gap
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                // Animate scale
                target.classList.add('section-scale-animate');
                setTimeout(() => {
                    target.classList.remove('section-scale-animate');
                }, 600);
            }
        });
    });

    // Animate Download CV button on click
    const downloadBtn = document.getElementById('download-cv');
    if (downloadBtn) {
        downloadBtn.addEventListener('mousedown', () => {
            downloadBtn.style.transform = 'scale(0.96)';
        });
        downloadBtn.addEventListener('mouseup', () => {
            downloadBtn.style.transform = '';
        });
        downloadBtn.addEventListener('mouseleave', () => {
            downloadBtn.style.transform = '';
        });

        // Ensure the Download CV button is functional
        downloadBtn.addEventListener('click', () => {
            if (typeof html2pdf === 'undefined') {
                console.error("html2pdf library is not loaded. Please include the library.");
                alert("PDF generation is not available. Please ensure the html2pdf library is included.");
                return;
            }

            const isLight = body.classList.contains('light-theme');
            const pdfBackgroundColor = isLight ? '#ffffff' : '#10131a';
            const element = document.body; // Use body for full page
            const opt = {
                margin: 0,
                filename: 'my_cv.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    backgroundColor: pdfBackgroundColor,
                    useCORS: true
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            };

            html2pdf().set(opt).from(element).save().then(() => {
                console.log("PDF generated successfully.");
            }).catch((error) => {
                console.error("Error generating PDF:", error);
                alert("An error occurred while generating the PDF. Please try again.");
            });
        });
    } else {
        console.error("Download CV button not found in the DOM.");
    }

    // Contact form animation and prevent reload
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            contactForm.reset();
            contactForm.querySelector('button').textContent = 'Sent!';
            setTimeout(() => {
                contactForm.querySelector('button').textContent = 'Send';
            }, 2000);
        });
    }

    // Fix theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    function setTheme(isLight) {
        if (isLight) {
            body.classList.add('light-theme');
            themeToggle.textContent = '🌞';
        } else {
            body.classList.remove('light-theme');
            themeToggle.textContent = '🌙';
        }
    }

    // Default to dark theme
    setTheme(false);

    // Animate theme change
    function animateThemeChange() {
        body.style.transition = 'background 0.5s, color 0.5s';
        setTimeout(() => {
            body.style.transition = '';
        }, 600);
    }

    themeToggle.addEventListener('click', () => {
        const isLight = !body.classList.contains('light-theme');
        setTheme(isLight);
        animateThemeChange();
    });

    // Hamburger menu for mobile
    const hamburger = document.getElementById('hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    // Create overlay for menu
    let menuOverlay = document.querySelector('.menu-overlay');
    if (!menuOverlay) {
        menuOverlay = document.createElement('div');
        menuOverlay.className = 'menu-overlay';
        document.body.appendChild(menuOverlay);
    }
    function closeMenu() {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        menuOverlay.classList.remove('active');
    }
    hamburger.addEventListener('click', function () {
        // Force reflow to ensure transition triggers
        void navLinks.offsetWidth;
        const isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('active');
        menuOverlay.classList.toggle('active', isOpen);
        // Add smooth transition for sliding effect
        navLinks.style.transition = 'transform 0.5s ease';
        // If menu is open and on mobile, focus the first nav link
        if (isOpen && window.innerWidth <= 800) {
            const firstLink = navLinks.querySelector('a');
            if (firstLink) firstLink.focus();
        }
    });
    menuOverlay.addEventListener('click', closeMenu);
    // Close menu on nav link click (mobile) and scroll to section
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function (e) {
            closeMenu();
            // Wait for menu to close before scrolling
            setTimeout(() => {
                const targetId = this.getAttribute('href');
                if (targetId.length > 1 && document.querySelector(targetId)) {
                    const target = document.querySelector(targetId);
                    const headerOffset = navbar ? navbar.offsetHeight : 0;
                    const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerOffset - 8;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    target.classList.add('section-scale-animate');
                    setTimeout(() => {
                        target.classList.remove('section-scale-animate');
                    }, 600);
                }
            }, 250);
        });
    });

    // Add smooth scrolling for side menu bar in mobile format
    navLinks.addEventListener('wheel', (e) => {
        e.preventDefault();
        navLinks.scrollBy({
            top: e.deltaY,
            behavior: 'smooth'
        });
    });
});

// Close sidebar if clicked outside
window.addEventListener('click', function (event) {
    const sidebar = document.querySelector('.sidebar');
    const hamburgerMenu = document.getElementById('hamburger-menu');

    if (sidebar && !sidebar.contains(event.target) && !hamburgerMenu.contains(event.target)) {
        sidebar.classList.remove('open');
    }
});

// Project slider infinite loop (basic)
window.addEventListener('DOMContentLoaded', function () {
    const slider = document.getElementById('projectSlider');
    if (!slider) return;
    // Duplicate GIFs for seamless loop
    slider.innerHTML += slider.innerHTML;
    let isDown = false;
    let startX, scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });
    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
    });
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.5;
        slider.scrollLeft = scrollLeft - walk;
    });
    // Touch support
    slider.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('touchend', () => {
        isDown = false;
    });
    slider.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.5;
        slider.scrollLeft = scrollLeft - walk;
    });
    // Optional: auto-scroll for infinite effect
    setInterval(() => {
        if (slider.scrollLeft >= slider.scrollWidth / 2) {
            slider.scrollLeft = 0;
        } else {
            slider.scrollLeft += 1;
        }
    }, 30);
});

// Project slider row 1: left to right
window.addEventListener('DOMContentLoaded', function () {
    const slider1 = document.getElementById('projectSliderRow1');
    if (!slider1) return;
    slider1.innerHTML += slider1.innerHTML;
    // Drag-to-scroll support
    let isDown1 = false;
    let startX1, scrollLeft1;
    slider1.addEventListener('mousedown', (e) => {
        isDown1 = true;
        slider1.classList.add('active');
        startX1 = e.pageX - slider1.offsetLeft;
        scrollLeft1 = slider1.scrollLeft;
    });
    slider1.addEventListener('mouseleave', () => {
        isDown1 = false;
        slider1.classList.remove('active');
    });
    slider1.addEventListener('mouseup', () => {
        isDown1 = false;
        slider1.classList.remove('active');
    });
    slider1.addEventListener('mousemove', (e) => {
        if (!isDown1) return;
        e.preventDefault();
        const x = e.pageX - slider1.offsetLeft;
        const walk = (x - startX1) * 1.5;
        slider1.scrollLeft = scrollLeft1 - walk;
    });
    // Touch support
    slider1.addEventListener('touchstart', (e) => {
        isDown1 = true;
        startX1 = e.touches[0].pageX - slider1.offsetLeft;
        scrollLeft1 = slider1.scrollLeft;
    });
    slider1.addEventListener('touchend', () => {
        isDown1 = false;
    });
    slider1.addEventListener('touchmove', (e) => {
        if (!isDown1) return;
        const x = e.touches[0].pageX - slider1.offsetLeft;
        const walk = (x - startX1) * 1.5;
        slider1.scrollLeft = scrollLeft1 - walk;
    });
    setInterval(() => {
        if (slider1.scrollLeft >= slider1.scrollWidth / 2) {
            slider1.scrollLeft = 0;
        } else {
            slider1.scrollLeft += 1;
        }
    }, 30);
});

// Project slider row 2: right to left
window.addEventListener('DOMContentLoaded', function () {
    const slider2 = document.getElementById('projectSliderRow2');
    if (!slider2) return;
    slider2.innerHTML += slider2.innerHTML;
    // Drag-to-scroll support
    let isDown2 = false;
    let startX2, scrollLeft2;
    slider2.addEventListener('mousedown', (e) => {
        isDown2 = true;
        slider2.classList.add('active');
        startX2 = e.pageX - slider2.offsetLeft;
        scrollLeft2 = slider2.scrollLeft;
    });
    slider2.addEventListener('mouseleave', () => {
        isDown2 = false;
        slider2.classList.remove('active');
    });
    slider2.addEventListener('mouseup', () => {
        isDown2 = false;
        slider2.classList.remove('active');
    });
    slider2.addEventListener('mousemove', (e) => {
        if (!isDown2) return;
        e.preventDefault();
        const x = e.pageX - slider2.offsetLeft;
        const walk = (x - startX2) * 1.5;
        slider2.scrollLeft = scrollLeft2 - walk;
    });
    // Touch support
    slider2.addEventListener('touchstart', (e) => {
        isDown2 = true;
        startX2 = e.touches[0].pageX - slider2.offsetLeft;
        scrollLeft2 = slider2.scrollLeft;
    });
    slider2.addEventListener('touchend', () => {
        isDown2 = false;
    });
    slider2.addEventListener('touchmove', (e) => {
        if (!isDown2) return;
        const x = e.touches[0].pageX - slider2.offsetLeft;
        const walk = (x - startX2) * 1.5;
        slider2.scrollLeft = scrollLeft2 - walk;
    });
    setInterval(() => {
        if (slider2.scrollLeft <= 0) {
            slider2.scrollLeft = slider2.scrollWidth / 2;
        } else {
            slider2.scrollLeft -= 1;
        }
    }, 30);
});