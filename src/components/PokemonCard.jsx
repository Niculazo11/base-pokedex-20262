import { COLORS, HEADING_FONT } from "../constants";
import { pokeImage, titleCase } from "../utils";

export default function PokemonCard({ pokemon, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 sm:gap-3 group">
      <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center transition-transform group-hover:-translate-y-1">
        <img src={pokeImage(pokemon.id)} alt={pokemon.name} className="w-full h-full object-contain drop-shadow-md" loading="lazy" />
      </div>
      <span
        className="rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 font-extrabold text-xs sm:text-sm"
        style={{ backgroundColor: COLORS.gray, fontFamily: HEADING_FONT, color: "white" }}
      >
        {titleCase(pokemon.name)}
      </span>
    </button>
  );
}
