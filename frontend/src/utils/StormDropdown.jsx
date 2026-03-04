import { useState } from "react";

export default function StormDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false); 
  const options = ["Light", "Medium", "Heavy", "Extreme"];

  return (
    <div className="mb-5 flex">
      <p className="font-semibold">Storm Scenario:</p>
      <p className="ml-3"></p>

      <div className="relative">
        {/* Button */}
        <div
          role="button"
          className="btn m-1 w-[120px] text-left"
          onClick={() => setIsOpen(!isOpen)}
        >
          {value || "Select"}
        </div>

        {/* Dropdown */}
        {isOpen && (
          <ul className="absolute dropdown-content menu bg-base-100 rounded-box z-[1] p-2 shadow w-[120px]">
            {options.map((option) => (
              <li key={option}>
                <a
                  href="#!"
                  className="cursor-pointer"
                  onClick={() => {
                    onChange(option); // update parent state
                    setIsOpen(false); // close dropdown
                  }}
                >
                  {option}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
