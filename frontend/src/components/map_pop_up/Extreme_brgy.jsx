// components/Extreme_brgy.jsx
const Extreme_brgy = ({ stats }) => {
  if (!stats || stats.length === 0) return null;

  return (
    <div className="absolute top-12 right-0 z-[1000] w-64 bg-white/90 backdrop-blur-sm shadow-xl rounded-lg border-l-4 border-blue-900 overflow-hidden">
      <div className="bg-blue-900/10 px-4 py-2 border-b border-gray-200">
        <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900">
          Top 5 Extreme Risk Areas
        </h3>
      </div>
      <div className="p-3 space-y-3">
        {stats.map((item, index) => (
          <div key={index} className="flex justify-between border-b border-gray-100 last:border-0 pb-2 last:pb-0">
            <span className="text-sm font-semibold text-gray-800 truncate">
              {item.barangay}
            </span>
              <span className="text-blue-700 font-bold text-[13px] font-mono">{item.area_sq_km} km²</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Extreme_brgy;