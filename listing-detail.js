// ===== LISTING DETAIL PAGE JAVASCRIPT =====

// ===== IMAGE GALLERY FUNCTIONALITY =====
class ImageGallery {
    constructor() {
        this.mainImage = document.getElementById('main-image');
        this.thumbnails = document.querySelectorAll('.thumbnail');
        this.currentImageEl = document.getElementById('current-image');
        this.totalImagesEl = document.getElementById('total-images');
        this.currentIndex = 0;
        this.images = Array.from(this.thumbnails).map(thumb => ({
            src: thumb.dataset.full,
            alt: thumb.alt
        }));
        this.init();
    }

    init() {
        this.updateCounter();
        this.setupThumbnailClicks();
        this.setupKeyboardNavigation();
        this.preloadImages();
    }

    setupThumbnailClicks() {
        this.thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                this.goToImage(index);
            });
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (document.querySelector('.modal.show')) return; // Don't interfere with modals
            
            if (e.key === 'ArrowLeft') {
                this.previousImage();
            } else if (e.key === 'ArrowRight') {
                this.nextImage();
            }
        });
    }

    goToImage(index) {
        if (index < 0 || index >= this.images.length) return;

        // Update active thumbnail
        this.thumbnails[this.currentIndex].classList.remove('active');
        this.thumbnails[index].classList.add('active');

        // Update main image
        this.currentIndex = index;
        this.mainImage.src = this.images[index].src;
        this.mainImage.alt = this.images[index].alt;
        
        // Update counter
        this.updateCounter();
        
        // Add loading animation
        this.mainImage.style.opacity = '0.7';
        this.mainImage.onload = () => {
            this.mainImage.style.opacity = '1';
        };
    }

    nextImage() {
        const nextIndex = (this.currentIndex + 1) % this.images.length;
        this.goToImage(nextIndex);
    }

    previousImage() {
        const prevIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.goToImage(prevIndex);
    }

    updateCounter() {
        this.currentImageEl.textContent = this.currentIndex + 1;
        this.totalImagesEl.textContent = this.images.length;
    }

    preloadImages() {
        this.images.forEach(image => {
            const img = new Image();
            img.src = image.src;
        });
    }
}

// ===== FAVORITE FUNCTIONALITY =====
class FavoriteManager {
    constructor() {
        this.favoriteBtn = document.getElementById('favorite-btn');
        this.listingId = this.getListingId();
        this.favorites = this.getFavorites();
        this.init();
    }

    init() {
        this.updateFavoriteButton();
        this.favoriteBtn.addEventListener('click', () => this.toggleFavorite());
    }

    getListingId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id') || 'modern-scandinavian-tiny-home';
    }

    getFavorites() {
        try {
            return JSON.parse(localStorage.getItem('favorites')) || [];
        } catch {
            return [];
        }
    }

    saveFavorites() {
        try {
            localStorage.setItem('favorites', JSON.stringify(this.favorites));
        } catch (e) {
            console.warn('Could not save favorites:', e);
        }
    }

    toggleFavorite() {
        const isFavorited = this.favorites.includes(this.listingId);
        
        if (isFavorited) {
            this.favorites = this.favorites.filter(id => id !== this.listingId);
        } else {
            this.favorites.push(this.listingId);
        }

        this.saveFavorites();
        this.updateFavoriteButton();
        this.animateButton();
    }

    updateFavoriteButton() {
        const isFavorited = this.favorites.includes(this.listingId);
        const icon = this.favoriteBtn.querySelector('i');
        
        if (isFavorited) {
            icon.className = 'fas fa-heart';
            this.favoriteBtn.classList.add('active');
        } else {
            icon.className = 'far fa-heart';
            this.favoriteBtn.classList.remove('active');
        }
    }

    animateButton() {
        this.favoriteBtn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.favoriteBtn.style.transform = 'scale(1)';
        }, 150);
    }
}

// ===== MODAL FUNCTIONALITY =====
class ModalManager {
    constructor() {
        this.modals = document.querySelectorAll('.modal');
        this.virtualTourBtn = document.getElementById('virtual-tour-btn');
        this.shareBtn = document.getElementById('share-btn');
        this.init();
    }

    init() {
        this.setupModalTriggers();
        this.setupModalClosers();
        this.setupEscapeKey();
    }

    setupModalTriggers() {
        this.virtualTourBtn.addEventListener('click', () => {
            this.openModal('virtual-tour-modal');
        });

        this.shareBtn.addEventListener('click', () => {
            this.openModal('share-modal');
        });
    }

    setupModalClosers() {
        this.modals.forEach(modal => {
            const overlay = modal.querySelector('.modal-overlay');
            const closeBtn = modal.querySelector('.modal-close');

            overlay.addEventListener('click', () => this.closeModal(modal));
            closeBtn.addEventListener('click', () => this.closeModal(modal));
        });
    }

    setupEscapeKey() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    closeAllModals() {
        this.modals.forEach(modal => this.closeModal(modal));
    }
}

// ===== SHARE FUNCTIONALITY =====
class ShareManager {
    constructor() {
        this.shareOptions = document.querySelectorAll('.share-option');
        this.shareUrlInput = document.getElementById('share-url-input');
        this.copyUrlBtn = document.getElementById('copy-url-btn');
        this.currentUrl = window.location.href;
        this.listingTitle = document.querySelector('.listing-title').textContent;
        this.init();
    }

    init() {
        this.setupShareOptions();
        this.setupCopyButton();
        this.updateShareUrl();
    }

    setupShareOptions() {
        this.shareOptions.forEach(option => {
            option.addEventListener('click', () => {
                const shareType = option.dataset.share;
                this.handleShare(shareType);
            });
        });
    }

    setupCopyButton() {
        this.copyUrlBtn.addEventListener('click', () => {
            this.copyToClipboard(this.currentUrl);
        });
    }

    updateShareUrl() {
        this.shareUrlInput.value = this.currentUrl;
    }

    handleShare(type) {
        const shareData = {
            url: this.currentUrl,
            title: this.listingTitle,
            text: `Check out this amazing tiny home: ${this.listingTitle}`
        };

        switch (type) {
            case 'facebook':
                this.shareToFacebook(shareData);
                break;
            case 'twitter':
                this.shareToTwitter(shareData);
                break;
            case 'pinterest':
                this.shareToPinterest(shareData);
                break;
            case 'email':
                this.shareViaEmail(shareData);
                break;
            case 'copy':
                this.copyToClipboard(shareData.url);
                break;
        }
    }

    shareToFacebook(data) {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`;
        window.open(url, '_blank', 'width=600,height=400');
    }

    shareToTwitter(data) {
        const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(data.text)}`;
        window.open(url, '_blank', 'width=600,height=400');
    }

    shareToPinterest(data) {
        const imageUrl = document.getElementById('main-image').src;
        const url = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(data.url)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(data.text)}`;
        window.open(url, '_blank', 'width=600,height=400');
    }

    shareViaEmail(data) {
        const subject = encodeURIComponent(`Check out this tiny home: ${data.title}`);
        const body = encodeURIComponent(`I found this amazing tiny home and thought you might be interested:\n\n${data.title}\n${data.url}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showCopySuccess();
        } catch (err) {
            // Fallback for older browsers
            this.fallbackCopyToClipboard(text);
        }
    }

    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showCopySuccess();
        } catch (err) {
            console.error('Could not copy text: ', err);
            this.showCopyError();
        }
        
        document.body.removeChild(textArea);
    }

    showCopySuccess() {
        const originalText = this.copyUrlBtn.textContent;
        this.copyUrlBtn.textContent = 'Copied!';
        this.copyUrlBtn.style.backgroundColor = 'var(--color-success)';
        
        setTimeout(() => {
            this.copyUrlBtn.textContent = originalText;
            this.copyUrlBtn.style.backgroundColor = '';
        }, 2000);
    }

    showCopyError() {
        const originalText = this.copyUrlBtn.textContent;
        this.copyUrlBtn.textContent = 'Error';
        this.copyUrlBtn.style.backgroundColor = 'var(--color-error)';
        
        setTimeout(() => {
            this.copyUrlBtn.textContent = originalText;
            this.copyUrlBtn.style.backgroundColor = '';
        }, 2000);
    }
}

// ===== INQUIRY FORM HANDLER =====
class InquiryForm {
    constructor() {
        this.form = document.getElementById('listing-inquiry-form');
        this.submitBtn = this.form.querySelector('button[type="submit"]');
        this.btnText = this.submitBtn.querySelector('.btn-text');
        this.btnLoader = this.submitBtn.querySelector('.btn-loader');
        this.messageEl = document.getElementById('inquiry-form-message');
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
        });
    }

    async handleSubmit() {
        if (!this.validateForm()) return;

        this.setLoadingState(true);
        
        try {
            // Get form data
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData.entries());
            
            // Add listing information
            data.listingTitle = document.querySelector('.listing-title').textContent;
            data.listingPrice = document.querySelector('.listing-price').textContent;
            data.listingUrl = window.location.href;
            
            // Simulate form submission
            await this.submitInquiry(data);
            
            this.showMessage('success', 'Thank you for your inquiry! We\'ll get back to you within 2 hours.');
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

        // Clear previous error
        this.clearFieldError(field);

        if (field.required && !value) {
            errorMessage = 'This field is required';
            isValid = false;
        } else if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
        } else if (fieldType === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                errorMessage = 'Please enter a valid phone number';
                isValid = false;
            }
        }

        if (!isValid) {
            this.displayFieldError(field, errorMessage);
        }

        return isValid;
    }

    displayFieldError(field, message) {
        field.style.borderColor = 'var(--color-error)';
        
        const errorEl = document.createElement('div');
        errorEl.className = 'field-error';
        errorEl.textContent = message;
        errorEl.style.color = 'var(--color-error)';
        errorEl.style.fontSize = '0.8rem';
        errorEl.style.marginTop = '0.25rem';
        
        field.parentNode.appendChild(errorEl);
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    setLoadingState(isLoading) {
        this.submitBtn.disabled = isLoading;
        this.btnText.style.display = isLoading ? 'none' : 'inline-block';
        this.btnLoader.style.display = isLoading ? 'inline-block' : 'none';
    }

    showMessage(type, text) {
        this.messageEl.className = `form-message ${type}`;
        this.messageEl.textContent = text;
        this.messageEl.style.display = 'block';
        
        if (type === 'success') {
            setTimeout(() => {
                this.messageEl.style.display = 'none';
            }, 5000);
        }
    }

    async submitInquiry(data) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Submission failed'));
                }
            }, 2000);
        });
    }
}

// ===== FINANCING CALCULATOR =====
class FinancingCalculator {
    constructor() {
        this.homePriceInput = document.getElementById('home-price');
        this.downPaymentInput = document.getElementById('down-payment');
        this.interestRateInput = document.getElementById('interest-rate');
        this.loanTermSelect = document.getElementById('loan-term');
        this.monthlyPaymentEl = document.getElementById('monthly-payment');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.calculate();
    }

    setupEventListeners() {
        [this.downPaymentInput, this.interestRateInput, this.loanTermSelect].forEach(input => {
            input.addEventListener('input', () => this.calculate());
            input.addEventListener('change', () => this.calculate());
        });
    }

    calculate() {
        const homePrice = parseFloat(this.homePriceInput.value) || 0;
        const downPayment = parseFloat(this.downPaymentInput.value) || 0;
        const annualRate = parseFloat(this.interestRateInput.value) || 0;
        const loanTermYears = parseInt(this.loanTermSelect.value) || 15;

        const loanAmount = homePrice - downPayment;
        const monthlyRate = (annualRate / 100) / 12;
        const numberOfPayments = loanTermYears * 12;

        let monthlyPayment = 0;
        
        if (monthlyRate > 0 && numberOfPayments > 0 && loanAmount > 0) {
            monthlyPayment = loanAmount * 
                (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        }

        this.updateDisplay(monthlyPayment);
    }

    updateDisplay(monthlyPayment) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });

        this.monthlyPaymentEl.textContent = formatter.format(monthlyPayment);
    }
}

// ===== SIMILAR LISTINGS FUNCTIONALITY =====
class SimilarListings {
    constructor() {
        this.similarItems = document.querySelectorAll('.similar-item');
        this.init();
    }

    init() {
        this.similarItems.forEach(item => {
            item.addEventListener('click', () => {
                // In a real application, this would navigate to the actual listing
                console.log('Navigate to similar listing');
                // window.location.href = item.dataset.url;
            });
        });
    }
}

// ===== SCROLL TO TOP ON PAGE LOAD =====
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== LOADING STATE MANAGEMENT =====
class LoadingManager {
    constructor() {
        this.images = document.querySelectorAll('img');
        this.loadedCount = 0;
        this.totalImages = this.images.length;
        this.init();
    }

    init() {
        this.setupImageLoading();
    }

    setupImageLoading() {
        this.images.forEach(img => {
            if (img.complete) {
                this.handleImageLoad(img);
            } else {
                img.addEventListener('load', () => this.handleImageLoad(img));
                img.addEventListener('error', () => this.handleImageError(img));
            }
        });
    }

    handleImageLoad(img) {
        img.classList.add('loaded');
        this.loadedCount++;
        
        if (this.loadedCount === this.totalImages) {
            this.onAllImagesLoaded();
        }
    }

    handleImageError(img) {
        img.style.display = 'none';
        console.warn('Failed to load image:', img.src);
        this.loadedCount++;
        
        if (this.loadedCount === this.totalImages) {
            this.onAllImagesLoaded();
        }
    }

    onAllImagesLoaded() {
        document.body.classList.add('images-loaded');
        console.log('All images loaded');
    }
}

// ===== URL PARAMETER HANDLING =====
function getUrlParameters() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get('id'),
        view: params.get('view'),
        tour: params.get('tour')
    };
}

// ===== AUTO-OPEN VIRTUAL TOUR =====
function handleUrlActions() {
    const params = getUrlParameters();
    
    // Auto-open virtual tour if specified in URL
    if (params.tour === 'true') {
        setTimeout(() => {
            document.getElementById('virtual-tour-btn').click();
        }, 1000);
    }
}

// ===== LISTING DETAIL APP INITIALIZATION =====
class ListingDetailApp {
    constructor() {
        this.imageGallery = null;
        this.favoriteManager = null;
        this.modalManager = null;
        this.shareManager = null;
        this.inquiryForm = null;
        this.financingCalculator = null;
        this.similarListings = null;
        this.loadingManager = null;
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            // Initialize all components
            this.imageGallery = new ImageGallery();
            this.favoriteManager = new FavoriteManager();
            this.modalManager = new ModalManager();
            this.shareManager = new ShareManager();
            this.inquiryForm = new InquiryForm();
            this.financingCalculator = new FinancingCalculator();
            this.similarListings = new SimilarListings();
            this.loadingManager = new LoadingManager();

            // Handle URL parameters
            handleUrlActions();

            // Scroll to top
            scrollToTop();

            console.log('Listing detail page initialized successfully!');
        } catch (error) {
            console.error('Error initializing listing detail components:', error);
        }
    }
}

// ===== INITIALIZE APPLICATION =====
const listingDetailApp = new ListingDetailApp();
listingDetailApp.init();

// ===== EXPORT FOR POTENTIAL EXTERNAL USE =====
window.ListingDetailApp = {
    app: listingDetailApp,
    ImageGallery,
    FavoriteManager,
    ModalManager,
    ShareManager,
    InquiryForm,
    FinancingCalculator,
    SimilarListings,
    LoadingManager,
    utils: {
        getUrlParameters,
        scrollToTop,
        handleUrlActions
    }
};