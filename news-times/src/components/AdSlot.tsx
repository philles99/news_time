type AdSlotProps = {
  index?: number;
};

export default function AdSlot({ index }: AdSlotProps) {
  return (
    <div className="w-full my-4 sm:my-6">
      <div className="h-20 sm:h-24 lg:h-28 w-full bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 shadow-sm">
        <div className="text-center">
          <div className="text-xs uppercase tracking-wider font-semibold opacity-60 mb-1">Advertisement</div>
          <div className="text-xs opacity-40">Ad space {typeof index === "number" ? `#${index + 1}` : ""}</div>
        </div>
      </div>
    </div>
  );
}


