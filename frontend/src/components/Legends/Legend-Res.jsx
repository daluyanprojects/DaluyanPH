import React from 'react';

const LegendRes = () => {
    return (
    <div className="card bg-slate-800 text-neutral-content w-[300px] p-1 z-30 shadow-lg">
  <div className="card-body p-5 items-center text-center">
    <h2 className="card-title">Levels of Resilience</h2>
    
    <div className="card-actions grid grid-cols-2 gap-y-2 gap-x-2 items-center justify-center">


        <h3 className="font-bold text-l text-left w-28">Strong</h3>
        <div className="bg-green-700 w-35 h-5"></div>
  
        <h3 className="font-bold text-l text-left w-28 ">Average</h3>
        <div className="bg-amber-600 w-35 h-5"></div>

        <h3 className="font-bold text-l text-left w-28">Low</h3>
        <div className="bg-red-800 w-35 h-5"></div>

    </div>
  </div>
</div>



    )

}

export default LegendRes;
