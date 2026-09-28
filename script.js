// ===== LUXE TINY HOMES - MAIN JAVASCRIPT =====

// ===== UTILITY FUNCTIONS =====
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Debounce function for performance optimization
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Local storage helper
const Storage = {
    get: (key) => {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch {
            return null;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('Local storage is not available:', e);
        }
    }
};

// ===== THEME TOGGLE FUNCTIONALITY =====
class ThemeManager {
    constructor() {
        this.themeToggle = $('#theme-toggle');
        this.currentTheme = Storage.get('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!Storage.get('theme')) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        Storage.set('theme', this.currentTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const icon = this.themeToggle.querySelector('i');
        
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
            this.themeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            icon.className = 'fas fa-moon';
            this.themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    }
}

// ===== NAVIGATION FUNCTIONALITY =====
class Navigation {
    constructor() {
        this.header = $('#header');
        this.hamburger = $('#hamburger');
        this.navMenu = $('#nav-menu');
        this.navLinks = $$('.nav-link');
        this.backToTop = $('#back-to-top');
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupScrollEffects();
        this.setupActiveNavigation();
        this.setupBackToTop();
    }

    setupMobileMenu() {
        this.hamburger.addEventListener('click', () => {
            this.hamburger.classList.toggle('active');
            this.navMenu.classList.toggle('active');
            document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu when clicking nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.hamburger.classList.remove('active');
                this.navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close mobile menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.hamburger.classList.remove('active');
                this.navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = $(href);
                    if (target) {
                        const offsetTop = target.offsetTop - 80; // Account for fixed header
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    setupScrollEffects() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', debounce(() => {
            const currentScrollY = window.scrollY;
            
            // Header visibility on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                this.header.style.transform = 'translateY(-100%)';
            } else {
                this.header.style.transform = 'translateY(0)';
            }
            
            // Header background opacity
            if (currentScrollY > 50) {
                this.header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
                this.header.style.backdropFilter = 'blur(15px)';
            } else {
                this.header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                this.header.style.backdropFilter = 'blur(10px)';
            }
            
            lastScrollY = currentScrollY;
        }, 10));
    }

    setupActiveNavigation() {
        const sections = $$('section[id]');
        
        window.addEventListener('scroll', debounce(() => {
            const scrollY = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    this.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, 50));
    }

    setupBackToTop() {
        window.addEventListener('scroll', debounce(() => {
            if (window.scrollY > 500) {
                this.backToTop.classList.add('visible');
            } else {
                this.backToTop.classList.remove('visible');
            }
        }, 100));

        this.backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== LISTINGS FUNCTIONALITY =====
class ListingsManager {
    constructor() {
        this.searchInput = $('#search-input');
        this.priceFilter = $('#price-filter');
        this.typeFilter = $('#type-filter');
        this.locationFilter = $('#location-filter');
        this.clearFiltersBtn = $('#clear-filters');
        this.listingsGrid = $('#listings-grid');
        this.favoriteButtons = $$('.favorite-btn');
        this.favorites = Storage.get('favorites') || [];
        this.init();
    }

    init() {
        this.setupSearch();
        this.setupFilters();
        this.setupFavorites();
        this.loadFavorites();
    }

    setupSearch() {
        this.searchInput.addEventListener('input', debounce((e) => {
            this.filterListings();
        }, 300));
    }

    setupFilters() {
        [this.priceFilter, this.typeFilter, this.locationFilter].forEach(filter => {
            filter.addEventListener('change', () => this.filterListings());
        });

        this.clearFiltersBtn.addEventListener('click', () => {
            this.searchInput.value = '';
            this.priceFilter.value = '';
            this.typeFilter.value = '';
            this.locationFilter.value = '';
            this.filterListings();
        });
    }

    filterListings() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const priceRange = this.priceFilter.value;
        const typeFilter = this.typeFilter.value;
        const locationFilter = this.locationFilter.value;

        const listingCards = $$('.listing-card');
        
        listingCards.forEach(card => {
            const title = card.querySelector('.listing-title').textContent.toLowerCase();
            const description = card.querySelector('.listing-description').textContent.toLowerCase();
            const price = parseInt(card.dataset.price);
            const type = card.dataset.type;
            const location = card.dataset.location;

            let visible = true;

            // Search filter
            if (searchTerm && !title.includes(searchTerm) && !description.includes(searchTerm)) {
                visible = false;
            }

            // Price filter
            if (priceRange) {
                const [min, max] = priceRange.split('-').map(p => p === '' ? Infinity : parseInt(p.replace('+', '')));
                if (priceRange.includes('+')) {
                    if (price < min) visible = false;
                } else {
                    if (price < min || price > max) visible = false;
                }
            }

            // Type filter
            if (typeFilter && type !== typeFilter) {
                visible = false;
            }

            // Location filter
            if (locationFilter && location !== locationFilter) {
                visible = false;
            }

            // Apply visibility
            if (visible) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease-in-out';
            } else {
                card.style.display = 'none';
            }
        });
    }

    setupFavorites() {
        this.favoriteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleFavorite(btn);
            });
        });
    }

    toggleFavorite(button) {
        const listingCard = button.closest('.listing-card');
        const listingId = this.getListingId(listingCard);
        const heart = button.querySelector('i');

        if (this.favorites.includes(listingId)) {
            // Remove from favorites
            this.favorites = this.favorites.filter(id => id !== listingId);
            heart.className = 'far fa-heart';
            button.classList.remove('active');
        } else {
            // Add to favorites
            this.favorites.push(listingId);
            heart.className = 'fas fa-heart';
            button.classList.add('active');
        }

        Storage.set('favorites', this.favorites);
        this.animateButton(button);
    }

    getListingId(card) {
        return card.querySelector('.listing-title').textContent;
    }

    loadFavorites() {
        this.favoriteButtons.forEach(btn => {
            const listingCard = btn.closest('.listing-card');
            const listingId = this.getListingId(listingCard);
            
            if (this.favorites.includes(listingId)) {
                btn.querySelector('i').className = 'fas fa-heart';
                btn.classList.add('active');
            }
        });
    }

    animateButton(button) {
        button.style.transform = 'scale(1.3)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }
}

// ===== TESTIMONIALS SLIDER =====
class TestimonialsSlider {
    constructor() {
        this.slider = $('#testimonials-slider');
        this.cards = $$('.testimonial-card');
        this.prevBtn = $('.testimonial-prev');
        this.nextBtn = $('.testimonial-next');
        this.dots = $$('.dot');
        this.currentSlide = 0;
        this.autoPlay = true;
        this.autoPlayInterval = 5000;
        this.intervalId = null;
        this.init();
    }

    init() {
        this.setupControls();
        this.setupAutoPlay();
        this.setupDots();
    }

    setupControls() {
        this.prevBtn.addEventListener('click', () => {
            this.previousSlide();
            this.resetAutoPlay();
        });

        this.nextBtn.addEventListener('click', () => {
            this.nextSlide();
            this.resetAutoPlay();
        });
    }

    setupDots() {
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
                this.resetAutoPlay();
            });
        });
    }

    setupAutoPlay() {
        if (this.autoPlay) {
            this.startAutoPlay();
            
            // Pause on hover
            this.slider.addEventListener('mouseenter', () => this.stopAutoPlay());
            this.slider.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }

    startAutoPlay() {
        this.intervalId = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayInterval);
    }

    stopAutoPlay() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }

    goToSlide(index) {
        // Remove active class from current slide
        this.cards[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');

        // Update current slide
        this.currentSlide = index;

        // Add active class to new slide
        this.cards[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.cards.length;
        this.goToSlide(nextIndex);
    }

    previousSlide() {
        const prevIndex = (this.currentSlide - 1 + this.cards.length) % this.cards.length;
        this.goToSlide(prevIndex);
    }
}

// ===== CONTACT FORM HANDLER =====
class ContactForm {
    constructor() {
        this.form = $('#contact-form');
        this.submitBtn = this.form.querySelector('button[type="submit"]');
        this.btnText = this.submitBtn.querySelector('.btn-text');
        this.btnLoader = this.submitBtn.querySelector('.btn-loader');
        this.formMessage = $('#form-message');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Real-time validation
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    async handleSubmit() {
        if (!this.validateForm()) return;

        this.setLoadingState(true);
        
        try {
            // Simulate form submission (replace with actual endpoint)
            await this.simulateFormSubmission();
            this.showMessage('success', 'Thank you! Your message has been sent. We\'ll get back to you within 24 hours.');
            this.form.reset();
        } catch (error) {
            this.showMessage('error', 'Something went wrong. Please try again or call us directly.');
        }
        
        this.setLoadingState(false);
    }

    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        let isValid = true;
        let errorMessage = '';

        // Check if required field is empty
        if (field.required && !value) {
            errorMessage = 'This field is required';
            isValid = false;
        } 
        // Email validation
        else if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
        }
        // Phone validation
        else if (fieldType === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                errorMessage = 'Please enter a valid phone number';
                isValid = false;
            }
        }

        this.displayFieldError(field, errorMessage);
        return isValid;
    }

    displayFieldError(field, message) {
        // Remove existing error
        this.clearFieldError(field);

        if (message) {
            field.style.borderColor = 'var(--color-error)';
            
            const errorEl = document.createElement('span');
            errorEl.className = 'field-error';
            errorEl.textContent = message;
            errorEl.style.color = 'var(--color-error)';
            errorEl.style.fontSize = '0.8rem';
            errorEl.style.marginTop = '0.25rem';
            errorEl.style.display = 'block';
            
            field.parentNode.appendChild(errorEl);
        }
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    setLoadingState(isLoading) {
        if (isLoading) {
            this.submitBtn.disabled = true;
            this.btnText.style.display = 'none';
            this.btnLoader.style.display = 'inline-block';
        } else {
            this.submitBtn.disabled = false;
            this.btnText.style.display = 'inline-block';
            this.btnLoader.style.display = 'none';
        }
    }

    showMessage(type, text) {
        this.formMessage.className = `form-message ${type}`;
        this.formMessage.textContent = text;
        this.formMessage.style.display = 'block';
        
        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                this.formMessage.style.display = 'none';
            }, 5000);
        }
    }

    simulateFormSubmission() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 95% success rate
                if (Math.random() > 0.05) {
                    resolve();
                } else {
                    reject(new Error('Submission failed'));
                }
            }, 2000);
        });
    }
}

// ===== NEWSLETTER POPUP =====
class NewsletterPopup {
    constructor() {
        this.popup = $('#newsletter-popup');
        this.closeBtn = $('#newsletter-close');
        this.overlay = $('.newsletter-overlay');
        this.form = $('#newsletter-form');
        this.hasShown = Storage.get('newsletter-shown') || false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.schedulePopup();
    }

    setupEventListeners() {
        this.closeBtn.addEventListener('click', () => this.hidePopup());
        this.overlay.addEventListener('click', () => this.hidePopup());
        
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmission();
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.popup.classList.contains('show')) {
                this.hidePopup();
            }
        });
    }

    schedulePopup() {
        if (!this.hasShown) {
            // Show popup after 30 seconds or when user scrolls 50%
            setTimeout(() => this.showPopup(), 30000);
            
            const scrollTrigger = () => {
                const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
                if (scrollPercent > 50 && !this.hasShown) {
                    this.showPopup();
                    window.removeEventListener('scroll', scrollTrigger);
                }
            };
            
            window.addEventListener('scroll', debounce(scrollTrigger, 100));
        }
    }

    showPopup() {
        if (this.hasShown) return;
        
        this.popup.classList.add('show');
        document.body.style.overflow = 'hidden';
        this.hasShown = true;
        Storage.set('newsletter-shown', true);
    }

    hidePopup() {
        this.popup.classList.remove('show');
        document.body.style.overflow = '';
    }

    async handleSubmission() {
        const email = this.form.querySelector('input[type="email"]').value;
        const submitBtn = this.form.querySelector('button');
        
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.form.innerHTML = `
                <div style="text-align: center; padding: 1rem;">
                    <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--color-success); margin-bottom: 1rem;"></i>
                    <h3 style="color: var(--color-success); margin-bottom: 0.5rem;">Success!</h3>
                    <p>Thank you for subscribing! Check your email for confirmation.</p>
                </div>
            `;
            
            setTimeout(() => this.hidePopup(), 3000);
        } catch (error) {
            submitBtn.textContent = 'Try Again';
            submitBtn.disabled = false;
        }
    }
}

// ===== CHAT WIDGET =====
class ChatWidget {
    constructor() {
        this.widget = $('#chat-widget');
        this.toggle = $('#chat-toggle');
        this.popup = $('#chat-popup');
        this.closeBtn = $('#chat-close');
        this.input = this.widget.querySelector('.chat-input input');
        this.sendBtn = this.widget.querySelector('.chat-input button');
        this.content = $('.chat-content');
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.toggle.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', () => this.closeChat());
        
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    toggleChat() {
        this.popup.classList.toggle('active');
        
        if (this.popup.classList.contains('active')) {
            this.input.focus();
        }
    }

    closeChat() {
        this.popup.classList.remove('active');
    }

    sendMessage() {
        const message = this.input.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.input.value = '';

        // Simulate response
        setTimeout(() => {
            this.addMessage("Thank you for your message! A real estate specialist will respond shortly. For immediate assistance, please call +1-555-TINY-HOME.", 'bot');
        }, 1000);
    }

    addMessage(text, sender) {
        const messageEl = document.createElement('div');
        messageEl.className = `chat-message ${sender}`;
        messageEl.style.marginBottom = '0.5rem';
        messageEl.style.padding = '0.5rem';
        messageEl.style.borderRadius = '8px';
        messageEl.style.backgroundColor = sender === 'user' ? 'var(--color-forest-green)' : 'var(--color-light)';
        messageEl.style.color = sender === 'user' ? 'white' : 'var(--color-text-dark)';
        messageEl.style.fontSize = '0.9rem';
        messageEl.textContent = text;

        this.content.appendChild(messageEl);
        this.content.scrollTop = this.content.scrollHeight;
    }
}

// ===== ANIMATIONS AND SCROLL EFFECTS =====
class AnimationManager {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupImageLoading();
        this.setupScrollIndicator();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, this.observerOptions);

        // Observe elements for animation
        const elementsToAnimate = $$('.listing-card, .upgrade-card, .financing-card, .about-content, .testimonials-slider');
        elementsToAnimate.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });

        // CSS for animation
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }

    setupImageLoading() {
        const images = $$('img');
        
        images.forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
            }
        });
    }

    setupScrollIndicator() {
        const indicator = $('.scroll-indicator');
        if (!indicator) return;

        indicator.addEventListener('click', () => {
            const listingsSection = $('#listings');
            if (listingsSection) {
                listingsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// ===== MAIN INITIALIZATION =====
class LuxeTinyHomesApp {
    constructor() {
        this.themeManager = null;
        this.navigation = null;
        this.listingsManager = null;
        this.testimonialsSlider = null;
        this.contactForm = null;
        this.newsletterPopup = null;
        this.chatWidget = null;
        this.animationManager = null;
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            // Initialize all components
            this.themeManager = new ThemeManager();
            this.navigation = new Navigation();
            this.listingsManager = new ListingsManager();
            this.testimonialsSlider = new TestimonialsSlider();
            this.contactForm = new ContactForm();
            this.newsletterPopup = new NewsletterPopup();
            this.chatWidget = new ChatWidget();
            this.animationManager = new AnimationManager();

            console.log('Luxe Tiny Homes website initialized successfully!');
        } catch (error) {
            console.error('Error initializing website components:', error);
        }
    }
}

// ===== ADDITIONAL UTILITY FUNCTIONS =====

// Format price display
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Copy text to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy text: ', err);
        return false;
    }
}

// Get query parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
        result[key] = value;
    }
    return result;
}

// Validate email address
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Validate phone number
function isValidPhone(phone) {
    const regex = /^[\+]?[1-9][\d]{0,15}$/;
    return regex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Format phone number for display
function formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
}

// ===== PERFORMANCE MONITORING =====
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            setTimeout(() => this.collectMetrics(), 0);
        });
    }

    collectMetrics() {
        if ('performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0];
            
            this.metrics = {
                loadTime: navigation.loadEventEnd - navigation.loadEventStart,
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
                firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
            };

            console.log('Performance Metrics:', this.metrics);
        }
    }
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (event) => {
    console.error('JavaScript Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
});

// ===== INITIALIZE APPLICATION =====
const app = new LuxeTinyHomesApp();
app.init();

// Initialize performance monitoring
const performanceMonitor = new PerformanceMonitor();

// Export for potential external use
window.LuxeTinyHomesApp = {
    app,
    ThemeManager,
    Navigation,
    ListingsManager,
    TestimonialsSlider,
    ContactForm,
    NewsletterPopup,
    ChatWidget,
    AnimationManager,
    utils: {
        formatPrice,
        generateId,
        copyToClipboard,
        getUrlParams,
        isValidEmail,
        isValidPhone,
        formatPhone
    }
};