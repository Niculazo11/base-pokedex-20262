import { TCG_API, TCG_API_KEY } from "../constants";
import { sanitizePokemonName } from "../utils";

const cache = {
  list: {},
  card: {},
};

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: {
      // pokemontcg.io works without a key at very low volume, but will 429 quickly.
      // Only send the header when a key is actually configured.
      ...(TCG_API_KEY ? { "X-Api-Key": TCG_API_KEY } : {}),
    },
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

/** Normalizes a raw pokemontcg.io card into the shape the UI components expect. */
function normalizeCard(card) {
  return {
    id: card.id,
    name: card.name,
    image: card.images?.large || card.images?.small || null,
    pricing: {
      cardmarket: card.cardmarket?.prices
        ? { avg: card.cardmarket.prices.averageSellPrice }
        : undefined,
      tcgplayer: card.tcgplayer?.prices
        ? {
            normal: card.tcgplayer.prices.normal
              ? { marketPrice: card.tcgplayer.prices.normal.market }
              : undefined,
            holofoil: card.tcgplayer.prices.holofoil
              ? { marketPrice: card.tcgplayer.prices.holofoil.market }
              : undefined,
          }
        : undefined,
    },
    // Direct storefront links the TCG API gives us for this print, when it has them.
    links: {
      tcgplayer: card.tcgplayer?.url || undefined,
      cardmarket: card.cardmarket?.url || undefined,
    },
  };
}

/** Card briefs (id, name, image) matching a Pokémon name, exact-match on the sanitized species name. */
export async function getTcgCardsForPokemon(rawName) {
  const key = rawName.toLowerCase();
  if (cache.list[key]) return cache.list[key];

  const pokemonName = sanitizePokemonName(rawName);
  const url = `${TCG_API}/cards?q=${encodeURIComponent(`name:"${pokemonName}"`)}&pageSize=16`;
  const data = await fetchJson(url);
  const list = (data.data || []).map(normalizeCard);

  cache.list[key] = list;
  return list;
}

/** Full card detail, including pricing.cardmarket / pricing.tcgplayer. */
export async function getTcgCardDetail(id) {
  if (cache.card[id]) return cache.card[id];
  const data = await fetchJson(`${TCG_API}/cards/${id}`);
  const full = normalizeCard(data.data);
  cache.card[id] = full;
  return full;
}
