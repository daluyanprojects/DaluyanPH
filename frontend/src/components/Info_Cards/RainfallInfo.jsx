import React, { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react"; // npm install lucide-react

const RainfallInfo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  return (
    <div className="relative inline-block ml-1 align-middle" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center text-slate-400 hover:text-primary transition-all focus:outline-none"
      >
        <Info size={16} strokeWidth={2.5} />
      </button>

      {isOpen && (
        <div className="absolute left-6 -top-2 z-[9999] w-72 p-4 bg-white border border-slate-200 shadow-2xl rounded-xl animate-fadeIn pointer-events-auto">
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary border-b border-slate-100 pb-1">
              Rainfall Distributions
            </h4>
            
            <div className="space-y-3">
              <div>
                <p className="text-[11px] font-bold text-slate-700 underline">SCS-Style Scenarios</p>
                <p className="text-[10.5px] text-slate-600 leading-relaxed">
                   lorem ipsum
                </p>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-700 underline">Chicago-Style Triangular</p>
                <p className="text-[10.5px] text-slate-600 leading-relaxed">
                  lorem ipsum
                </p>
              </div>
            </div>
            
            <p className="text-[9px] text-slate-400 italic mt-1 font-medium">
              *Used as inputs for the ViT flood prediction model.
            </p>
          </div>
          {/* Small Arrow Pointer */}
          <div className="absolute -left-2 top-3 w-4 h-4 bg-white border-l border-b border-slate-200 rotate-45" />
        </div>
      )}
    </div>
  );
};

export default RainfallInfo;