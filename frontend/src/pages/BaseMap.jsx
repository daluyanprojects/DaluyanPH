// Change the function to accept props
import { useState, useEffect } from "react";
import GeoMap from "../components/GeoMap";
import FloodPatch from "../components/flood_patch_hover/FloodPatch";
import FloodPatchRes from "../components/flood_patch_hover/FloodPatchRes";
import DaluyanGIF from "../assets/Daluyan.gif"
import Logo from "../assets/Daluyan_PH_Logo.png"
import { Link } from 'react-router-dom';

const BaseMap = ({ pageName, mapType, ConfigComponent, LegendConfig}) => {

  const [loading, setLoading] = useState(false);
  const [mapVersion, setMapVersion] = useState(0); 
  const [hoverData, setHoverData] = useState(null);
  const [currentSessionID, setCurrentSessionID] = useState(null);
  const [showWaterMarkers, setShowWaterMarkers] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isBuildingsOn, setIsBuildingsOn] = useState(false)


  useEffect(() => {
  let interval;
  if (loading && currentSessionID) {
    // Add initial delay before first poll
    const startPolling = setTimeout(() => {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`http://localhost:8000/api/progress/${currentSessionID}/`);
          
          if (!res.ok) {
            console.error("Progress endpoint error:", res.status);
            return;
          }
          
          const data = await res.json();
          
          // Only update if we get a valid percentage
          if (typeof data.percentage === 'number') {
            setProgress(data.percentage);
            
            if (data.percentage === 100) {
              clearInterval(interval);
            }
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 1000);
    }, 500); // Wait 500ms before starting to poll
    
    return () => {
      clearTimeout(startPolling);
      if (interval) clearInterval(interval);
    };
  }
}, [loading, currentSessionID]);




  // We use the prop 'pageId' instead of a hardcoded state
const handleMapGenerated = (data) => {
  setProgress(100); // Force 100% on completion
  setTimeout(() => {
    setMapVersion(prev => prev + 1);
    setLoading(false);
  }, 500); // Give the user half a second to see the 'Complete' state
};

       
  const handleMapHover = (data) => {
    setHoverData(data); // update hover data for flood patch
  };



  return (
    <div className="flex h-screen bg-gray-50">

      <header className="fixed top-0 left-0 w-full z-[1002] border-b border-gray-200 bg-white">
      <div className="px-6 py-3 flex items-center">
        <Link to="/">
        <img src={Logo} alt="logo" className="h-6 w-auto"/>
        </Link>
      </div>
    </header>
      
      <div className="w-full max-w-md md:w-80 flex-shrink-0 border-r border-gray-200 h-full overflow-y-auto z-[1001] relative mt-[60px]">
        {/* Pass pageId down to Config */}
       {ConfigComponent ? (
          <ConfigComponent
            setLoading={setLoading} 
            loading={loading} 
            onMapGenerated={handleMapGenerated} 
            setCurrentSessionID={setCurrentSessionID}
            pageName={pageName} 
            mapType={mapType}
            onToggleWater={setShowWaterMarkers}
            isWaterOn = {showWaterMarkers}
            onToggleBuilding={setIsBuildingsOn} 
            isBuildingsOn={isBuildingsOn}

          />
        ) : <p>Loading Config...</p>}
      </div>

      {/* Map Area */}
      <div className="flex-1 flex flex-col relative min-w-0 ">

        <div className="flex-1 bg-slate-400 min-h-[400px] w-full flex items-center justify-center relative">
            <GeoMap 
                mapVersion={mapVersion} 
                mapType={mapType} // Dynamic: susceptibility or resiliency
                onHover={handleMapHover}
                sessionId={currentSessionID} 
                pageName={pageName}    
                showWaterMarkers={showWaterMarkers}
                isBuildingsOn={isBuildingsOn}
              />
            {hoverData && (
                hoverData.mapType === "resiliency" 
                  ? <FloodPatchRes hoverData={hoverData} /> 
                  : <FloodPatch hoverData={hoverData} />
              )}
        </div>

        <div className="absolute bottom-4 right-4 z-[2000]">
          {LegendConfig && (
          <div className="absolute bottom-4 right-4 z-[2000]">
            <LegendConfig />
          </div>
        )}
        </div>

    {loading && (
  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md flex flex-col items-center justify-center z-[5000]">
    <div className="w-full max-w-xs min-h-[100px] min-w-[150] bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-700">
      {/* 2. THE GIF (Now outside the progress bar) */}
      <div className="flex justify-center mb-6">
        <img 
          src={DaluyanGIF}
          alt="Daluyan Loading..."
          className="w-[100px] h-[50px] object-contain" 
        />
      </div>

      {/* 3. PROGRESS BAR CONTAINER */}
      <div className="space-y-3">
        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden border border-slate-600">
          <div 
            className="bg-blue-500 h-full transition-all duration-700 ease-in-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* 4. PERCENTAGE METRICS */}
        <div className="flex justify-between text-[10px] text-slate-400 font-mono uppercase tracking-widest">
          <span>{progress}%</span>
          <span className="animate-pulse">
            {progress === 100 ? "Complete" : "Processing..."}
          </span>
        </div>
      </div>
      
      {/* 5. LOADING DOTS */}
      <div className="mt-6 flex justify-center">
        <span className="loading loading-dots loading-md text-blue-400"></span>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default BaseMap;