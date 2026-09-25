import SkeletonBox from "./SkeletonBox";

export default function TcgCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2">
      <SkeletonBox className="w-full rounded-xl" style={{ aspectRatio: "5 / 7" }} />
      <SkeletonBox className="w-20 h-4" />
      <SkeletonBox className="w-14 h-5 rounded-lg" />
      <SkeletonBox className="w-24 h-6 rounded-full" />
    </div>
  );
}
