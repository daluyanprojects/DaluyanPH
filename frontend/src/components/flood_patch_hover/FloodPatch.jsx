import React from "react";

const FloodPatch = ({ hoverData }) => {
  if (!hoverData || !hoverData.latlng) return null;

  const { lat, lng } = hoverData.latlng;
  
  const getHazardLabel = (val) => {
    const levels = {
      0: { label: "No Flood", color: "text-emerald-400" },
      1: { label: "Low", color: "text-yellow-300" },
      2: { label: "Medium", color: "text-orange-400" },
      3: { label: "High", color: "text-red-500" },
      4: { label: "Extreme", color: "text-purple-600" },
    };
    return levels[val] || levels[0];
  };

  const status = getHazardLabel(hoverData.hazardValue);
  const x = hoverData.containerPoint?.x || 0;
  const y = hoverData.containerPoint?.y || 0;

  return (
    <div className="tooltip-container" style={{ top: y + 20, left: x + 20, position: "absolute", zIndex: 9999, }}>
       <div className="flex flex-col gap-2 bg-slate-900/95 p-3 rounded-xl backdrop-blur-md border border-slate-700 min-w-[200px] text-white">
          <div className="text-[10px] uppercase tracking-tighter text-blue-400 font-bold border-b border-slate-700 pb-1">
             Manila City - Susceptibility Analysis
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
             <span className="text-yellow-500 font-bold uppercase">{hoverData.barangay_name || "Unknown"}</span>
          </div>

          <div className="flex justify-between items-center py-1">
             <span className="text-slate-400 text-[11px]">Hazard:</span>
             <span className={`font-black uppercase text-[12px] ${status.color}`}>{status.label}</span>
          </div>

          {hoverData.confidence !== undefined && (
            <div className="pt-1 border-t border-slate-800 flex justify-between items-center">
               <span className="text-blue-300 text-[11px]">Confidence:</span>
               <span className="font-mono text-[11px]">{(hoverData.confidence * 100).toFixed(1)}%</span>
            </div>
          )}
       </div>
    </div>
  );
};

export default FloodPatch;