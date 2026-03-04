import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { Info } from "lucide-react";

const RainfallScenarioInfo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPopupPos({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      });
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      const portal = document.getElementById("rainfall-info-portal");
      if (portal && portal.contains(event.target)) return;
      if (buttonRef.current && buttonRef.current.contains(event.target)) return;
      setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    
    window.addEventListener("scroll", updatePosition, true); // true = capture all scroll events
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPopupPos({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      });
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <span className="relative inline-block ml-1 align-middle">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="flex items-center justify-center text-slate-400 hover:text-primary transition-all focus:outline-none"
      >
        <Info size={16} strokeWidth={2.5} />
      </button>

      {isOpen &&
        ReactDOM.createPortal(
          <div
            id="rainfall-info-portal"
            style={{
              position: "absolute",
              top: popupPos.top,
              left: popupPos.left,
              zIndex: 99999,
            }}
            className="w-64 p-4 bg-white border border-slate-200 shadow-2xl rounded-xl animate-fadeIn"
          >
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary border-b border-slate-100 pb-1">
                Rainfall Distributions
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-[11px] font-bold text-slate-700 underline"> SCS-style Front-Loaded (Convective)</p>
                  <p className="text-[10.5px] text-slate-600 leading-relaxed">
                    Most rainfall occurs early in the storm, producing a rapid spike in intensity that can lead to rapid runoff and flash flooding.
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-bold text-slate-700 underline"> SCS-style Balanced (Intermediate)</p>
                  <p className="text-[10.5px] text-slate-600 leading-relaxed">
                    Rainfall is distributed more evenly across the storm duration. It represents a moderate, symmetric rainfall pattern.
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-bold text-slate-700 underline"> SCS-style Back-Loaded (Frontal)</p>
                  <p className="text-[10.5px] text-slate-600 leading-relaxed">
                    Rainfall builds gradually and peaks late in the storm; flooding may occur toward the end of the event.
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-bold text-slate-700 underline"> Triangular / Chicago-Style Storm</p>
                  <p className="text-[10.5px] text-slate-600 leading-relaxed">
                    A synthetic design storm where rainfall intensity rises to a peak, then declines. The peak timing can be adjusted to test how rainfall timing affects flooding.
                  </p>
                </div>
              </div>
              <p className="text-[9px] text-slate-400 italic mt-1 font-medium">
                *Used as inputs for the ViT flood prediction model.
              </p>
            </div>
            <div className="absolute -top-2 left-3 w-4 h-4 bg-white border-t border-l border-slate-200 rotate-45" />
          </div>,
          document.body
        )}
    </span>
  );
};

export default RainfallScenarioInfo;