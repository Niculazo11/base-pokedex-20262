import SkeletonBox from "./SkeletonBox";

export default function ProfileSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4">
      <SkeletonBox className="w-52 h-52 sm:w-64 sm:h-64 rounded-full" />
      <SkeletonBox className="w-32 h-9 rounded-xl" />
      <div className="flex gap-2">
        <SkeletonBox className="w-16 h-7 rounded-full" />
        <SkeletonBox className="w-16 h-7 rounded-full" />
      </div>
      <div className="w-full flex flex-col gap-2 mt-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBox key={i} className="w-full h-4" />
        ))}
      </div>
    </div>
  );
}
