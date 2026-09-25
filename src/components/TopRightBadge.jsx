import { COLORS } from "../constants";

/**
 * Placeholder for the top-right navbar badge.
 * In the PDF wireframe this spot has a black-and-white pokéball icon.
 * Swap the contents of this component for that pokéball (SVG/PNG) whenever you're ready —
 * everywhere it's used (Navbar.jsx) will pick it up automatically.
 */
export default function TopRightBadge({ size = 56 }) {
  return (
    <div
      className="rounded-full shrink-0"
      style={{ width: size, height: size, backgroundColor: COLORS.blue, border: `4px solid ${COLORS.ink}` }}
      aria-hidden="true"
    />
  );
}
