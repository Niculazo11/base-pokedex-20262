export function pokeImage(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function idFromUrl(url) {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

export function titleCase(s) {
  return String(s).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatPrice(n, currency) {
  if (n === undefined || n === null || isNaN(n)) return null;
  const symbol = currency === "EUR" ? "€" : "$";
  return `${symbol}${Number(n).toFixed(2)}`;
}

/**
 * Resolves where the "buy" button on a TCG card should point to.
 * Priority: a direct tcgplayer.url from the API, then a direct cardmarket.url,
 * then a dynamically-built TCGPlayer search as a last resort so the button
 * still works even when the API didn't return a storefront link for this print.
 * Returns null only when we don't even have a card name to search with.
 */
export function getCardPurchaseLink(card) {
  if (!card) return null;

  if (card.links?.tcgplayer) {
    return { url: card.links.tcgplayer, label: "Comprar carta", isFallback: false };
  }
  if (card.links?.cardmarket) {
    return { url: card.links.cardmarket, label: "Comprar carta", isFallback: false };
  }
  if (card.name) {
    return {
      url: `https://www.tcgplayer.com/search/pokemon/product?q=${encodeURIComponent(card.name)}`,
      label: "Buscar en TCGPlayer",
      isFallback: true,
    };
  }
  return null;
}

/**
 * Suffixes PokéAPI appends to regional/special forms that the TCG API
 * doesn't know about (it only indexes the "base" Pokémon name).
 * Longest/most-specific patterns first so partial matches don't shadow them.
 */
const FORM_SUFFIXES = [
  "-alola", "-alolan", "-galar", "-galarian", "-hisui", "-hisuian",
  "-paldea", "-paldean", "-mega-x", "-mega-y", "-mega", "-gmax", "-gigantamax",
  "-totem", "-primal", "-origin", "-therian", "-incarnate", "-crowned",
  "-eternamax", "-blade", "-shield", "-hero", "-zen", "-ash", "-school",
  "-solo", "-complete", "-female", "-male", "-standard",
];

/**
 * Cleans a PokéAPI-style name (e.g. "raichu-alola", "charizard-mega-x")
 * so it can be safely used as a search term against the Pokémon TCG API,
 * which indexes cards by the Pokémon's base species name.
 */
export function sanitizePokemonName(name) {
  if (!name) return "";
  let clean = String(name).toLowerCase().trim();

  for (const suffix of FORM_SUFFIXES) {
    if (clean.endsWith(suffix)) {
      clean = clean.slice(0, -suffix.length);
      break;
    }
  }

  // Drop anything after a leftover dash (unhandled forms, e.g. "-normal", "-10")
  // but keep multi-word names that are legitimately hyphenated (e.g. "ho-oh", "porygon-z").
  const KNOWN_HYPHENATED = ["ho-oh", "porygon-z", "jangmo-o", "hakamo-o", "kommo-o", "type-null"];
  if (!KNOWN_HYPHENATED.includes(clean) && clean.includes("-")) {
    clean = clean.split("-")[0];
  }

  // Strip anything that isn't a letter, space or apostrophe (accents, numbers, symbols).
  clean = clean.replace(/[^a-z' ]/g, " ").replace(/\s+/g, " ").trim();

  return titleCase(clean);
}
