import SkeletonBox from "./SkeletonBox";

export default function PokemonCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-3">
      <SkeletonBox className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl" />
      <SkeletonBox className="w-24 h-8 rounded-xl" />
    </div>
  );
}
