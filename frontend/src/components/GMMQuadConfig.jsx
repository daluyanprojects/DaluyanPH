import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import Navbar2 from "./navbars/Navbar2";
import UserDropdown from "../utils/UserDropdown";
import StormScenario from "../utils/StormDropdown";
import RainfallInfo from "../components/Info_Cards/RainScenarioInfo";

function GMMQuadConfig({ setLoading, loading, onMapGenerated, pageName, mapType, onToggleWater, isWaterOn }) {
  const [stormScenario, setStormScenario] = useState("");
  const [agentType, setAgentType] = useState("");
  const [currentSessionID, setCurrentSessionID] = useState(null);
  const [infiltEnabled, setInfiltEnabled] = useState(false); 
  const [landuseEnabled, setlanduseEnabled] = useState(false); 
  const [depth, setDepth] = useState(0);
  const [tpeak, setTpeak] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!depth || !tpeak) return toast.error("Please Choose an Input");

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
    is_infiltration: infiltEnabled,
    is_land_use: landuseEnabled, 
    // This spread operator correctly adds 'agent' ONLY if condition is true
    ...(mapType === "susceptibility" && { agent: agentType }) 
    };

    try {
      const response = await axios.post("http://127.0.0.1:8000/daluyan-map/create/", payload);
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
    if (!currentSessionID) return toast.error("No map available");
    window.open(`http://127.0.0.1:8000/daluyan-map/?sessionId=${currentSessionID}&page_name=${pageName}&tif=true`, "_blank");
  };

  return (
    <div className="flex h-full bg-gray-50">
        <div className="w-full max-w-md bg-grey-100 p-0 flex flex-col border-2 h-full mx-auto shadow-md">
            <Navbar2 />
            <div className="p-5 flex-1 flex flex-col justify-between">
                <p className="text-sm mb-4"> Extend flood susceptibility and resiliency assessments to the Greater Metro Manila (GMM) region 
                    using an expansive quadrant-based spatial framework. While focusing on the boundaries of Manila City, this model 
                    utilizes a Vision Transformer (ViT) architecture trained on Greater Metro Manila datasets. This allows the model 
                    to leverage regional spatial patterns and terrain features to produce high-fidelity, localized risk predictions 
                    for the city based on large-scale environmental training data.
                </p>
                
                {/* Instructions */}
                <h2 className="font-bold mb-2">Instructions:</h2>
                <ol className="list-decimal list-outside pl-5 mb-4 text-sm space-y-2">
                    <li>
                         Select a <span className="font-bold">Rainfall Intensity</span> (SCS-Style to Chicago-style).
                         <RainfallInfo />
                    </li>
                    <li>
                         Choose between <span className="font-bold">Susceptibility</span> (exposure risk) or <span className="font-bold">Resiliency</span> (recovery capacity).
                    </li>
                    <li>
                         Toggle <span className="font-bold">Infiltration Map</span> or <span className="font-bold">Land-Use Map</span> data to see how infrastructure affects the results.
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
                                <Link to="/greater-manila-quadrant-splitting   ">
                                    <button className={`btn btn-sm w-[105px] ${mapType === 'susceptibility' ? 'btn-neutral' : ''}`}>
                                        Susceptibility
                                    </button>
                                </Link>
                                <Link to="/greater-manila-quadrant-resiliency">
                                    <button className={`btn btn-sm w-[105px] ${mapType === 'resiliency' ? 'btn-neutral' : ''}`}>
                                        Resiliency
                                    </button>
                                </Link> 
                            </div>
                        </div>

                        <StormScenario value={stormScenario} onChange={setStormScenario} />

                        {/* Only show UserDropdown if mapType is susceptibility */}
                        {mapType === "susceptibility" && (
                            <div className="animate-fadeIn">
                                <UserDropdown value={agentType} onChange={setAgentType} />
                            </div>
                        )}     
            
                       <div className="space-y-3">
                            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border cursor-pointer">
                            <span className="text-sm font-semibold text-slate-700">Infiltration Map</span>
                            <input type="checkbox" className="toggle toggle-primary" checked={infiltEnabled} onChange={(e) => setInfiltEnabled(e.target.checked)} />
                            </label>
                            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border cursor-pointer">
                            <span className="text-sm font-semibold text-slate-700">Land-Use Map</span>
                            <input type="checkbox" className="toggle toggle-primary" checked={landuseEnabled} onChange={(e) => setlanduseEnabled(e.target.checked)} />
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
export default GMMQuadConfig;