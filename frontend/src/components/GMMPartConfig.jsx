import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import UserDropdown from "../utils/UserDropdown";
import { Info } from "lucide-react";
import RainfallScenarioInfo from "../components/Info_Cards/RainScenarioInfo";
import RainfallScenario from "../utils/RainfallScenario"
import DepthInfo from "./Info_Cards/depth_info";
import HomeIcon from "../assets/home.png"
import Logo from "../assets/Daluyan_PH_Logo.png"



function GMMPartConfig({ setLoading, loading, onMapGenerated, setCurrentSessionID, pageName, mapType, onToggleWater, isWaterOn, isBuildingsOn, onToggleBuilding }) {
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
  
  const url = `http://127.0.0.1:8000/export-map-pdf/?sessionId=${lastFinishedID}&page_name=${pageName}&mapType=${mapType}`;
  
  console.log("Attempting PDF Download with URL:", url);
  const win = window.open(url, "_blank");
  if (!win) {
    toast.error("Popup blocked! Please allow popups for this site.");
  }
};

  return (
    <div className="flex min-h-screen bg-white">
        <div className="w-full max-w-md bg-white flex flex-col mx-auto shadow-md">  
            <div className="p-4 flex-1 flex flex-col justify-between">
            <div className= "mb-4">
              <h3 className="text-slate-900 font-bold mb-2">Manila Susceptability & Resiliency</h3>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Predict localized flood risks and infrastructure capacity using AI trained on Metro Manila's terrain data.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-[11px] text-slate-700 bg-white p-2 rounded border border-slate-200">
                <span className="font-bold text-blue-600">Duration:</span> 1-Hour Storm
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-700 bg-white p-2 rounded border border-slate-200">
                <span className="font-bold text-blue-600">Model:</span> ViT
              </div>
            </div>


            </div>
            

            <div className="my-4 border-t border-gray-900/10"></div>




    <div className=" m-2 mb-3">
            <h2 className="text-blue-600 font-bold mb-1 text-lg">Simulation Control Panel</h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-6">Workflow Setup & Parameters</p>

            <div className="grid grid-cols-1 gap-4 text-[12px]">
              {/* Row 1: Setup */}
              <div className="grid grid-cols-2 gap-1">
                <div className="bg-slate-100/30 p-4 rounded-xl border border-slate-400/15">
                  <span className="font-bold text-slate-600 block mb-1 uppercase text-[10px]">1. Rainfall <RainfallScenarioInfo /></span>
                  <p className="text-slate-600 leading-snug">Choose Chicago or SCS method.</p>
                </div>

                <div className="bg-[#6ab9b4]/5 p-4 rounded-xl border border-[#50a09b]/10">
                  <span className="font-bold text-slate-600 block mb-1 uppercase text-[10px]">2. Depth <DepthInfo /></span>
                  <p className="text-slate-600 leading-snug">Set limit.</p>
                </div>
              </div>

              {/* Row 2: Analysis Mode */}
              <div className="bg-slate-100/50 p-4 rounded-xl border border-slate-400/10">
                <span className="font-bold text-slate-600 block mb-1 uppercase text-[10px]">3. Analysis Mode</span>
                <p className="text-slate-600 leading-tight">
                  Toggle <span className="font-semibold text-slate-900">Susceptibility</span> (depth) or 
                  <span className="font-semibold text-slate-900"> Resiliency</span> (capacity).
                </p>
              </div>

          {/* Row 3: Final Steps */}
          <div className="grid grid-cols-2 gap-1">
            <div className="bg-[#6ab9b4]/5  p-4 rounded-xl border border-[#50a09b]/10">
              <span className="font-bold text-slate-600 block mb-1 uppercase text-[10px]">4. User Type</span>
              <p className="text-slate-600 leading-snug">Weight for Pedestrian or Vehicular movement (Susceptibility only).</p>
            </div>
            <div className="bg-blue-50/50 p-4 rounded-xl border-2 border-blue-500/10 flex items-center justify-center text-center">
              <p className="text-blue-900 font-bold uppercase tracking-widest text-xs">5. Simulate</p>
            </div>
          </div>
        </div>
    </div>


    <div className="my-4 border-t border-gray-900/10 mb-7"></div>


              
                <div className="mb-3 bg-slate-900/95 p-1.5 rounded-lg border border-emerald-900/50 text-white text-[10px]  shadow-[0_8px_20px_rgba(0,0,0,0.45)] 
                  transform -translate-y-1">
                  <h2 className="text-blue-400 font-bold mb-1 border-b border-emerald-900/30 pb-1">
                    Manila City - Analysis Definition
                  </h2>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1">
                    <p><span className="text-slate-500 font-bold">Lat/Lng:</span> Area coordinates.</p>
                    <p><span className="text-slate-500 font-bold">Hazard (S):</span> Flood probability.</p>
                    <p><span className="text-slate-500 font-bold">Hazard (R):</span> Capacity to recover.</p>
                    <p><span className="text-slate-500 font-bold">Barangay:</span> Local government unit.</p>
                    <p><span className="text-slate-500 font-bold">Confidence:</span> Model reliability.</p>
                    <p><span className="text-slate-500 font-bold">Economic Class:</span> Poverty/income level</p>
                  </div>
              </div>  
 

              <div className="my-4 border-t border-gray-900/10"></div>


                <form onSubmit={handleSubmit} className="flex flex-col flex-1 justify-between">
                        

            {/* Map Type Toggle - Reuse logic like ManilaQuadConfig */}
            <div className="text-center">
              <p className="font-semibold mb-2 text-sm">Type of map</p>
              <div className="flex gap-2 items-center justify-center">

                  <button type="button" className={`btn btn-sm w-[110px] ${mapType === 'susceptibility' ? 'btn-neutral' : 'btn-outline'}`}
                  onClick={() => window.location.href = "/greater-manila-partition-splitting"}
                  >
                    Susceptibility
                  </button>

                  <button type="button" className={`btn btn-sm w-[110px] ${mapType === 'resiliency' ? 'btn-neutral' : 'btn-outline'}`}
                  onClick={() => window.location.href = "/greater-manila-partition-resiliency"}>
                    Resiliency
                  </button>

              </div>
            </div>

            {/* Environmental Layers */}
            <div className="bg-slate-50 p-3 rounded-lg border mb-3 mt-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Environmental Layers</p>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-semibold text-slate-700">Show Bodies of Water</span>
                <input type="checkbox" className="toggle toggle-primary toggle-sm" checked={isWaterOn} onChange={() => onToggleWater(!isWaterOn)} />
              </label>
            </div>


            {mapType === "resiliency" && (
              <div className="bg-slate-50 p-3 rounded-lg border mb-3 mt-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Building Layer</p>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-semibold text-slate-700">Show Buildings</span>
                <input type="checkbox" className="toggle toggle-primary toggle-sm" checked={isBuildingsOn} onChange={() => onToggleBuilding(!isBuildingsOn)} />
              </label>
            </div>
            )}

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