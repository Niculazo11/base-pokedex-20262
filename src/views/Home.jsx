import { useMemo, useState } from "react";
import { COLORS, HEADING_FONT, BODY_FONT, GENERATIONS } from "../constants";
import { pokeImage, titleCase } from "../utils";
import SearchBar from "../components/SearchBar";

export default function Home({ onSelectGeneration, onSelectPokemon, allList, searchQuery, setSearchQuery, searchInputRef }) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || !allList) return [];
    return allList.filter((p) => p.name.startsWith(q)).slice(0, 8);
  }, [searchQuery, allList]);

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-12 max-w-5xl mx-auto">
      <h1
        className="font-extrabold text-2xl sm:text-3xl mb-6 text-center sm:text-left"
        style={{ fontFamily: HEADING_FONT, color: COLORS.ink }}
      >
        Find your Pokémon
      </h1>

      <div className="relative">
        <SearchBar
          value={searchQuery}
          onChange={(v) => { setSearchQuery(v); setShowSuggestions(true); }}
          placeholder="Write the pokemon you want to find..."
          inputRef={searchInputRef}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        />
        {showSuggestions && suggestions.length > 0 && (
          <div
            className="absolute z-20 mt-2 w-full bg-white rounded-2xl shadow-xl overflow-hidden"
            style={{ border: `2px solid ${COLORS.ink}` }}
          >
            {suggestions.map((p) => (
              <button
                key={p.id}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { onSelectPokemon(p.name); setSearchQuery(""); setShowSuggestions(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 text-left"
              >
                <img src={pokeImage(p.id)} alt="" className="w-8 h-8 object-contain" />
                <span className="font-bold text-sm" style={{ fontFamily: BODY_FONT, color: COLORS.ink }}>
                  {titleCase(p.name)}
                </span>
                <span className="ml-auto text-xs text-gray-400 font-bold">#{String(p.id).padStart(3, "0")}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 mt-8 sm:mt-10">
        {GENERATIONS.map((g) => (
          <button
            key={g.id}
            onClick={() => onSelectGeneration(g.id)}
            className="rounded-2xl py-4 sm:py-5 px-3 sm:px-4 font-extrabold text-sm sm:text-lg text-center transition-transform hover:-translate-y-0.5"
            style={{ backgroundColor: COLORS.teal, fontFamily: HEADING_FONT, color: COLORS.ink, boxShadow: `3px 3px 0px 0px ${COLORS.ink}` }}
          >
            <span style={{ color: COLORS.redDark }}>{g.ordinal}</span> Generation
          </button>
        ))}
      </div>
    </div>
  );
}
