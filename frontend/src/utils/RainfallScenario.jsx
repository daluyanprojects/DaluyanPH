import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function RainfallScenario({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { label: "SCS-style Front Loaded", value: "front-loaded" },
    { label: "SCS-style Balanced", value: "balanced" },
    { label: "SCS-style Back Loaded", value: "back-loaded" },
    { label: "Triangular Chicago-style", value: "triangular" }
  ];

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || "Select rainfall scenario";

  return (
    <div className="mb-4">
      {/* Label */}
      <label className="text-xs font-bold text-slate-500 ml-1 mb-1 block">
        Rainfall Scenario
      </label>

      <div className="relative">
        {/* Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 hover:border-blue-400 transition"
        >
          <span>{selectedLabel}</span>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <ul className="absolute mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg z-[200] overflow-hidden animate-fadeIn">
            {options.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-100 transition ${
                    value === opt.value ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}