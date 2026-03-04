import React from 'react';
import Logo from "../../assets/Daluyan_PH_Logo.png";


const Navbar = () => {
  return ( 
  
  <header className="bg-base-100 border-b border-base-content/10">
    <div className="max-w-2xl p-2">
        <div className="flex items-left justify-left">
            <img src={Logo} alt="Logo" className="h-8 w-30" />
        </div>
    </div>
  </header>
  );
};

export default Navbar;
