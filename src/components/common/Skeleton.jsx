const Skeleton = ({ width = 'w-full', height = 'h-4', className = '' }) => {
  return (
    <div className={`${width} ${height} bg-gray-200 rounded animate-pulse ${className}`}></div>
  );
};

export const CardSkeleton = () => (
  <div className="card">
    <Skeleton height="h-6" width="w-3/4" className="mb-4" />
    <Skeleton height="h-4" width="w-full" className="mb-2" />
    <Skeleton height="h-4" width="w-5/6" />
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-3">
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="flex gap-4">
        <Skeleton width="w-1/4" />
        <Skeleton width="w-1/4" />
        <Skeleton width="w-1/4" />
        <Skeleton width="w-1/4" />
      </div>
    ))}
  </div>
);

export default Skeleton;
