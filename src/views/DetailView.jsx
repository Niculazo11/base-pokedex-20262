import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams } from "react-router-dom";
import { COLORS, HEADING_FONT, BODY_FONT, TYPE_COLORS } from "../constants";
import { pokeImage, titleCase } from "../utils";
import { getPokemonDetail } from "../services/pokeapi";
import { getTcgCardsForPokemon, getTcgCardDetail } from "../services/tcgApi";
import ProfileSkeleton from "../components/skeletons/ProfileSkeleton";
import TcgCardSkeleton from "../components/skeletons/TcgCardSkeleton";
import TcgCard from "../components/TcgCard";

export default function DetailView({ onBack }) {
  const { name } = useParams();
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState(null);
  const [cardBriefs, setCardBriefs] = useState(null);
  const [cardsError, setCardsError] = useState(null);
  const [cardDetails, setCardDetails] = useState({});

  useEffect(() => {
    let alive = true;
    setDetail(null); setError(null); setCardBriefs(null); setCardsError(null); setCardDetails({});
    window.scrollTo({ top: 0, behavior: "smooth" });

    getPokemonDetail(name)
      .then((d) => alive && setDetail(d))
      .catch((e) => alive && setError(e.message));

    getTcgCardsForPokemon(name)
      .then((list) => {
        if (!alive) return;
        const briefs = list.slice(0, 8);
        setCardBriefs(briefs);
        briefs.forEach((c) => {
          getTcgCardDetail(c.id)
            .then((full) => alive && setCardDetails((prev) => ({ ...prev, [c.id]: full })))
            .catch(() => {});
        });
      })
      .catch((e) => alive && setCardsError(e.message));

    return () => { alive = false; };
  }, [name]);

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-10 max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="w-9 h-9 rounded-full flex items-center justify-center mb-6"
        style={{ border: `2px solid ${COLORS.ink}` }}
        aria-label="Back"
      >
        <ArrowLeft size={18} color={COLORS.ink} />
      </button>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-14">
        <div className="lg:w-72 shrink-0">
          {!detail && !error && <ProfileSkeleton />}
          {error && <p className="font-bold" style={{ color: COLORS.redDark }}>Pokémon not found.</p>}
          {detail && (
            <div className="flex flex-col items-center gap-4 lg:sticky lg:top-6">
              <img
                src={detail.sprites?.other?.["official-artwork"]?.front_default || pokeImage(detail.id)}
                alt={detail.name}
                className="w-52 h-52 sm:w-64 sm:h-64 object-contain drop-shadow-xl"
              />
              <span
                className="rounded-xl px-5 py-2.5 font-extrabold text-lg"
                style={{ backgroundColor: COLORS.gray, fontFamily: HEADING_FONT, color: "white" }}
              >
                {titleCase(detail.name)}
              </span>
              <span className="font-bold text-gray-400 text-sm" style={{ fontFamily: BODY_FONT }}>
                #{String(detail.id).padStart(3, "0")}
              </span>
              <div className="flex gap-2 flex-wrap justify-center">
                {detail.types.map((t) => (
                  <span
                    key={t.type.name}
                    className="px-3 py-1 rounded-full text-xs font-extrabold text-white"
                    style={{ backgroundColor: TYPE_COLORS[t.type.name] || COLORS.gray }}
                  >
                    {titleCase(t.type.name)}
                  </span>
                ))}
              </div>
              <div className="w-full flex flex-col gap-2 mt-2">
                {detail.stats.map((s) => (
                  <div key={s.stat.name}>
                    <div className="flex justify-between text-xs font-bold mb-1" style={{ fontFamily: BODY_FONT, color: COLORS.ink }}>
                      <span>{titleCase(s.stat.name)}</span>
                      <span>{s.base_stat}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${Math.min(100, (s.base_stat / 180) * 100)}%`, backgroundColor: COLORS.teal }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="font-extrabold text-lg sm:text-xl mb-5" style={{ fontFamily: HEADING_FONT, color: COLORS.ink }}>
            Trading Cards
          </h2>
          {cardsError && <p className="font-bold text-sm" style={{ color: COLORS.redDark }}>Couldn't load TCG cards.</p>}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 sm:gap-6">
            {!cardBriefs && !cardsError && Array.from({ length: 8 }).map((_, i) => <TcgCardSkeleton key={i} />)}
            {cardBriefs && cardBriefs.length === 0 && (
              <p className="col-span-full font-bold text-gray-400 text-sm">No trading cards found for this Pokémon.</p>
            )}
            {cardBriefs && cardBriefs.map((c) => (
              <TcgCard key={c.id} brief={c} full={cardDetails[c.id]} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
