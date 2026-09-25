export default function SkeletonBox({ className = "", style = {} }) {
  return <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} style={style} />;
}
