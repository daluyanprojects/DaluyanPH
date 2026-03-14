import React from 'react'

const Legend = () => {
  return (
  
  <div className="card bg-slate-800 text-neutral-content w-[230px] p-2 z-30 shadow-lg">
  <div className="card-body p-2 items-center text-center">
    <h2 className="card-title">Hazard Levels</h2>
    
    <div className="card-actions grid grid-cols-2 gap-y-1 gap-x-1 items-center justify-center">
      
        <h3 className="font-bold text-l text-left w-28">Extreme</h3>
        <div className="w-35 h-4" style={{backgroundColor:"#08306B"}}></div>

        <h3 className="font-bold text-l text-left w-28">High</h3>
        <div className="w-35 h-4" style={{backgroundColor:"#2171B5"}}></div>

        <h3 className="font-bold text-l text-left w-28 ">Medium</h3>
        <div className="w-35 h-4" style={{backgroundColor:"#6BAED6"}}></div>

        <h3 className="font-bold text-l text-left w-28">Low</h3>
        <div className="w-35 h-4" style={{backgroundColor:"#C6DBEF"}}></div>

        <h3 className="font-bold text-l text-left w-28">No Flood</h3>
        <div className="w-35 h-4" style={{backgroundColor:"#FFFFFF"}}></div>

    </div>
  </div>
</div>
  )
}

export default Legend;
