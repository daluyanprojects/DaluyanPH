import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import Navbar2 from "../components/navbars/Navbar2";
import UserDropdown from "../utils/UserDropdown";
import { Info } from "lucide-react";
import RainfallScenarioInfo from "../components/Info_Cards/RainScenarioInfo";
import RainfallScenario from "../utils/RainfallScenario"
import DepthInfo from "./Info_Cards/depth_info";



function GMMPartConfig({ setLoading, loading, onMapGenerated, setCurrentSessionID, pageName, mapType, onToggleWater, isWaterOn }) {
  const [rainfallScenario, setRainfallScenario] = useState("");
  const [agentType, setAgentType] = useState("");
  const [depth, setDepth] = useState(0);
  const [tpeak, setTpeak] = useState(0);
  const [lastFinishedID, setLastFinishedID] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rainfallScenario) return toast.error("Please select a Rainfall Scenario");
    if (!depth || depth <= 0) return toast.error("Please enter a valid Rainfall Depth");
    if (rainfallScenario === "triangular") {
      if (tpeak < 0.1 || tpeak > 0.9) {
        return toast.error("Triangular Peak must be between 0.1 and 0.9");
      }
    }
    if (mapType === "susceptibility" && !agentType) {
    return toast.error("Please select a User Type for Susceptibility analysis");
  }

    const sessionID = uuidv4();
    setCurrentSessionID(sessionID);
    setLoading(true);

    const payload = {
    page_name: pageName,
    session_id: sessionID,
    type: mapType,
    rainfall_scenario: rainfallScenario, 
    dem: true,
    depth_limit: depth,
    ...(rainfallScenario === "triangular" && {triangular_peak: tpeak }), 
    // This spread operator correctly adds 'agent' ONLY if condition is true
    ...(mapType === "susceptibility" && { agent: agentType }) 
    };

    try {
      const response = await axios.post("http://127.0.0.1:8000/daluyan-map/create/", payload);
      if(mapType === "resiliency"){
        await axios.post("http://127.0.0.1:8000/daluyan-map/resilience/run/", {

            session_id: sessionID,
            page_name: pageName,

        });
      }
      setLastFinishedID(sessionID);
      toast.success(`${mapType === 'susceptibility' ? 'Susceptibility' : 'Resiliency'} Map successful!`);
      onMapGenerated(response.data);
    } catch (error) {
      toast.error("Simulation failed.");
      const serverMessage = error.response?.data ? JSON.stringify(error.response.data) : "Simulation failed.";
      console.error("Backend Error:", error.response?.data);
      toast.error(`Server Error!`);
      setLoading(false);
    } 
  };


 const handleDownload = () => {
  if (!lastFinishedID) {
    return toast.error("Please run a simulation first to generate a map.");
  }
  const url = `http://127.0.0.1:8000/export-map-pdf/?sessionId=${lastFinishedID}&page_name=${pageName}`;
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
                <p className="text-sm mb-4"> <span className="font-bold text-slate-800">Predict flood risks in Manila </span>based on real-world environmental data. 
                  Select a rainfall type and depth to see how the city respond to a storm. 
                  The generated map assumes rainfall occurring over a <span className="font-bold text-slate-800">1-hour duration.</span>
                  This tool uses advanced AI trained on Greater Metro Manila's terrain to provide highly localized risk and resiliency maps.
                </p>

                <h2 className="font-bold mb-2">Manila City MetaData:</h2>
                <ol className="list-decimal list-outside pl-5 mb-4 text-sm space-y-2">
                    <li>
                        <span className="font-bold text-slate-800">Lat (Latitude) & Lng (Longitude) :</span> Coordinates used to pinpoint areas in Manila.
                    </li>
                    <li>
                        <span className="font-bold text-slate-800">Hazard (Susceptability) :</span> Probability of Flooding impact in Manila.
                    </li>
                    <li>
                        <span className="font-bold text-slate-800">Hazard (Resiliency) :</span> How vulnerable an area is and its capaccity to cope with flood events.
                    </li>
                    <li>
                        <span className="font-bold text-slate-800">Barangay :</span> local government unit of Manila.
                    </li>
                    <li> 
                      <span className="font-bold text-slate-800">Confidence :</span> How realiable the Model's prediction.
                    </li>


                </ol>


                
                {/* Instructions */}
                <h2 className="font-bold mb-2">Instructions:</h2>
                <ol className="list-decimal list-outside pl-5 mb-4 text-sm space-y-2">
                    <li>
                        Select a <span className="font-bold text-slate-800">Rainfall Scenario</span> (Chicago Method or SCS) to define the temporal distribution of the storm.
                        <RainfallScenarioInfo />
                    </li>
                    <li>
                        Toggle between <span className="font-bold text-slate-800">Susceptibility</span> (predicting hazardous flood depth) or <span className="font-bold text-slate-800">Resiliency</span> (evaluating building-level recovery capacity).
                    </li>
                    <li>
                        Enter the <span className="font-bold text-slate-800">Rainfall Depth</span> within the validated model bounds.
                        <DepthInfo />
                    </li>
                    <li>
                        If using Susceptibility, specify the <span className="font-bold text-slate-800">User Type</span> to weight the model for pedestrian or vehicular movement.
                    </li>
                    <li>
                        Click <span className="font-bold text-slate-800">Simulate</span> to run the ViT-based inference and generate the localized heat map.
                    </li>
                </ol>
                
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 justify-between">
                        

                      {/* Map Type Toggle - Reuse logic like ManilaQuadConfig */}
            <div className="text-center">
              <p className="font-semibold mb-2 text-sm">Type of map</p>
              <div className="flex gap-2 items-center justify-center">
                <Link to="/greater-manila-partition-splitting">
                  <button type="button" className={`btn btn-sm w-[110px] ${mapType === 'susceptibility' ? 'btn-neutral' : 'btn-outline'}`}>
                    Susceptibility
                  </button>
                </Link>
                <Link to="/greater-manila-partition-resiliency">
                  <button type="button" className={`btn btn-sm w-[110px] ${mapType === 'resiliency' ? 'btn-neutral' : 'btn-outline'}`}>
                    Resiliency
                  </button>
                </Link>
              </div>
            </div>

            {/* Environmental Layers */}
            <div className="bg-slate-50 p-3 rounded-lg border mb-3 mt-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Environmental Layers</p>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-semibold text-slate-700">Show Water Bodies</span>
                <input type="checkbox" className="toggle toggle-primary toggle-sm" checked={isWaterOn} onChange={() => onToggleWater(!isWaterOn)} />
              </label>
            </div>

            <RainfallScenario value={rainfallScenario} onChange={setRainfallScenario} region="gmm" />

            {mapType === "susceptibility" && (
              <div className="animate-fadeIn">
                <UserDropdown value={agentType} onChange={setAgentType} />
              </div>
            )}

            <div className="grid grid-cols-1 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-500 ml-1">Rainfall Depth (mm) <DepthInfo /> </span>
                <input 
                    type="text" 
                    className="input input-bordered w-full bg-slate-50" 
                    value={depth} 
                    onChange={(e) => setDepth(parseFloat(e.target.value) || 0)} 
                    placeholder="e.g. 50"
                />
              </label>

              {rainfallScenario === "triangular" && (
                <label className="flex flex-col gap-1 animate-fadeIn">
                  <span className="text-xs font-bold text-slate-500 ml-1">Triangular Peak (0.1 - 0.9)</span>
                  <input 
                    type="text"
                    className="input input-bordered w-full bg-slate-50"
                    value={tpeak}
                    onChange={(e) => {
                      const val = e.target.value;

                      // Allow empty input or valid decimal numbers
                      if (val === "" || /^(\d+(\.\d*)?)$/.test(val)) {
                        setTpeak(val);
                      }
                    }}
                  />
                </label>
              )}
            </div>

            {/* Buttons */}
            <div className="pt-4 space-y-2">
              <button 
                className={`btn w-full ${mapType === 'resiliency' ? 'btn-secondary' : 'btn-primary'}`} 
                type="submit" 
                disabled={loading}
              >
                {loading ? <span className="loading loading-spinner"></span> : `SIMULATE ${mapType.toUpperCase()}`}
              </button>
              <button 
                className="btn btn-outline btn-sm w-full" 
                type="button" 
                onClick={handleDownload} 
                disabled={!lastFinishedID}
              >
                DOWNLOAD PDF
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default GMMPartConfig;