// A simple deterministic hash function
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    let chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Seeded random number between min and max
const seededRandom = (seed, min, max) => {
  const x = Math.sin(seed++) * 10000;
  const rand = x - Math.floor(x);
  return Math.floor(rand * (max - min + 1)) + min;
};

export const generateRPGStats = (contributor) => {
  const login = contributor.login || 'Unknown';
  const type = contributor.type || 'User';
  const commits = contributor.contributions || 0;
  
  const seed = hashCode(login);

  // 1. Determine Class based on type and commit count
  let rpgClass = "The Wanderer";
  let rarity = "Common";
  let color = "var(--text-muted)";

  if (type === 'Bot') {
    rpgClass = "The Automaton";
    rarity = "Rare";
    color = "var(--purple)";
  } else {
    if (commits > 500) {
      rpgClass = "The Grand Architect";
      rarity = "Legendary";
      color = "var(--amber)";
    } else if (commits > 100) {
      rpgClass = "The Archmage";
      rarity = "Epic";
      color = "var(--pink)";
    } else if (commits > 50) {
      rpgClass = "The Spellblade";
      rarity = "Rare";
      color = "var(--accent)";
    } else if (commits > 15) {
      rpgClass = "The Ranger";
      rarity = "Uncommon";
      color = "var(--green)";
    } else {
      rpgClass = "The Scout";
      rarity = "Common";
      color = "var(--text-secondary)";
    }
  }

  // 2. Determine stats deterministically using the seed and commit counts
  // Base stats influenced by commit count, but varied by their username hash
  const baseLevel = Math.min(99, Math.max(1, Math.floor(Math.sqrt(commits) * 3)));
  
  const strength = seededRandom(seed, 30, 99);
  const intelligence = seededRandom(seed + 1, 30, 99);
  const speed = seededRandom(seed + 2, 30, 99);
  
  // Magic element affinity
  const elements = ['Fire', 'Ice', 'Void', 'Lightning', 'Earth'];
  const element = elements[seed % elements.length];

  return {
    rpgClass,
    rarity,
    color,
    level: baseLevel,
    stats: {
      STR: strength,
      INT: intelligence,
      SPD: speed
    },
    element
  };
};
