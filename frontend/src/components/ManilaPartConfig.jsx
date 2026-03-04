import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import Navbar2 from "./navbars/Navbar2";
import UserDropdown from "../utils/UserDropdown";
import RainScenarioInfo from "../utils/RainfallScenario";

function ManilaPartConfig({ setLoading, loading, onMapGenerated, pageName, mapType }) {
  const [rainfallScenario, setRainfallScenario] = useState("");
  const [agentType, setAgentType] = useState("");
  const [currentSessionID, setCurrentSessionID] = useState(null);
  const [drainageEnabled, setDrainageEnabled] = useState(false);
  const [soilEnabled, setSoilEnabled] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rainfallScenario) return toast.error("Please select a storm scenario");

    if (mapType === "susceptibility" && !agentType) {
    return toast.error("Please select a User Type for Susceptibility analysis");
  }

    setLoading(true);
    const sessionID = uuidv4();
    const payload = {
    page_name: pageName,
    session_id: sessionID,
    type: mapType,
    rainfall_scenario: rainfallScenario, 
    dem: true,
    is_soil: soilEnabled,
    is_drainage: drainageEnabled,
    // This spread operator correctly adds 'agent' ONLY if condition is true
    ...(mapType === "susceptibility" && { agent: agentType }) 
    };

    try {
      const response = await axios.post("http://127.0.0.1:8000/daluyan-map/create/", payload);
      if(response.status === 201){
        setCurrentSessionID(sessionID);
        onMapGenerated(response.data);
        toast.success(`${mapType === 'susceptibility' ? 'Susceptibility' : 'Resiliency'} Map successful!`);
      }
      
    } catch (error) {
      toast.error("Simulation failed.");
      const serverMessage = error.response?.data ? JSON.stringify(error.response.data) : "Simulation failed.";
      console.error("Backend Error:", error.response?.data);
      toast.error(`Error: ${serverMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
  if (!currentSessionID) return toast.error("No map available");
  
  // Notice we added &format=pdf
  const url = `http://localhost:8000/daluyan-map/download/?sessionId=${currentSessionID}&page_name=${pageName}&format=pdf`;
  
  window.open(url, "_blank");
};

  return (
   <div className="flex h-full bg-gray-50">
        <div className="w-full max-w-md bg-grey-100 p-0 flex flex-col border-2 h-full mx-auto shadow-md">
            <Navbar2 />
            <div className="p-5 flex-1 flex flex-col justify-between">
                <p className="text-sm mb-4"> Examine the impact of rainfall distribution on Manila's hydrological response. 
                    Unlike simplified intensity models, this module simulates complex storm scenarios, including SCS-style and Chicago-style 
                    distributions to evaluate how the timing of peak rainfall affects flood accumulation. By factoring in infiltration and land-use variables, 
                    the system provides a dynamic assessment of susceptibility and resiliency across the city.
                </p>
                
                {/* Instructions */}
                <h2 className="font-bold mb-2">Instructions:</h2>
                <ol className="list-decimal list-outside pl-5 mb-4 text-sm space-y-2">
                    <li>
                         Select a <span className="font-bold">Rainfall Intensity</span> (Light to Extreme).
                         <RainScenarioInfo />
                    </li>
                    <li>
                         Choose between <span className="font-bold">Susceptibility</span> (exposure risk) or <span className="font-bold">Resiliency</span> (recovery capacity).
                    </li>
                    <li>
                         Toggle <span className="font-bold">Drainage Network </span> or <span className="font-bold">Soil Permeability </span> data to see how infrastructure affects the results.
                    </li>
                    <li>
                         Click <span className="font-bold">Simulate</span> to generate the heat map.
                    </li>
                </ol>
                
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 justify-between">
                        
                      {/* Type of Map Toggle (From previous fix) */}
                        <div className="mb-5 text-center">
                            <p className="font-semibold mb-2">Type of map</p>
                            <div className="flex gap-5 items-center justify-center">
                                <Link to="/manila-partition-splitting">
                                    <button className={`btn btn-sm w-[105px] ${mapType === 'susceptibility' ? 'btn-neutral' : ''}`}>
                                        Susceptibility
                                    </button>
                                </Link>
                                <Link to="/manila-partition-resiliency">
                                    <button className={`btn btn-sm w-[105px] ${mapType === 'resiliency' ? 'btn-neutral' : ''}`}>
                                        Resiliency
                                    </button>
                                </Link> 
                            </div>
                        </div>

                        <RainfallScenario value={rainfallScenario} onChange={setRainfallScenario} region="manila" />

                        {/* Only show UserDropdown if mapType is susceptibility */}
                        {mapType === "susceptibility" && (
                            <div className="animate-fadeIn">
                                <UserDropdown value={agentType} onChange={setAgentType} />
                            </div>
                        )}     
            
                       <div className="space-y-3">
                            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border cursor-pointer">
                            <span className="text-sm font-semibold text-slate-700">Drainage Network</span>
                            <input type="checkbox" className="toggle toggle-primary" checked={drainageEnabled} onChange={(e) => setDrainageEnabled(e.target.checked)} />
                            </label>
                            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border cursor-pointer">
                            <span className="text-sm font-semibold text-slate-700">Soil Permeability</span>
                            <input type="checkbox" className="toggle toggle-primary" checked={soilEnabled} onChange={(e) => setSoilEnabled(e.target.checked)} />
                            </label>
                        </div>
        
                    {/* Buttons */}
                    <div className="mt-auto pt-4 space-y-2">
                    <button className={`btn w-full ${mapType === 'resiliency' ? 'btn-secondary' : 'btn-primary'}`} type="submit" disabled={loading}>
                    {loading ? "Simulating..." : `SIMULATE ${mapType.toUpperCase()}`}
                    </button>
                    <button className="btn btn-outline btn-sm w-full" type="button" onClick={handleDownload} disabled={!currentSessionID}>DOWNLOAD MAP</button>
                </div>
        

                </form>
            
        </div>
    </div>
    </div>

  );
}
export default ManilaPartConfig;