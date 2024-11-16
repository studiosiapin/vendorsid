import React from 'react';

const DetailPesananSkeleton = () => {
  return (
    <div className="animate-pulse p-6">
      <div className="grid grid-cols-[300px_1fr] gap-7 max-md:grid-cols-1">
        <div className="flex flex-col gap-3">
          <div className="h-5 w-full bg-zinc-200/80"></div>
          <div className="mb-5 aspect-square w-full bg-zinc-200/80"></div>
          <div className="h-5 w-full bg-zinc-200/80"></div>
          <div className="mb-5 aspect-square w-full bg-zinc-200/80"></div>
          <div className="h-5 w-full bg-zinc-200/80"></div>
          <div className="mb-5 aspect-square w-full bg-zinc-200/80"></div>
        </div>
        <div className="">
          <div className="grid grid-cols-2 gap-5">
            {Array.from({ length: 8 }).map((_, index) => (
              <div className="flex flex-col gap-2" key={index}>
                <div className="h-5 w-full bg-zinc-200/80"></div>
                <div className="h-10 w-full bg-zinc-200/80"></div>
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-4 gap-5">
            {Array.from({ length: 30 }).map((_, index) => (
              <div className="h-20 w-full bg-zinc-200/80" key={index}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPesananSkeleton;
