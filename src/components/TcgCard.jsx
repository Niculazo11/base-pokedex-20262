import { COLORS, BODY_FONT, PLACEHOLDER_CARD_IMAGE } from "../constants";
import { formatPrice, getCardPurchaseLink } from "../utils";
import SkeletonBox from "./skeletons/SkeletonBox";

export default function TcgCard({ brief, full }) {
  const cardmarket = full?.pricing?.cardmarket;
  const tcgplayer = full?.pricing?.tcgplayer;

  let priceLabel = null;
  if (cardmarket?.avg !== undefined) priceLabel = formatPrice(cardmarket.avg, "EUR");
  else if (tcgplayer?.normal?.marketPrice !== undefined) priceLabel = formatPrice(tcgplayer.normal.marketPrice, "USD");
  else if (tcgplayer?.holofoil?.marketPrice !== undefined) priceLabel = formatPrice(tcgplayer.holofoil.marketPrice, "USD");

  // The list endpoint already carries storefront links, so the buy button doesn't
  // need to wait for the per-card detail fetch — fall back to it if present, though.
  const purchase = getCardPurchaseLink({ name: brief.name, links: full?.links || brief.links });

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-full rounded-xl overflow-hidden" style={{ border: `2px solid ${COLORS.ink}`, aspectRatio: "5 / 7" }}>
        <img
          src={brief.image || PLACEHOLDER_CARD_IMAGE}
          alt={brief.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            // Avoid an infinite loop if the placeholder itself is ever missing.
            if (e.currentTarget.src.endsWith(PLACEHOLDER_CARD_IMAGE)) return;
            e.currentTarget.onerror = null;
            e.currentTarget.src = PLACEHOLDER_CARD_IMAGE;
          }}
        />
      </div>
      <span className="font-bold text-xs sm:text-sm text-center" style={{ fontFamily: BODY_FONT, color: COLORS.ink }}>
        {brief.name}
      </span>
      {full ? (
        priceLabel ? (
          <span className="rounded-lg px-2.5 py-1 text-xs font-extrabold text-white" style={{ backgroundColor: COLORS.redDark }}>
            {priceLabel}
          </span>
        ) : (
          <span className="text-xs text-gray-400 font-bold">No price data</span>
        )
      ) : (
        <SkeletonBox className="w-14 h-5 rounded-lg" />
      )}

      {purchase ? (
        <a
          href={purchase.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full px-3 py-1.5 text-[11px] sm:text-xs font-extrabold text-center transition-transform hover:-translate-y-0.5"
          style={{ backgroundColor: COLORS.yellow, color: COLORS.ink, boxShadow: `2px 2px 0px 0px ${COLORS.ink}` }}
        >
          {purchase.label}
        </a>
      ) : (
        <span
          className="rounded-full px-3 py-1.5 text-[11px] sm:text-xs font-extrabold text-gray-400 bg-gray-100 cursor-not-allowed"
          title="No hay enlace de compra disponible para esta carta"
        >
          No disponible
        </span>
      )}
    </div>
  );
}
