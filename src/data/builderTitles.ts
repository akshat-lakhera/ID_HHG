export const BUILDER_TITLES = [
  "Cyber Palms Architect",
  "Solana Wave Rider",
  "ZK-Goa Spellcaster",
  "AI Prompt Warlock",
  "DeFi Sunset Crusader",
  "Rust Core Titan",
  "Fullstack Beach Ninja",
  "Byte Code Nomad",
  "Smart Contract Shaman",
  "L2 Velocity Hacker",
  "Crypto Coastal Pioneer",
  "Web3 Kernel Alchemist",
  "Autonomous Agent Master",
  "Zero-Knowledge Artisan"
];

export const SAMPLE_AVATARS = [
  {
    name: "AKSHAT LAKHERA",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    role: "RESIDENT",
    team: "TEAM DOOM",
  },
  {
    name: "Rohan Sharma",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    role: "CORE BUILDER",
    team: "TEAM SOLANA",
  },
  {
    name: "Maya Lin",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    role: "UI ARCHITECT",
    team: "TEAM ZK",
  },
  {
    name: "Devon Vance",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    role: "AI SPECIALIST",
    team: "TEAM AUTONOMOUS",
  }
];

export const CARD_THEMES = [
  {
    id: 'cyber',
    name: 'Cyber PCB (Default)',
    gradient: 'from-slate-900 via-slate-950 to-slate-900 border-cyan-500/40',
  },
  {
    id: 'sunset',
    name: 'Goa Neon Sunset',
    gradient: 'from-purple-950 via-pink-950 to-slate-950 border-pink-500/40',
  },
  {
    id: 'emerald',
    name: 'Tropical Emerald',
    gradient: 'from-emerald-950 via-teal-950 to-slate-950 border-emerald-500/40',
  },
  {
    id: 'midnight',
    name: 'Midnight Protocol',
    gradient: 'from-blue-950 via-indigo-950 to-slate-950 border-sky-500/40',
  },
  {
    id: 'gold',
    name: 'Holographic Gold',
    gradient: 'from-amber-950 via-yellow-950 to-slate-950 border-amber-500/40',
  }
];

export const getRandomTitle = () => {
  return BUILDER_TITLES[Math.floor(Math.random() * BUILDER_TITLES.length)];
};

export const generateBadgeId = () => {
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `HHG-${randNum}-X`;
};
