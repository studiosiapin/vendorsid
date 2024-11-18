import React from 'react';

type TableSkeletonProps = {
  show: boolean;
};

const TableSkeleton = ({ show }: TableSkeletonProps) => {
  return (
    <div className={show ? '' : 'hidden'}>
      <div className="flex animate-pulse">
        <div className="flex-1 space-y-4 py-1">
          <div className="h-8 w-full rounded bg-zinc-200 dark:bg-zinc-600/20"></div>
          <div className="grid grid-cols-[1fr_4fr_2fr_1fr] gap-4">
            {Array.from({ length: 24 }).map((_, index) => (
              <div
                className="h-6 w-full rounded bg-zinc-200 dark:bg-zinc-600/20"
                key={index}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton;
