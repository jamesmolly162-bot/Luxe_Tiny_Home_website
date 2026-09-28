# Luxe Tiny Homes - Premium Real Estate Website

A fully responsive, modern, and SEO-optimized website for a real estate agent specializing in tiny homes and homes on wheels. Built with vanilla HTML, CSS, and JavaScript for optimal performance and compatibility.

![Luxe Tiny Homes Website](https://img.shields.io/badge/Status-Complete-green) 
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) 
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) 
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 🏠 About

Luxe Tiny Homes specializes in connecting clients with affordable, sustainable, and mobile living options. This website showcases premium tiny homes and homes on wheels with a focus on conversions, high-quality visuals, and smooth user experience.

### Key Features

- **Fully Responsive Design** - Works perfectly on mobile, tablet, and desktop
- **SEO Optimized** - Meta tags, structured data, and semantic HTML
- **Dark/Light Mode Toggle** - User preference with system detection
- **Advanced Search & Filtering** - Filter by price, type, and location
- **Favorites System** - Save listings with local storage
- **Interactive Image Galleries** - High-quality listing photos
- **Financing Calculator** - Real-time mortgage calculations
- **Contact Forms** - Lead generation with validation
- **Virtual Tour Integration** - Ready for 360° tours
- **Social Media Sharing** - Built-in sharing functionality

## 🎨 Design Features

- **Brand Color Palette (updated)**: White (#ffffff), Light Gray (#fafafa), Primary Red (#b71c1c), Accent Red (#e53935)
- **Typography**: Poppins (headings), Open Sans (body text)
- **Modern UI Elements**: Rounded corners, subtle shadows, smooth animations
- **Accessibility**: WCAG compliant, keyboard navigation, screen reader friendly

## 📁 Project Structure

```
luxe-tiny-homes-website/
├── index.html                 # Main homepage
├── listing-detail.html        # Individual listing page
├── privacy-policy.html        # Privacy policy page
├── terms.html                 # Terms of service page
├── styles.css                 # Main stylesheet
├── listing-detail.css         # Listing page styles
├── script.js                  # Main JavaScript functionality
├── listing-detail.js          # Listing page functionality
├── images/                    # Image assets (placeholder structure)
│   ├── listings/             # Property photos
│   ├── testimonials/         # Client photos
│   ├── badges/               # Trust badges
│   └── agent-photo.jpg       # Agent headshot
├── videos/                   # Video assets
│   └── hero-tiny-home.mp4    # Hero section video
└── README.md                 # This file
```

## 🚀 Quick Start

### 1. Clone or Download

```bash
# If using Git
git clone <repository-url>

# Or download and extract the ZIP file
```

### 2. Setup Local Development

For basic development, you can simply open the HTML files in a web browser. For full functionality (including AJAX features), use a local server:

#### Option A: Python Server (Recommended)
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Option B: Node.js Server
```bash
# Install http-server globally
npm install -g http-server

# Run server
http-server -p 8000
```

#### Option C: VS Code Live Server
- Install "Live Server" extension
- Right-click on `index.html` → "Open with Live Server"

### 3. Access the Website

Open your browser and navigate to:
- Main site: `http://localhost:8000`
- Listing detail: `http://localhost:8000/listing-detail.html`

## 📱 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+
- **Mobile Safari** (iOS 13+)
- **Chrome Mobile** (Android 8+)

## 🛠️ Customization Guide

### Updating Content

#### 1. Business Information
Edit the following in `index.html`:
- Company name, description, contact details
- Agent information and photo
- Service areas and specialties

#### 2. Listings
To add/modify listings:
- Update the listings grid in `index.html`
- Create new listing detail pages following `listing-detail.html` structure
- Add corresponding images to the `images/listings/` folder

#### 3. Colors and Styling
Modify CSS custom properties in `styles.css`:
```css
:root {
    --color-forest-green: #2e3b2e;  /* Primary brand color */
    --color-warm-accent: #d1b89d;   /* Secondary accent */
    --color-white: #ffffff;         /* Background */
    --color-light: #f5f5f5;        /* Light backgrounds */
}
```

#### 4. Forms and Integrations
Update form actions in `script.js`:
- Contact form submission endpoint
- Newsletter signup integration
- CRM integration points

### SEO Optimization

#### Meta Tags
Each page includes comprehensive meta tags:
- Standard meta descriptions and keywords
- Open Graph tags for social sharing
- Twitter Card metadata
- Structured data (JSON-LD) for search engines

#### Images
- Use descriptive alt text for all images
- Optimize image file sizes (WebP format recommended)
- Include image sitemaps for better indexing

#### Performance
- Minimize HTTP requests
- Use CSS and JavaScript minification for production
- Implement lazy loading for images
- Add service workers for offline functionality

## 🚀 Deployment Options

### Static Hosting (Recommended)

#### 1. Netlify
1. Connect your repository to Netlify
2. Set build command: (none needed)
3. Set publish directory: `/`
4. Deploy!

#### 2. Vercel
1. Import project from Git repository
2. Framework: None / Other
3. Deploy!

#### 3. GitHub Pages
1. Push code to GitHub repository
2. Go to Settings → Pages
3. Select source branch (usually `main`)
4. Site will be available at `username.github.io/repository-name`

#### 4. Cloudflare Pages
1. Connect Git repository
2. Build command: (leave empty)
3. Build output directory: `/`

### Traditional Web Hosting

Upload all files to your web hosting provider's public directory (usually `public_html` or `www`).

### Content Management Integration

The website is designed to work with headless CMS solutions:
- **Contentful** - For listings and content management
- **Strapi** - Self-hosted CMS option
- **Sanity** - Real-time content management
- **Forestry** - Git-based CMS for static sites

## 🔧 Advanced Features

### Virtual Tour Integration

The site includes placeholders for 360° virtual tours:
```html
<!-- Ready for integration with: -->
<!-- Matterport, Kuula, or custom 360° viewers -->
<div id="virtual-tour-container"></div>
```

### Google Maps Integration

Add your Google Maps API key to enable interactive maps:
```javascript
// In listing-detail.js
const GOOGLE_MAPS_API_KEY = 'your-api-key-here';
```

### Analytics Setup

Add your tracking codes:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>

<!-- Facebook Pixel -->
<script>
  !function(f,b,e,v,n,t,s)
  // Facebook Pixel code
</script>
```

### Email Marketing Integration

The newsletter signup and contact forms are ready for integration with:
- **Mailchimp** - Popular email marketing platform
- **ConvertKit** - Creator-focused email marketing
- **ActiveCampaign** - Advanced automation
- **Custom API endpoints** - Your own email service

## 🧪 Testing

### Manual Testing Checklist

- [ ] All navigation links work correctly
- [ ] Contact forms validate and submit properly
- [ ] Search and filtering functions work
- [ ] Responsive design on multiple devices
- [ ] Dark/light mode toggle functions
- [ ] Image gallery navigation
- [ ] Social media sharing buttons
- [ ] Favorites functionality
- [ ] Financing calculator accuracy

### Automated Testing

For continuous integration, consider adding:
- **Lighthouse CI** - Performance and SEO testing
- **Pa11y** - Accessibility testing
- **HTML Validator** - Markup validation
- **CSS Validator** - Stylesheet validation

## 🔒 Security Considerations

- **Form Validation**: Client-side validation is implemented, but always validate on server-side
- **Content Security Policy**: Consider implementing CSP headers
- **HTTPS**: Always use HTTPS in production
- **Input Sanitization**: Sanitize all user inputs on the backend
- **Rate Limiting**: Implement rate limiting for form submissions

## 📊 Performance Optimization

### Production Checklist

- [ ] Minify CSS and JavaScript files
- [ ] Optimize images (use WebP format)
- [ ] Enable GZIP compression
- [ ] Set up proper caching headers
- [ ] Use a CDN for static assets
- [ ] Implement lazy loading for images
- [ ] Add preload hints for critical resources

### Lighthouse Score Goals
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 90+
- **SEO**: 95+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- 📧 Email: support@luxetinyhomes.com
- 📞 Phone: +1-555-TINY-HOME
- 💬 Live Chat: Available on the website

## 📝 Changelog

### Version 1.0.0 (2025-01-11)
- Initial release
- Full responsive design implementation
- SEO optimization and structured data
- Interactive features and animations
- Contact forms and lead generation
- Dark/light mode support
- Accessibility compliance

---

**Built with ❤️ for the tiny home community**

*This website represents the future of sustainable, mobile living and connects people with their dream homes.*