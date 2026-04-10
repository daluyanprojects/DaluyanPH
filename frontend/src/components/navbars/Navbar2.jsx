import React from 'react';
import Logo from "../../assets/Daluyan_PH_Logo.png";
import HomeIcon from "../../assets/home.png";
import { Link } from "react-router-dom";

const Navbar2 = () => {
  return ( 
    <header className="bg-base-300 shadow-sm relative">
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex items-center h-16 gap-4">
      <Link to="/" className="flex items-center hover:opacity-80 transition">
        <div className="p-1">
          <img src={HomeIcon} alt="Home" className="h-3.5 w-3.5" />
        </div>
      </Link>
      <img src={Logo} alt="Daluyan PH" className="h-8 w-auto" />
      <div className="flex-1"></div>
    </div>
  </div>

  <div className="absolute bottom-0 w-full overflow-hidden leading-[0]">
    <svg 
      viewBox="0 0 1200 120" 
      preserveAspectRatio="none" 
      className="relative block w-full h-6"
    >
      <path 
        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
        className="fill-base-300"
      ></path>
    </svg>
  </div>
</header>
  );
};

export default Navbar2;
