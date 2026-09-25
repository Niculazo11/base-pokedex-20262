import { POKEAPI } from "../constants";
import { idFromUrl } from "../utils";

const cache = {
  allList: null,
  generation: {},
  types: {},
  pokemon: {},
};

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

/** Full name+id list, used for the global search autocomplete. One request, cached. */
export async function getAllPokemonList() {
  if (cache.allList) return cache.allList;
  const data = await fetchJson(`${POKEAPI}/pokemon?limit=2000`);
  const list = data.results.map((p) => ({ name: p.name, id: Number(idFromUrl(p.url)) }));
  cache.allList = list;
  return list;
}

/** Species belonging to a generation (id + name), sorted by national dex id. */
export async function getGenerationSpecies(genId) {
  if (cache.generation[genId]) return cache.generation[genId];
  const data = await fetchJson(`${POKEAPI}/generation/${genId}`);
  const list = data.pokemon_species
    .map((s) => ({ name: s.name, id: Number(idFromUrl(s.url)) }))
    .sort((a, b) => a.id - b.id);
  cache.generation[genId] = list;
  return list;
}

/** List of pokemon names belonging to a given type, used for the type filter. */
export async function getTypePokemon(type) {
  if (cache.types[type]) return cache.types[type];
  const data = await fetchJson(`${POKEAPI}/type/${type}`);
  const list = data.pokemon.map((p) => p.pokemon.name);
  cache.types[type] = list;
  return list;
}

/** Full pokemon detail (profile, types, stats, sprites) by name or id. */
export async function getPokemonDetail(nameOrId) {
  const key = String(nameOrId).toLowerCase();
  if (cache.pokemon[key]) return cache.pokemon[key];
  const data = await fetchJson(`${POKEAPI}/pokemon/${key}`);
  cache.pokemon[key] = data;
  return data;
}
