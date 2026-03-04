import React from 'react';

const ModelLaunch = ({ title, subtitle, launchLink, Icon }) => {
  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-700 p-8 rounded-2xl flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 group shadow-2xl">
      
      {/* Dynamic Icon Container */}
      <div className="mb-5 p-4 bg-blue-600/10 rounded-xl text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
        {Icon && <Icon size={32} strokeWidth={1.5} />}
      </div>

      <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-400 text-sm mb-8 leading-relaxed px-4">
        {subtitle}
      </p>

      <a 
        href={launchLink}
        className="mt-auto w-full py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors uppercase text-xs tracking-widest shadow-lg shadow-blue-900/40"
      >
        Launch Model
      </a>
    </div>
  );
};
export default ModelLaunch;