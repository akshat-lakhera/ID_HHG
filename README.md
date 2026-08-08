# 🌴 Hacker House Goa 2026 — 3D Lanyard Pass & PFP Generator

An interactive, high-performance Web application built for **Hacker House Goa 2026** attendees to generate, customize, download, and share their official event passes, custom card wallpapers, profile picture frames, and 3D spring lanyard badges.

![Hacker House Goa 2026 Banner](https://img.shields.br/badge/Hacker%20House-Goa%202026-cyan?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-8.2-purple?style=for-the-badge&logo=vite)
![Three.js](https://img.shields.io/badge/Three.js-R3F-black?style=for-the-badge&logo=three.js)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-blue?style=for-the-badge&logo=tailwindcss)

---

## ✨ Features

### 🎴 2D HD Render Engine & Dual View
- **Front & Back Side Card Rendering**: Generates official Hacker House Goa authorization passes with attendee name, role, team badge ID, scannable front QR code, and back side terms & conditions.
- **Dual Side-by-Side HD View**: View front and back sides simultaneously.
- **Circular Profile Picture Overlay**: Format A circular profile picture overlay for social media avatars.

### 🎨 Custom Background Wallpaper Uploader
- Upload any custom background image or wallpaper for your card.
- Sleek dark cyber default theme with smooth ambient radial glow.

### 📷 Advanced Photo Position & Filters
- Drag, scale, offset, and rotate photo uploads.
- Built-in color grading filters: **Default**, **Vivid Contrast**, **Cyberpunk**, **Vintage Sepia**, and **Monochrome B&W**.
- Automatic HEIC iPhone photo format conversion.

### 🧵 Interactive 3D Spring & Pendulum Lanyard Physics
- Powered by `@react-three/fiber` & `Three.js`.
- Harmonic spring physics engine ($\vec{F} = -k\vec{x} - c\vec{v}$) with a Catmull-Rom curved lanyard ribbon glued to the top carabiner clip.
- Drag the card anywhere in 3D space and release to watch it swing back to equilibrium with dynamic pendulum damping.

### 📤 Dual-Side High-Res Downloads & One-Click X Share
- **Download Both PNGs**: One-click download for both `FRONT` and `BACK` side high-resolution PNG images.
- **Direct X (Twitter) Sharing**: Directly opens `x.com` prefilled with `@247pmstudio` tag and official hashtags `#HackerHouseGoa #FrameInGoa #HHGoa2026`.
- **Automatic Clipboard Copy**: Copies high-res PNG blob to clipboard so you can press `Ctrl + V` inside X composer.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- `npm` or `yarn`

### Installation & Local Setup

```bash
# Clone repository
git clone https://github.com/akshat-lakhera/ID_HHG.git
cd ID_HHG

# Install dependencies
npm install

# Start local dev server (locked to strict port 5173)
npm run dev
```

Open your browser at `http://localhost:5173/` to view the app live!

### Production Build

```bash
# Typecheck & build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **3D Engine**: [Three.js](https://threejs.org/) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) + [@react-three/drei](https://github.com/pmndrs/drei)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) + Lucide Icons
- **Image Processing**: HTML5 2D Canvas API + [heic2any](https://github.com/alexcorvi/heic2any)
- **Physics**: Real-time Damped Harmonic Oscillator & Catmull-Rom Ribbon Spline

---

## 🏷️ Social Tagging & Official Handles

- **Official X Handle**: [@247pmstudio](https://x.com/247pmstudio)
- **Official Hashtags**: `#HackerHouseGoa` `#FrameInGoa` `#HHGoa2026`

---

## 📜 License

Created for **Hacker House Goa 2026**. Open source under the MIT License.
