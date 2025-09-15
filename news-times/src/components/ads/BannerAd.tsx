export default function BannerAd() {
  return (
    <div className="w-full my-8">
      <div className="h-24 w-full bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-sm font-medium">Advertisement</div>
          <div className="text-gray-300 text-xs mt-1">728 x 90</div>
        </div>
      </div>
    </div>
  );
}