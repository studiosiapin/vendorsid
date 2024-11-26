interface StepTabsProps {
  step: number;
}

export default function StepTabs({ step }: StepTabsProps) {
  return (
    <div className="grid grid-cols-3 gap-3 max-md:grid-cols-1">
      <div
        className={`border-b-4 pb-3 ${step == 1 ? 'border-orange-500' : ''}`}
      >
        <div className="text-xs font-semibold text-orange-500">Step 1</div>
        <div className="text-md">Informasi Dasar</div>
      </div>
      <div
        className={`border-b-4 pb-3 ${step == 2 ? 'border-orange-500' : ''}`}
      >
        <div className="text-xs font-semibold text-orange-500">Step 2 </div>
        <div className="text-md">Ukuran</div>
      </div>
      <div
        className={`border-b-4 pb-3 ${step == 3 ? 'border-orange-500' : ''}`}
      >
        <div className="text-xs font-semibold text-orange-500">Step 3 </div>
        <div className="text-md">Biaya</div>
      </div>
    </div>
  );
}
