import { useState } from "react";

export default function RainfallScenario({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false); 
  
  const options = [
    { label: "SCS-style front-loaded", value: "front-loaded" },
    { label: "SCS-style balanced", value: "balanced" },
    { label: "SCS-style back-loaded", value: "back-loaded" },
    { label: "Triangular Chicago-style", value: "triangular" }
  ];


  const selectedLabel = options.find(opt => opt.value === value)?.label || "Select";

  return (
    <div className="mb-5">
      <label className="flex flex-col gap-1 animate-fadeIn">
                  <span className="text-xs font-bold text-slate-500 ml-1">Rainfall Scenario: </span>
      </label>
      <div className="relative">
        <div role="button" className="btn m-1 w-[250px]" onClick={() => setIsOpen(!isOpen)}>
          {selectedLabel}
        </div>
        {isOpen && (
          <ul className="absolute dropdown-content menu bg-base-100 rounded-box z-[50] p-2 shadow w-[250px]">
            {options.map((opt) => (
              <li key={opt.value}>
                <a onClick={() => { onChange(opt.value); setIsOpen(false); }}>
                  {opt.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}