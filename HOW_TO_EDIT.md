# Joldhara Properties Limited - Website Documentation & Editing Guide

This package contains the **complete source code, styling, interactive scripts, and high-resolution assets** for the official **Joldhara Properties Limited** website ([joldharapropertiesltd.com](https://www.joldharapropertiesltd.com/)).

---

## 📁 Package Structure

```
joldhara-properties/
├── index.html                 # 🌟 Standalone static version (Double-click to open in any browser!)
├── public/                    # 🖼️ All original images, logos, and favicon
│   ├── logo5.png              # Official company logo
│   ├── hero1.jpg - hero5.jpg  # 5 Fullscreen hero carousel pictures
│   ├── alhamdulillah.jpg      # Featured project showcase image
│   └── favicon.ico            # Site browser icon
├── data/
│   └── siteData.json          # ⚙️ Central configuration file for all website content
├── app/                       # ⚛️ Next.js 14+ App Router codebase
│   ├── layout.jsx             # Root layout with Lato font & metadata
│   ├── page.jsx               # Main React landing page with parallax & animations
│   └── globals.css            # Custom CSS keyframes and Tailwind directives
├── package.json               # Next.js dependencies and build scripts
├── next.config.mjs            # Next.js configuration
├── tailwind.config.js         # Tailwind theme & brand color definitions
├── postcss.config.js          # PostCSS configuration
├── HOW_TO_EDIT.md             # This comprehensive editing manual
└── README.md                  # Quick start guide
```

---

## 🛠️ How the Website Is Created

The website is engineered with a modern, responsive architectural stack:
1. **Frontend Framework**: Next.js (React) App Router with server-side metadata and client-side interactive hooks (`useScrollParallax`, `useIntersectionObserver`).
2. **Styling & Design System**: Tailwind CSS with custom branding (`#9acd32` signature lime-green accent, deep dark luxury `#1a1a1a` backgrounds, and modern Lato typography).
3. **Hero Parallax Carousel**: Smooth cross-fade auto-rotating slider (5 images) with dynamic parallax scroll effects (`translateY(0.4 * scrollY) scale(1 + 0.0001 * scrollY)`) and custom scroll-fade opacity.
4. **Mobile Navigation Drawer**: Off-canvas sliding drawer menu with backdrop blur and smooth cubic-bezier transitions.
5. **Project Gallery**: Responsive grid with card zoom (`group-hover:scale-110`), dark gradient overlay hover reveals, and an interactive project modal.
6. **Ambient Animated Glow**: Floating blurred glowing orbs that subtly track scroll motion.
7. **Floating WhatsApp Integration**: Fixed quick-chat button linking directly to customer service on WhatsApp.

---

## ✏️ How to Edit the Website

You have **two easy ways** to edit and customize this website:

### Option 1: Edit via `data/siteData.json` (Recommended for Next.js)

All text, contact details, statistics, and project listings are organized inside [`data/siteData.json`](file:///C:/Users/HP/.gemini/antigravity/scratch/joldhara-properties/data/siteData.json). You do not need to modify React code to change the content!

#### 1. Changing Company & Contact Details:
Open `data/siteData.json` and edit:
```json
"company": {
  "name": "Joldhara Properties Ltd.",
  "phone": "+8801819638013",
  "email": "joldharapropertiesltd@gmail.com",
  "whatsapp": "+8801819638013",
  "dhakaOffice": "House-08, Road-04, Banani DOHS, Dhaka",
  "chittagongOffice": "805/D Goni Complex, CDA Avenue, Chittagong",
  "directionsUrl": "https://maps.google.com/?q=House-08,+Road-04,+Banani+DOHS"
}
```

#### 2. Changing Statistics / Counters:
In `data/siteData.json`:
```json
"stats": [
  { "value": "25+", "label": "Years Experience" },
  { "value": "150+", "label": "Projects Completed" },
  { "value": "5000+", "label": "Happy Clients" },
  { "value": "50+", "label": "Awards Won" }
]
```

#### 3. Adding or Editing Projects:
In `data/siteData.json`, add as many projects as you want to the `projects` array:
```json
{
  "id": "new-project",
  "title": "JOLDHARA OASIS",
  "description": "Exclusive duplex apartments with modern amenities located in Gulshan.",
  "src": "/hero1.jpg",
  "location": "Gulshan 2, Dhaka",
  "category": "Residential",
  "size": "3,400 SFT",
  "status": "Upcoming"
}
```

#### 4. Replacing Images & Logo:
To replace pictures, simply place your new image files inside the [`public/`](file:///C:/Users/HP/.gemini/antigravity/scratch/joldhara-properties/public/) folder:
- **Logo**: Replace `public/logo5.png` with your new logo (recommended transparent PNG, 400x120px).
- **Hero Carousel**: Replace `public/hero1.jpg` through `public/hero5.jpg` (recommended 1920x1080px or higher JPG).
- **Projects**: Put project photos in `public/` and update the `src` path in `siteData.json`.

---

### Option 2: Edit the Standalone Static `index.html`

If you don't use Node.js or npm, you can open [`index.html`](file:///C:/Users/HP/.gemini/antigravity/scratch/joldhara-properties/index.html) in any text editor (like Notepad, Sublime Text, or VS Code):

- **Change phone numbers**: Search for `+8801819638013` and replace with your number.
- **Change email**: Search for `joldharapropertiesltd@gmail.com` and replace with your email.
- **Change office address**: Search for `House-08, Road-04, Banani DOHS` and replace with your address.
- **Change headlines**: Search for `Building Tomorrow's Landmarks` to change the main hero title.
- **Change brand color**: The website's signature lime green is `#9acd32`. You can search and replace `#9acd32` with your brand hex code (e.g., `#2563eb` for blue or `#d97706` for gold).

---

## 🚀 How to Run and Deploy

### Method 1: Immediate Browser Preview (Zero Installation)
Double-click `index.html` in your file explorer. It will open immediately in Chrome, Edge, Safari, or Firefox with full styling, carousel transitions, and responsive behavior!

### Method 2: Running with Next.js (Local Development)
1. Ensure [Node.js](https://nodejs.org) is installed on your computer.
2. Open terminal in the project directory:
   ```bash
   cd joldhara-properties
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Method 3: Deploying to the Web

- **Vercel (Recommended for Next.js)**:
  1. Push the folder to GitHub.
  2. Go to [vercel.com](https://vercel.com) and import the repository.
  3. Vercel will automatically detect Next.js and deploy it with a single click.

- **Netlify / GitHub Pages / cPanel / Shared Hosting (Using `index.html`)**:
  Upload `index.html` and the `public/` folder directly to your `public_html` directory via cPanel File Manager or FTP. It runs instantly on any server without Node.js requirements!
