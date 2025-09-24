// Main JavaScript for Bella Vista Restaurant Landing Page

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // Initialize all components
    initializeNavbar();
    initializeDarkMode();
    initializeFormValidation();
    initializeGallery();
    initializeScrollToTop();
    initializeTodaysSpecial();
    initializeImageLoading();
    initializeSmoothScrolling();

});

// ===========================
// Navbar Functions
// ===========================
function initializeNavbar() {
    const navbar = document.getElementById('mainNavbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Handle navbar background on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active nav links based on scroll position
        updateActiveNavLink();
    });

    // Handle nav link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');

            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const navbarToggler = document.querySelector('.navbar-toggler');
                navbarToggler.click();
            }
        });
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) {
            link.classList.add('active');
        }
    });
}

// ===========================
// Dark Mode Functions
// ===========================
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = document.getElementById('darkModeIcon');
    const body = document.body;

    // Check for saved dark mode preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', currentTheme);

    // Update icon based on current theme
    updateDarkModeIcon(currentTheme);

    // Dark mode toggle event listener
    darkModeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateDarkModeIcon(newTheme);

        // Add animation class for smooth transition
        body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    });
}

function updateDarkModeIcon(theme) {
    const darkModeIcon = document.getElementById('darkModeIcon');
    if (theme === 'dark') {
        darkModeIcon.className = 'fas fa-sun';
    } else {
        darkModeIcon.className = 'fas fa-moon';
    }
}

// ===========================
// Form Validation Functions
// ===========================
function initializeFormValidation() {
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (validateForm()) {
            // Show success message
            showFormMessage('success', 'Thank you for your message! We will get back to you soon.');
            contactForm.reset();
            contactForm.classList.remove('was-validated');
        } else {
            // Show error message
            showFormMessage('error', 'Please fill in all required fields correctly.');
        }

        contactForm.classList.add('was-validated');
    });

    // Real-time validation
    const formInputs = contactForm.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', validateField);
    });
}

function validateForm() {
    const form = document.getElementById('contactForm');
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    let isValid = true;

    // First name validation
    if (!firstName.value.trim()) {
        setFieldError(firstName, 'First name is required.');
        isValid = false;
    } else if (firstName.value.trim().length < 2) {
        setFieldError(firstName, 'First name must be at least 2 characters.');
        isValid = false;
    } else {
        setFieldSuccess(firstName);
    }

    // Last name validation
    if (!lastName.value.trim()) {
        setFieldError(lastName, 'Last name is required.');
        isValid = false;
    } else if (lastName.value.trim().length < 2) {
        setFieldError(lastName, 'Last name must be at least 2 characters.');
        isValid = false;
    } else {
        setFieldSuccess(lastName);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        setFieldError(email, 'Email is required.');
        isValid = false;
    } else if (!emailRegex.test(email.value.trim())) {
        setFieldError(email, 'Please enter a valid email address.');
        isValid = false;
    } else {
        setFieldSuccess(email);
    }

    // Message validation
    if (!message.value.trim()) {
        setFieldError(message, 'Message is required.');
        isValid = false;
    } else if (message.value.trim().length < 10) {
        setFieldError(message, 'Message must be at least 10 characters.');
        isValid = false;
    } else if (message.value.trim().length > 500) {
        setFieldError(message, 'Message must not exceed 500 characters.');
        isValid = false;
    } else {
        setFieldSuccess(message);
    }

    return isValid;
}

function validateField(e) {
    const field = e.target;
    const fieldType = field.type;
    const fieldValue = field.value.trim();

    switch (field.id) {
        case 'firstName':
        case 'lastName':
            if (!fieldValue) {
                setFieldError(field, `${field.id === 'firstName' ? 'First' : 'Last'} name is required.`);
            } else if (fieldValue.length < 2) {
                setFieldError(field, `${field.id === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters.`);
            } else {
                setFieldSuccess(field);
            }
            break;

        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!fieldValue) {
                setFieldError(field, 'Email is required.');
            } else if (!emailRegex.test(fieldValue)) {
                setFieldError(field, 'Please enter a valid email address.');
            } else {
                setFieldSuccess(field);
            }
            break;

        case 'message':
            if (!fieldValue) {
                setFieldError(field, 'Message is required.');
            } else if (fieldValue.length < 10) {
                setFieldError(field, 'Message must be at least 10 characters.');
            } else if (fieldValue.length > 500) {
                setFieldError(field, 'Message must not exceed 500 characters.');
            } else {
                setFieldSuccess(field);
            }
            break;
    }
}

function setFieldError(field, message) {
    field.classList.remove('is-valid');
    field.classList.add('is-invalid');

    const feedback = field.parentNode.querySelector('.invalid-feedback');
    if (feedback) {
        feedback.textContent = message;
    }
}

function setFieldSuccess(field) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
}

function showFormMessage(type, message) {
    // Remove any existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert form-message ${type === 'success' ? 'alert-success' : 'alert-danger'} mt-3`;
    messageDiv.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2"></i>
        ${message}
    `;

    // Insert message after the form
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(messageDiv, form.nextSibling);

    // Remove message after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// ===========================
// Gallery Functions
// ===========================
function initializeGallery() {
    const galleryImages = document.querySelectorAll('.gallery-img');
    const galleryModal = document.getElementById('galleryModal');
    const galleryModalImage = document.getElementById('galleryModalImage');

    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            const imageSrc = this.getAttribute('data-bs-image');
            const imageAlt = this.alt;

            galleryModalImage.src = imageSrc;
            galleryModalImage.alt = imageAlt;
        });

        // Add keyboard navigation
        img.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });

        // Make images focusable
        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', 'Open image in lightbox');
    });
}

// ===========================
// Scroll to Top Functions
// ===========================
function initializeScrollToTop() {
    // Create scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollToTopBtn);

    // Show/hide scroll to top button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===========================
// Today's Special Functions
// ===========================
function initializeTodaysSpecial() {
    const todaysSpecialBadge = document.getElementById('todaysSpecial');
    const currentDay = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Show special badge on specific days (example: show on weekends)
    if (currentDay === 6 || currentDay === 0) { // Saturday or Sunday
        todaysSpecialBadge.style.display = 'block';

        // Add entrance animation
        setTimeout(() => {
            todaysSpecialBadge.style.opacity = '0';
            todaysSpecialBadge.style.transform = 'translateY(20px)';
            todaysSpecialBadge.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

            requestAnimationFrame(() => {
                todaysSpecialBadge.style.opacity = '1';
                todaysSpecialBadge.style.transform = 'translateY(0)';
            });
        }, 1000);
    }
}

// ===========================
// Image Loading Functions
// ===========================
function initializeImageLoading() {
    const images = document.querySelectorAll('img');

    // Add loading class to all images
    images.forEach(img => {
        img.classList.add('loading');

        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });

            img.addEventListener('error', function() {
                this.classList.add('loaded');
                // Set a placeholder image or show error state
                console.warn('Failed to load image:', this.src);
            });
        }
    });
}

// ===========================
// Smooth Scrolling Functions
// ===========================
function initializeSmoothScrolling() {
    // Handle smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            // Skip if it's just "#" or empty
            if (targetId === '#' || targetId === '') {
                e.preventDefault();
                return;
            }

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===========================
// Utility Functions
// ===========================

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===========================
// Animation Observer (Intersection Observer)
// ===========================
function initializeAnimationObserver() {
    // Observe elements for entrance animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserver(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.menu-card, .testimonial-card, .contact-item').forEach(el => {
        observer.observe(el);
    });
}

// Initialize animation observer when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeAnimationObserver);

// ===========================
// Performance Optimizations
// ===========================

// Optimize scroll event handlers
window.addEventListener('scroll', throttle(function() {
    updateActiveNavLink();
}, 100));

// Preload critical images
function preloadImages() {
    const criticalImages = [
        'assets/images/logo.png',
        'assets/images/chef.jpg',
        'assets/images/margherita-pizza.jpg'
    ];

    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading
document.addEventListener('DOMContentLoaded', preloadImages);

// ===========================
// Error Handling
// ===========================

// Global error handler
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You can add error reporting here if needed
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    e.preventDefault();
});

// ===========================
// Accessibility Enhancements
// ===========================

// Skip to main content functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add skip link for screen readers
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link sr-only sr-only-focusable';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        z-index: 1000;
        color: white;
        background: var(--primary-color);
        padding: 8px 16px;
        text-decoration: none;
        border-radius: 4px;
    `;

    // Show skip link on focus
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });

    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);
});

// Announce dynamic content changes for screen readers
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// ===========================
// Service Worker Registration (Optional)
// ===========================
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            }, function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}
*/

console.log('Bella Vista Restaurant - JavaScript loaded successfully!');