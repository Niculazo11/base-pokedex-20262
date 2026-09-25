import { Search, Menu } from "lucide-react";
import { COLORS, HEADING_FONT, BODY_FONT, GENERATIONS } from "../constants";
import TopRightBadge from "./TopRightBadge";

export default function Navbar({ onHome, onSearchClick, genMenuOpen, onToggleGenMenu, onJumpGen }) {
  return (
    <header className="relative">
      <div style={{ backgroundColor: COLORS.red }}>
        <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-8 py-4 sm:py-5">
          <button
            onClick={onHome}
            className="rounded-2xl px-5 py-3 sm:px-7 sm:py-3.5 shrink-0"
            style={{ backgroundColor: COLORS.teal }}
          >
            <span className="font-extrabold text-xl sm:text-3xl" style={{ fontFamily: HEADING_FONT, color: COLORS.ink }}>
              Pokefinder
            </span>
          </button>

          <button
            onClick={onSearchClick}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: COLORS.yellow }}
            aria-label="Search"
          >
            <Search size={20} color={COLORS.ink} strokeWidth={2.5} />
          </button>

          <div className="relative shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); onToggleGenMenu(); }}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: COLORS.green }}
              aria-label="Generations index"
            >
              <Menu size={20} color={COLORS.ink} strokeWidth={2.5} />
            </button>
            {genMenuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl overflow-hidden z-30"
                style={{ border: `2px solid ${COLORS.ink}` }}
              >
                {GENERATIONS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => onJumpGen(g.id)}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-100 font-bold text-sm"
                    style={{ fontFamily: BODY_FONT, color: COLORS.ink }}
                  >
                    <span style={{ color: COLORS.redDark }}>{g.ordinal}</span> Generation
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="ml-auto hidden sm:block">
            <TopRightBadge size={56} />
          </div>
        </div>
      </div>
      <div className="dashed-divider" />
    </header>
  );
}
