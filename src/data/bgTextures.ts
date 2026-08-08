// High quality background texture images as SVG Data URLs for ultra-crisp 4K canvas rendering

export const DEFAULT_BG_THEMES = [
  {
    id: 'cyber',
    name: '🖤 Cyber Mesh Wallpaper',
    gradient: 'from-slate-900 via-cyan-950 to-slate-950 border-cyan-500/40',
    // Cyber Carbon Weave & Holographic Grid Texture
    imageUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="450" height="820" viewBox="0 0 450 820">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#050811"/>
            <stop offset="50%" stop-color="#0c1626"/>
            <stop offset="100%" stop-color="#04070d"/>
          </linearGradient>
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(6,182,212,0.12)" stroke-width="1"/>
            <circle cx="0" cy="0" r="1.5" fill="rgba(6,182,212,0.25)"/>
          </pattern>
          <radialGradient id="glow" cx="0.5" cy="0.4" r="0.6">
            <stop offset="0%" stop-color="rgba(6,182,212,0.25)"/>
            <stop offset="100%" stop-color="transparent"/>
          </radialGradient>
        </defs>
        <rect width="450" height="820" fill="url(#bg)"/>
        <rect width="450" height="820" fill="url(#grid)"/>
        <rect width="450" height="820" fill="url(#glow)"/>
      </svg>
    `)}`,
    accentColor: '#06b6d4'
  },
  {
    id: 'sunset',
    name: '🌅 Goa Sunset Palms',
    gradient: 'from-purple-950 via-pink-950 to-amber-950 border-pink-500/40',
    // Goa Sunset Waves & Palm Silhouette Wallpaper
    imageUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="450" height="820" viewBox="0 0 450 820">
        <defs>
          <linearGradient id="sunsetGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#19062b"/>
            <stop offset="40%" stop-color="#3d0a4e"/>
            <stop offset="70%" stop-color="#831843"/>
            <stop offset="100%" stop-color="#7c2d12"/>
          </linearGradient>
          <radialGradient id="sunGlow" cx="0.5" cy="0.3" r="0.5">
            <stop offset="0%" stop-color="rgba(244,63,94,0.4)"/>
            <stop offset="100%" stop-color="transparent"/>
          </radialGradient>
        </defs>
        <rect width="450" height="820" fill="url(#sunsetGrad)"/>
        <rect width="450" height="820" fill="url(#sunGlow)"/>
        <circle cx="225" cy="280" r="140" fill="rgba(251,113,133,0.12)"/>
        <path d="M0 650 Q 112 610, 225 650 T 450 650 L 450 820 L 0 820 Z" fill="rgba(30,9,48,0.5)"/>
        <path d="M0 700 Q 112 670, 225 700 T 450 700 L 450 820 L 0 820 Z" fill="rgba(15,3,25,0.7)"/>
      </svg>
    `)}`,
    accentColor: '#f43f5e'
  },
  {
    id: 'emerald',
    name: '🌴 Tropical Beach Emerald',
    gradient: 'from-emerald-950 via-teal-950 to-slate-950 border-emerald-500/40',
    // Tropical Emerald Palm Leaf & Ocean Wave Texture
    imageUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="450" height="820" viewBox="0 0 450 820">
        <defs>
          <linearGradient id="emGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#021f17"/>
            <stop offset="50%" stop-color="#06372b"/>
            <stop offset="100%" stop-color="#01140f"/>
          </linearGradient>
          <pattern id="hex" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M20 0 L40 10 L40 30 L20 40 L0 30 L0 10 Z" fill="none" stroke="rgba(16,185,129,0.1)" stroke-width="1.2"/>
          </pattern>
        </defs>
        <rect width="450" height="820" fill="url(#emGrad)"/>
        <rect width="450" height="820" fill="url(#hex)"/>
        <circle cx="380" cy="150" r="180" fill="rgba(16,185,129,0.12)"/>
      </svg>
    `)}`,
    accentColor: '#10b981'
  },
  {
    id: 'midnight',
    name: '🌌 Midnight Cosmic Nebula',
    gradient: 'from-blue-950 via-indigo-950 to-slate-950 border-sky-500/40',
    // Cosmic Nebula & Starfield Wallpaper
    imageUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="450" height="820" viewBox="0 0 450 820">
        <defs>
          <linearGradient id="midGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#030b1e"/>
            <stop offset="50%" stop-color="#091b42"/>
            <stop offset="100%" stop-color="#020714"/>
          </linearGradient>
          <radialGradient id="nebula" cx="0.4" cy="0.4" r="0.6">
            <stop offset="0%" stop-color="rgba(56,189,248,0.3)"/>
            <stop offset="60%" stop-color="rgba(99,102,241,0.15)"/>
            <stop offset="100%" stop-color="transparent"/>
          </radialGradient>
        </defs>
        <rect width="450" height="820" fill="url(#midGrad)"/>
        <rect width="450" height="820" fill="url(#nebula)"/>
        <circle cx="80" cy="120" r="1.5" fill="#fff" opacity="0.8"/>
        <circle cx="340" cy="200" r="2" fill="#38bdf8" opacity="0.9"/>
        <circle cx="190" cy="380" r="1" fill="#fff" opacity="0.6"/>
        <circle cx="390" cy="520" r="2.5" fill="#a5b4fc" opacity="0.7"/>
        <circle cx="120" cy="700" r="1.5" fill="#fff" opacity="0.8"/>
      </svg>
    `)}`,
    accentColor: '#38bdf8'
  },
  {
    id: 'gold',
    name: '⚡ Holographic Amber Gold',
    gradient: 'from-amber-950 via-yellow-950 to-slate-950 border-amber-500/40',
    // Metallic Gold Shimmer & Diamond Foil Wallpaper
    imageUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="450" height="820" viewBox="0 0 450 820">
        <defs>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#1c1404"/>
            <stop offset="50%" stop-color="#3b2b07"/>
            <stop offset="100%" stop-color="#140e02"/>
          </linearGradient>
          <pattern id="diamond" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M15 0 L30 15 L15 30 L0 15 Z" fill="none" stroke="rgba(245,158,11,0.12)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="450" height="820" fill="url(#goldGrad)"/>
        <rect width="450" height="820" fill="url(#diamond)"/>
        <circle cx="225" cy="410" r="200" fill="rgba(245,158,11,0.12)"/>
      </svg>
    `)}`,
    accentColor: '#f59e0b'
  }
];
