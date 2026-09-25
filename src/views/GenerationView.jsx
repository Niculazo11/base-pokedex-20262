import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams } from "react-router-dom";
import { COLORS, HEADING_FONT, BODY_FONT, GENERATIONS, TYPE_COLORS } from "../constants";
import { titleCase } from "../utils";
import { getGenerationSpecies, getTypePokemon } from "../services/pokeapi";
import SearchBar from "../components/SearchBar";
import PokemonCard from "../components/PokemonCard";
import PokemonCardSkeleton from "../components/skeletons/PokemonCardSkeleton";

export default function GenerationView({ onBack, onSelectPokemon }) {
  const { id } = useParams();
  const genId = Number(id);
  const gen = GENERATIONS.find((g) => g.id === genId);
  const [species, setSpecies] = useState(null);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [typeMembers, setTypeMembers] = useState(null);
  const [typeLoading, setTypeLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(24);

  useEffect(() => {
    let alive = true;
    setSpecies(null); setError(null); setVisibleCount(24); setQuery(""); setTypeFilter(""); setTypeMembers(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    getGenerationSpecies(genId)
      .then((list) => alive && setSpecies(list))
      .catch((e) => alive && setError(e.message));
    return () => { alive = false; };
  }, [genId]);

  useEffect(() => {
    if (!typeFilter) { setTypeMembers(null); return; }
    let alive = true;
    setTypeLoading(true);
    getTypePokemon(typeFilter)
      .then((list) => { if (alive) { setTypeMembers(new Set(list)); setTypeLoading(false); } })
      .catch(() => alive && setTypeLoading(false));
    return () => { alive = false; };
  }, [typeFilter]);

  const filtered = useMemo(() => {
    if (!species) return [];
    let list = species;
    if (query.trim()) list = list.filter((p) => p.name.includes(query.trim().toLowerCase()));
    if (typeFilter && typeMembers) list = list.filter((p) => typeMembers.has(p.name));
    return list;
  }, [species, query, typeFilter, typeMembers]);

  const isLoadingGrid = !species || (typeFilter && typeLoading);

  if (!gen) {
    return (
      <div className="px-4 sm:px-8 py-6 sm:py-10 max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center mb-6"
          style={{ border: `2px solid ${COLORS.ink}` }}
          aria-label="Back to home"
        >
          <ArrowLeft size={18} color={COLORS.ink} />
        </button>
        <p className="font-bold" style={{ color: COLORS.redDark }}>Unknown generation.</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-10 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{ border: `2px solid ${COLORS.ink}` }}
          aria-label="Back to home"
        >
          <ArrowLeft size={18} color={COLORS.ink} />
        </button>
        <span
          className="inline-block rounded-xl px-4 py-2 font-extrabold text-sm sm:text-base"
          style={{ backgroundColor: COLORS.teal, fontFamily: HEADING_FONT, color: COLORS.ink }}
        >
          <span style={{ color: COLORS.redDark }}>{gen.ordinal}</span> Generation
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar value={query} onChange={setQuery} placeholder="Write the pokemon you want to find..." />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-full px-4 py-3 font-bold text-sm bg-white outline-none"
          style={{ border: `3px solid ${COLORS.ink}`, fontFamily: BODY_FONT, color: COLORS.ink }}
        >
          <option value="">All types</option>
          {Object.keys(TYPE_COLORS).map((t) => (
            <option key={t} value={t}>{titleCase(t)}</option>
          ))}
        </select>
      </div>

      {error && <p className="mt-8 font-bold" style={{ color: COLORS.redDark }}>Something went wrong loading this generation.</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 mt-8">
        {isLoadingGrid && !error && Array.from({ length: 10 }).map((_, i) => <PokemonCardSkeleton key={i} />)}
        {!isLoadingGrid && filtered.slice(0, visibleCount).map((p) => (
          <PokemonCard key={p.id} pokemon={p} onClick={() => onSelectPokemon(p.name)} />
        ))}
      </div>

      {!isLoadingGrid && filtered.length === 0 && (
        <p className="mt-10 text-center font-bold text-gray-400">No Pokémon found.</p>
      )}
      {!isLoadingGrid && filtered.length > visibleCount && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setVisibleCount((c) => c + 24)}
            className="rounded-full px-6 py-3 font-extrabold"
            style={{ backgroundColor: COLORS.yellow, fontFamily: HEADING_FONT, color: COLORS.ink, boxShadow: `3px 3px 0px 0px ${COLORS.ink}` }}
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
