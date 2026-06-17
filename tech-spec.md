# NOBEL WEAR — Technical Specification

## Dependencies

No external runtime dependencies. The entire application is contained in a single HTML file with inline CSS and JavaScript. The following CDN resources are loaded via `<link>` and `<script>` tags:

- Google Fonts (Cormorant Garamond 300/400/600/700 + italic, Jost 200/300/400/500/600)
- Font Awesome 6 (icons for cart, heart, menu, search, social media)
- Firebase SDK (optional — commented placeholder, app works offline with localStorage)

## Component Inventory

Given the single-file architecture constraint, components are implemented as JavaScript functions that generate and inject HTML into the DOM, rather than React components. The following UI modules are identified:

### Core Modules

| Module | Purpose | Key Functions |
|--------|---------|---------------|
| LoadingScreen | 3D cube loader + progress bar, fades out after 800ms | `showLoader()`, `hideLoader()` |
| ParticleSystem | Canvas-based rising ember particles for hero | `initParticles()`, `animateParticles()` |
| Navbar | Fixed nav with search, cart, wishlist, menu buttons | `renderNavbar()`, `handleScrollShrink()` |
| HeroSection | Full-viewport hero with particles, shapes, content, stats | `renderHero()`, `animateHeroEntrance()` |
| MarqueeStrip | Infinite scrolling gold gradient text strip | `renderMarquee()`, `initMarqueeAnimation()` |
| CollectionsSection | Two morphing collection cards (Men's/Women's) | `renderCollections()`, `initMorphingCards()` |
| ShapeDivider | SVG scroll-driven morph between sections | `renderShapeDivider()`, `initShapeMorph()` |
| QuickCategories | 4 category cards with hover effects | `renderQuickCategories()` |
| BestSellersCarousel | Horizontal scrolling product carousel with arrows | `renderBestSellers()`, `initCarousel()` |
| TrustBadgesSection | 4 trust cards (delivery, COD, stitching, support) | `renderTrustBadges()` |
| ReviewsSection | Customer review cards with glass-morphism | `renderReviews()` |
| FooterSection | Full footer with 4 columns, brand story | `renderFooter()` |
| WhatsAppButton | Fixed floating WhatsApp button | `renderWhatsAppButton()` |

### Overlay & Modal Modules

| Module | Purpose | Key Functions |
|--------|---------|---------------|
| ProductDetailOverlay | Full-screen product detail from right | `openProductDetail()`, `closeProductDetail()` |
| CartPanel | Right slide-in cart drawer | `openCart()`, `closeCart()`, `renderCartItems()` |
| WishlistPanel | Right slide-in wishlist drawer | `openWishlist()`, `closeWishlist()` |
| MenuPanel | Left slide-in navigation menu | `openMenu()`, `closeMenu()` |
| OrderModal | Centered order form modal | `openOrderModal()`, `submitOrder()` |
| ReviewModal | Compact review submission modal | `openReviewModal()`, `submitReview()` |
| Lightbox | Full-screen image gallery with keyboard nav | `openLightbox()`, `navigateLightbox()` |
| AdminPanel | Full-screen admin dashboard with login | `openAdminPanel()`, `renderAdminView()` |

### Data & State Management

| Module | Purpose | Key Functions |
|--------|---------|---------------|
| Store | Central state management (products, cart, wishlist, orders, reviews) | `getProducts()`, `addToCart()`, `toggleWishlist()`, `placeOrder()`, `addReview()`, `addProduct()` |
| localStorageManager | Persist/retrieve all data from localStorage | `saveToStorage()`, `loadFromStorage()` |
| SearchEngine | Real-time product filtering | `searchProducts(query)` |

## Animation Implementation

| Animation | Library / Approach | Implementation | Complexity |
|-----------|-------------------|----------------|------------|
| 3D Rotating Cube (Loader) | CSS keyframes | `@keyframes rotateCube` with `rotateX`/`rotateY` on 6 face divs using `transform-style: preserve-3d` | Medium |
| Rising Ember Particles | Canvas 2D + requestAnimationFrame | Custom particle class, radial gradient drawing, `globalCompositeOperation: 'screen'`, vignette overlay | High |
| Floating 3D Wireframe Shapes | CSS 3D transforms + keyframes | Icosahedron/hex prism/torus built from border-based divs with `preserve-3d`, continuous rotation keyframes | High |
| Hero Content Entrance | CSS keyframes + staggered delays | `@keyframes fadeInUp` with `animation-delay` increments (0.3s–1.3s) | Low |
| Navbar Scroll Shrink | CSS transition + JS scroll listener | `scroll` event toggles `.scrolled` class, CSS handles height/content transitions | Low |
| Infinite Marquee | CSS keyframes | Two duplicate content rows, `translateX(0) → translateX(-50%)` over 25s linear infinite | Low |
| Collection Card Morph | GSAP + ScrollTrigger | `clipPath: circle()` tween from 20% to 150%, simultaneous `scale` tween on background image | High |
| Collection Card 3D Tilt | JS mousemove + CSS transforms | Calculate tilt from mouse position, apply `perspective(1000px) rotateX/Y`, reset on mouseleave | Medium |
| SVG Shape Morph Dividers | GSAP + ScrollTrigger | `ScrollTrigger.scrub` tweens SVG path `d` attribute between intro/final states | Medium |
| Section Scroll Reveal | IntersectionObserver + CSS | Observer at threshold 0.15 toggles `.visible` class triggering `opacity`/`transform` transition | Low |
| Card Hover Effects | CSS transitions | `translateY`, `box-shadow`, `scale` transitions with `cubic-bezier(0.16, 1, 0.3, 1)` | Low |
| Panel Slide-In | CSS transitions | `translateX(100%) → translateX(0)` with `cubic-bezier(0.16, 1, 0.3, 1)` over 0.4s | Low |
| Modal Pop | CSS keyframes | `scale(0.92) → scale(1)` with `translateY(20px) → translateY(0)` | Low |
| Carousel Scroll | CSS scroll-snap + JS | `scroll-snap-type: x mandatory`, JS handles arrow button smooth scroll | Medium |
| Order Success Checkmark | CSS keyframes | SVG circle stroke-dashoffset draw + checkmark path animation | Medium |
| Button Hover Effects | CSS transitions | `translateY(-3px)`, `scale(1.02)`, expanded shadow | Low |

## State & Logic Plan

### Data Architecture

The application uses a centralized Store pattern (plain JS object, not Redux) with reactive UI updates. All data mutations flow through Store methods which persist to localStorage.

**State Shape:**
```
store = {
  products: [...],       // 8 default products + admin-added
  cart: [{id, qty}],     // array of {productId, quantity}
  wishlist: [id],        // array of productIds
  orders: [...],         // placed orders
  reviews: [...],        // submitted reviews
  adminLoggedIn: false,  // boolean
  firebaseConfigured: false
}
```

### Key Logic Patterns

1. **Product CRUD:** All product operations (add, edit, delete, toggle best-seller) go through `store.addProduct()`, `store.updateProduct()`, `store.deleteProduct()`. These update localStorage and attempt Firebase sync.

2. **Cart Operations:** `store.addToCart(productId)` increments quantity if exists, appends if new. `store.removeFromCart(productId)` removes item. `store.updateQuantity(productId, qty)` sets specific quantity. Cart badge count = sum of all quantities.

3. **Order Placement Flow:** User clicks "Order Now" → OrderModal opens with product pre-filled → user selects stitched/unstitched (affects price) → fills form → on submit: validate inputs → decrement product stock → save order → show success animation → close modal after 2s.

4. **Search:** Real-time filtering using `input` event listener. Search query is lowercased and matched against product title, category, and fabric fields. Results replace the visible product grid. Empty query restores all products.

5. **Admin Authentication:** Simple credential check (username === 'abdullah' && password === 'nobel01'). On success, set `store.adminLoggedIn = true` and persist session to localStorage. Admin panel renders different views based on active nav item (dashboard, orders, products, etc.).

6. **Image Handling:** FileReader API converts uploaded images to base64 data URLs for immediate preview and localStorage persistence. Admin can upload up to 10 images per product.

7. **Responsive Carousel:** Cards per row determined by viewport width on resize. CSS grid `auto-columns` set to `calc(25% - 18px)` (desktop), `calc(33.33% - 16px)` (tablet), etc. Arrow buttons scroll by one card width.

## Other Key Decisions

### Single-File Architecture

The entire application — HTML structure, CSS styles (within `<style>`), JavaScript logic (within `<script type="module">`) — is delivered as one `.html` file. This is an explicit requirement. CSS uses custom properties for the color palette. JavaScript uses ES6 module pattern within the script tag (import/export between `<script>` blocks is not needed since everything is in one file scope).

### Canvas Performance

The particle system uses `requestAnimationFrame` and pauses when the hero section is not visible (IntersectionObserver on hero container). Particles are simple objects in a flat array, not a class-based system, to minimize overhead. The vignette is drawn once per frame as a full-canvas radial gradient after all particles.

### GSAP for Complex Animations

GSAP + ScrollTrigger (loaded via CDN) handles the collection card morphing and SVG shape morphs — these require scroll-scrubbed precision that CSS alone cannot achieve. All other animations use CSS keyframes/transitions for performance.

### No Build Step

No bundler, no transpilation. The file is served as static HTML. All modern browser features (CSS custom properties, ES6+, IntersectionObserver, FileReader) are assumed. The target is evergreen browsers (Chrome, Firefox, Safari, Edge).

### Firebase as Optional Enhancement

Firebase SDK is included via CDN but initialized only if a config is provided. All CRUD operations work via localStorage immediately. If Firebase is configured, data syncs to the cloud and becomes available across devices. A sync status indicator shows online/offline state.
