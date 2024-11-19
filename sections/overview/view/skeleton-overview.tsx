import React from 'react';

const SkeletonOverview = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-[130px] rounded-lg bg-zinc-300 dark:bg-zinc-600/40"></div>
        <div className="h-[130px] rounded-lg bg-zinc-300 dark:bg-zinc-600/40"></div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-[130px] rounded-lg bg-zinc-300 dark:bg-zinc-600/40"></div>
        <div className="h-[130px] rounded-lg bg-zinc-300 dark:bg-zinc-600/40"></div>
        <div className="h-[130px] rounded-lg bg-zinc-300 dark:bg-zinc-600/40"></div>
      </div>
      <div className="h-[300px] rounded-lg bg-zinc-300 dark:bg-zinc-600/40"></div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-[400px] rounded-lg bg-zinc-300 dark:bg-zinc-600/40"></div>
        <div className="h-[400px] rounded-lg bg-zinc-300 dark:bg-zinc-600/40"></div>
      </div>
    </div>
  );
};

export default SkeletonOverview;
