# ErgoHome – Ergonomic Home Office Design Consultancy

A fully responsive, multi-page website for an ergonomic workspace consultancy. Built with semantic HTML5, CSS custom properties, and vanilla ES6+ JavaScript. No frameworks required.

---

## 📁 File Structure

```
home design/
├── index.html                 # Home page
├── sitemap.xml
├── robots.txt
├── assets/
│   ├── css/
│   │   ├── style.css          # Main styles + design tokens
│   │   ├── dark-mode.css      # Dark theme overrides
│   │   └── rtl.css            # RTL (Arabic/Hebrew) support
│   └── js/
│       ├── main.js            # Site-wide interactions
│       └── dashboard.js       # Client portal logic
└── pages/
    ├── about.html             # Company story, team, timeline
    ├── services.html          # Service offerings
    ├── blog.html              # Blog with sidebar
    ├── contact.html           # Contact form + map
    ├── booking.html           # 3-step booking flow
    ├── dashboard.html         # Full client portal
    ├── 404.html               # Custom error page
    └── coming-soon.html       # Pre-launch / maintenance page
```

---

## ✨ Features

| Feature | Details |
|---|---|
| **Dark / Light Mode** | System preference + manual toggle; persisted via localStorage |
| **RTL Support** | Full right-to-left layout for Arabic / Hebrew (`.rtl-toggle`) |
| **Accessibility** | Skip links, ARIA roles, semantic hierarchy, focus styles |
| **SEO** | Meta tags, Open Graph, JSON-LD structured data, sitemap |
| **Responsive** | Mobile-first; breakpoints: 640 × 1024 × 1280px |
| **Animations** | Scroll-reveal, counter animation, skeleton loaders |
| **Forms** | Inline validation, async submission, toast notifications |
| **Booking** | 3-step interactive calendar/time-picker with confirmation |
| **Client Portal** | Sidebar dashboard with Assessment quiz, 3D viewer, shopping list |

---

## 🚀 Getting Started

No build step required. Open any `.html` file directly in a browser, or serve with any static server:

```bash
# Option 1: Python
python -m http.server 3000

# Option 2: VS Code Live Server extension
# Right-click index.html → Open with Live Server

# Option 3: npx serve
npx serve .
```

---

## 🔌 Integrations (Placeholder Setup)

### Contact Form — Formspree
Replace `YOUR_FORM_ID` in `contact.html`:
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

### Newsletter — Mailchimp / ConvertKit
Update the `js-newsletter-form` submit handler in `main.js` (`NewsletterForm.init`).

### Google Maps
Replace the map placeholder in `contact.html` with:
```html
<iframe src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY" ...></iframe>
```

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary | `hsl(165, 85%, 32%)` – Teal green |
| Secondary | `hsl(220, 75%, 55%)` – Periwinkle blue |
| Font Display | Plus Jakarta Sans |
| Font Body | Inter |
| Spacing base | 8px (`--sp-1` = 4px, `--sp-2` = 8px …) |
| Border radius | `--radius-sm` to `--radius-2xl` |

All design tokens live in `assets/css/style.css` under `:root { … }`.

---

## ♿ Accessibility

- WCAG 2.1 AA compliant
- All interactive elements have `aria-label` or visible labels
- Keyboard-navigable (Tab, Enter, Space)
- `prefers-reduced-motion` respected in animations
- `prefers-color-scheme` used as default theme

---

## 📄 License

© 2025 ErgoHome. All rights reserved.
