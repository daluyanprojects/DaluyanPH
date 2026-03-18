import React from 'react';
import sim from "../assets/sim.png"; // Your map image with the legend already on it


const ModelLaunch = ({ title, subtitle, launchLink, Icon }) => {
  return (
    <div className="relative aspect-[10/9] w-full max-w-[450px] bg-slate-900/40 backdrop-blur-md border border-slate-700 p-5 rounded-2xl flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-2 hover:border-sky-950 group shadow-3xl">
    
      <div className="relative z-10 flex items-center gap-5 mb-6 ml-2">
        <div className="p-3.5 bg-transparent border-2 border-white/80 rounded-2xl flex items-center justify-center transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 group shadow-2xl">
          {Icon && <Icon size={40} strokeWidth={1.5} className="text-white" />}
        </div>
        <div className="flex flex-col">
          <h2 className="text-2xl  text-white font-semibold leading-tight tracking-tight">{title}</h2>
          <p className="text-m text-zinc-400 font-medium">{subtitle}</p>
        </div>
      </div>

      <div className="relative z-10 w-full h-[80%] rounded-[2rem] overflow-hidden bg-white shadow-inner">
        <img 
          src={sim} 
          alt="Rainfall Partition Map" 
          className="w-full h-full object-cover" 
        />

        
        <div className="absolute bottom-6 left-6">
          <a 
            href={launchLink}
            className="px-10 py-4 bg-[#2195bd] hover:bg-[#1a7a9c] text-white font-bold rounded-full text-xl shadow-lg transition-all active:scale-95 flex items-center justify-center"
          >
            Launch Model
          </a>
        </div>
      </div>
      
    </div>
  );
};

export default ModelLaunch;