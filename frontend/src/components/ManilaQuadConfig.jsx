import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import Navbar2 from "../components/navbars/Navbar2";
import UserDropdown from "../utils/UserDropdown";
import StormScenario from "../utils/StormDropdown";
import { Info } from "lucide-react";
import RainScenarioInfo from "./Info_Cards/RainScenarioInfo";

function ManilaQuadConfig({ setLoading, loading, onMapGenerated, pageName, mapType, onToggleWater, isWaterOn }) {
  const [stormScenario, setStormScenario] = useState("");
  const [agentType, setAgentType] = useState("");
  const [drainageEnabled, setDrainageEnabled] = useState(false);
  const [soilEnabled, setSoilEnabled] = useState(false);
  const [currentSessionID, setCurrentSessionID] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stormScenario) return toast.error("Please select a storm scenario");

    if (mapType === "susceptibility" && !agentType) {
    return toast.error("Please select a User Type for Susceptibility analysis");
  }

    setLoading(true);
    const sessionID = uuidv4();
    setCurrentSessionID(sessionID);

    const payload = {
    page_name: pageName,
    session_id: sessionID,
    type: mapType,
    rainfall: stormScenario, 
    dem: true,
    is_soil: soilEnabled,
    is_drainage: drainageEnabled,
    // This spread operator correctly adds 'agent' ONLY if condition is true
    ...(mapType === "susceptibility" && { agent: agentType }) 
    };


    try {
      const response = await axios.post("http://127.0.0.1:8000/daluyan-map/create/", payload);
      
      if (mapType === "resiliency") {
      await axios.post("http://127.0.0.1:8000/daluyan-map/resilience/run/", {
        session_id: sessionID,
        page_name: pageName,
      });
    }
      toast.success(`${mapType === 'susceptibility' ? 'Susceptibility' : 'Resiliency'} Map successful!`);
      onMapGenerated(response.data);
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
  if (!currentSessionID) {
    return toast.error("Please run a simulation first to generate a map.");
  }
  const url = `http://127.0.0.1:8000/export-map-pdf/?sessionId=${currentSessionID}&page_name=${pageName}`;
  console.log("Attempting PDF Download with URL:", url);
  const win = window.open(url, "_blank");
  if (!win) {
    toast.error("Popup blocked! Please allow popups for this site.");
  }
};

  return (
    <div className="flex min-h-screen bg-gray-50">
        <div className="w-full max-w-md bg-white flex flex-col mx-auto shadow-md">  
            <Navbar2 />
            <div className="p-5 flex-1 flex flex-col justify-between">
                <p className="text-sm mb-4"> 
                    Analyze flood susceptibility and resiliency across Manila City. 
                    This module utilizes a Vision Transformer (ViT) architecture to process quadrant-partitioned data, enabling high-precision localized risk prediction. 
                    By integrating simplified rainfall intensity metrics with deep-learning feature extraction, the model identifies area-specific vulnerabilities and urban recovery capacity.
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
                                <Link to="/manila-quadrant-splitting">
                                    <button className={`btn btn-sm w-[105px] ${mapType === 'susceptibility' ? 'btn-neutral' : ''}`}>
                                        Susceptibility
                                    </button>
                                </Link>
                                <Link to="/manila-quadrant-resiliency">
                                    <button className={`btn btn-sm w-[105px] ${mapType === 'resiliency' ? 'btn-neutral' : ''}`}>
                                        Resiliency
                                    </button>
                                </Link> 
                            </div>
                        </div>

                        {/* Infrastructure & Water Toggles */}
                        <div className="space-y-3 m-4"> 
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Environmental Layers</p>
                            {/*Water Bodies Switch */}
                            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border cursor-pointer">
                                <span className="text-sm font-semibold text-slate-700">Show Water Bodies</span>
                                <input type="checkbox" className="toggle toggle-primary" checked={isWaterOn} onChange={() => onToggleWater(!isWaterOn)} />
                            </label>
                        </div>

                        <StormScenario value={stormScenario} onChange={setStormScenario} region="manila" />

                        
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
export default ManilaQuadConfig;