import React from 'react';
import Logo from "../../assets/Daluyan_PH_Logo.png";
import HomeIcon from "../../assets/home.png";
import { Link } from "react-router-dom";

const Navbar2 = () => {
  return ( 
  
  <header className="bg-base-300 border-b border-base-content/10">
        {/* Home Icon */}
        <div className="flex items-left">
        <Link to={"/"} >
          <img src={HomeIcon} alt="Home" className="h-4 w-4 p-0 m-2 cursor-pointer" />
        </Link>
        </div>

        <div className="mx-auto max-w-6xl p-4">
            <div className="flex items-center justify-center">
                <img src={Logo} alt="Logo" className="h-16 w-30" />
            </div>
        </div>
        
  </header>
  );
};

export default Navbar2;
