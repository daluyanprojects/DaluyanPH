import React from "react";

const FloodPatchRes = ({ hoverData }) => {
  if (!hoverData || !hoverData.latlng) return null;

  const { lat, lng } = hoverData.latlng;

  const getRiskLabel = (val) => {
    const levels = {
      0: { label: "No Risk", color: "text-emerald-50" },
      1: { label: "Strong", color: "text-emerald-400" },
      2: { label: "Average", color: "text-orange-400" },
      3: { label: "Low", color: "text-red-500" },
    };
    return levels[val] || { label: "No Data", color: "text-slate-500" };
  };

  const status = getRiskLabel(hoverData.hazardValue);
  const x = hoverData.containerPoint?.x || 0;
  const y = hoverData.containerPoint?.y || 0;

  const getPovertyLabel = (val) => {
   console.log("Hover Poverty Value:", val);
    if (val === null || val === undefined || val < 0) return { label: "No Data", color: "text-slate-500" };
    
    // Mapping based on your legend image ranges
    if (val === 0) return { label: "Richest", color: "text-purple-500" };
    if (val <= 0.0093) return { label: "Prosperous", color: "text-blue-400" };
    if (val <= 0.0303) return { label: "Middle Class", color: "text-teal-400" };
    if (val <= 0.0523) return { label: "Lower Middle", color: "text-green-400" };
    return { label: "Poorest", color: "text-yellow-400" }; // val > 0.0523
  };

  const povertyStatus = getPovertyLabel(hoverData.poverty);

  return (
    <div className="tooltip-container" style={{ top: y + 20, left: x + 20, position: "absolute", zIndex: 9999, }}>
       <div className="flex flex-col gap-2 bg-slate-900/95 p-3 rounded-xl border border-emerald-900/50 min-w-[200px] text-white">
          <div className="text-[10px] uppercase tracking-tighter text-blue-400 font-bold border-b border-emerald-900/30 pb-1">
             Manila City - Resiliency Analysis
          </div>

          {/* COORDINATES SECTION */}
          <div className="grid grid-cols-2 gap-1 border-b border-slate-800 pb-2 mb-1">
             <div className="flex flex-col">
                <span className="text-[9px] text-slate-500 uppercase">Latitude</span>
                <span className="text-[11px] font-mono text-slate-200">{lat.toFixed(5)}</span>
             </div>
             <div className="flex flex-col text-right">
                <span className="text-[9px] text-slate-500 uppercase">Longitude</span>
                <span className="text-[11px] font-mono text-slate-200">{lng.toFixed(5)}</span>
             </div>
          </div>
          
          <div className="flex justify-between text-[11px]">
             <span className="text-slate-400">Barangay:</span>
             <span className="text-emerald-200 font-bold uppercase">{hoverData.barangay_name || "Unknown"}</span>
          </div>

          <div className="flex justify-between items-center py-1">
             <span className="text-slate-400 text-[11px]">Capacity:</span>
             <span className={`font-black uppercase text-[12px] ${status.color}`}>{status.label}</span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 text-[11px]">Economic Class:</span>
            <span className={`font-black uppercase text-[12px] ${povertyStatus.color}`}>{povertyStatus.label}</span>
         </div>
         
       </div>
    </div>
  );
};

export default FloodPatchRes;