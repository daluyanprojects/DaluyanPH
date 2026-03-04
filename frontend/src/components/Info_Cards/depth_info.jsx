import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { Info } from "lucide-react";

const DepthInfo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPopupPos({
        top: rect.bottom + window.scrollY + 12, // Added slightly more breathing room
        left: rect.left + window.scrollX - 10, // Slight offset to align arrow better
      });
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      const portal = document.getElementById("depth-info-portal");
      if (portal && portal.contains(event.target)) return;
      if (buttonRef.current && buttonRef.current.contains(event.target)) return;
      setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  const handleToggle = () => setIsOpen((prev) => !prev);

  return (
    <span className="relative inline-block ml-1 align-middle">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={`flex items-center justify-center transition-all focus:outline-none ${
          isOpen ? "text-primary" : "text-slate-400 hover:text-primary"
        }`}
      >
        <Info size={16} strokeWidth={2.5} />
      </button>

      {isOpen &&
        ReactDOM.createPortal(
          <div
            id="depth-info-portal"
            style={{
              position: "absolute",
              top: popupPos.top,
              left: popupPos.left,
              zIndex: 99999,
            }}
            className="w-80 p-4 bg-white border border-slate-200 shadow-2xl rounded-xl animate-fadeIn"
          >
            <div className="flex flex-col gap-3">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary border-b border-slate-100 pb-1">
                Depth Ranges (mm)
              </h4>
              
              {/* Grid: 2 columns, 2 rows */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                <div className="flex flex-col">
                  <p className="text-[10px] font-bold text-slate-700 underline uppercase">Front-Loaded</p>
                  <p className="text-[10.5px] text-slate-600 font-medium">6 — 78 mm</p>
                </div>

                <div className="flex flex-col">
                  <p className="text-[10px] font-bold text-slate-700 underline uppercase">Balanced</p>
                  <p className="text-[10.5px] text-slate-600 font-medium">19 — 78 mm</p>
                </div>

                <div className="flex flex-col">
                  <p className="text-[10px] font-bold text-slate-700 underline uppercase">Back-Loaded</p>
                  <p className="text-[10.5px] text-slate-600 font-medium">7 — 75 mm</p>
                </div>

                <div className="flex flex-col">
                  <p className="text-[10px] font-bold text-slate-700 underline uppercase">Triangular</p>
                  <div className="text-[10.5px] text-slate-600 font-medium leading-tight">
                    <p>Depth: 5 — 77</p>
                    <p>Peak: 0.1 — 0.9</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pointer Arrow */}
            <div className="absolute -top-2 left-3 w-4 h-4 bg-white border-t border-l border-slate-200 rotate-45" />
          </div>,
          document.body
        )}
    </span>
  );
};

export default DepthInfo;