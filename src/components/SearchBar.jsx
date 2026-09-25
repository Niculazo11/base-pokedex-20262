import { Filter } from "lucide-react";
import { COLORS, BODY_FONT } from "../constants";

export default function SearchBar({ value, onChange, placeholder, inputRef, onFocus, onBlur }) {
  return (
    <div
      className="flex items-center gap-3 sm:gap-4 rounded-full px-5 sm:px-7 py-3 sm:py-4 bg-white"
      style={{ border: `3px solid ${COLORS.ink}` }}
    >
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        className="flex-1 min-w-0 outline-none bg-transparent font-bold text-sm sm:text-base placeholder-gray-400"
        style={{ fontFamily: BODY_FONT, color: COLORS.ink }}
      />
      <Filter size={20} color={COLORS.ink} strokeWidth={2.5} className="shrink-0" />
    </div>
  );
}
