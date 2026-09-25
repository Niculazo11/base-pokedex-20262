export const POKEAPI = "https://pokeapi.co/api/v2";

// Pokémon TCG API (https://pokemontcg.io). Free, but rate-limited hard without a key.
// Get a key at https://dev.pokemontcg.io/ and put it in a .env file at the project root:
//   VITE_POKEMONTCG_API_KEY=your_key_here
// Vite only exposes env vars prefixed with VITE_ to client code, and it's fine for this
// to be public/visible in the bundle — it's a client-side rate-limit key, not a secret.
export const TCG_API = "https://api.pokemontcg.io/v2";
export const TCG_API_KEY = import.meta.env.VITE_POKEMONTCG_API_KEY || "";

// Shown whenever a TCG card image is missing or fails to load.
export const PLACEHOLDER_CARD_IMAGE = "/placeholder-card.png";

export const GENERATIONS = [
  { id: 1, ordinal: "1st" },
  { id: 2, ordinal: "2nd" },
  { id: 3, ordinal: "3rd" },
  { id: 4, ordinal: "4th" },
  { id: 5, ordinal: "5th" },
  { id: 6, ordinal: "6th" },
  { id: 7, ordinal: "7th" },
  { id: 8, ordinal: "8th" },
  { id: 9, ordinal: "9th" },
];

export const TYPE_COLORS = {
  normal: "#A8A77A", fire: "#EE8130", water: "#6390F0", electric: "#F7D02C",
  grass: "#7AC74C", ice: "#96D9D6", fighting: "#C22E28", poison: "#A33EA1",
  ground: "#E2BF65", flying: "#A98FF3", psychic: "#F95587", bug: "#A6B91A",
  rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC", dark: "#705746",
  steel: "#B7B7CE", fairy: "#D685AD",
};

export const COLORS = {
  red: "#FF4B3E",
  redDark: "#E13B34",
  teal: "#63D9D3",
  yellow: "#FFD43B",
  green: "#6FCF57",
  blue: "#4D9DE0",
  ink: "#1B1B1B",
  gray: "#8B8F94",
  page: "#FAFAF8",
};

export const HEADING_FONT = "'Baloo 2', sans-serif";
export const BODY_FONT = "'Nunito', sans-serif";
