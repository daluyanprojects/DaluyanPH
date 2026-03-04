// Change the function to accept props
import { useState } from "react";
import GeoMap from "../components/GeoMap";
import FloodPatch from "../components/flood_patch_hover/FloodPatch";
import FloodPatchRes from "../components/flood_patch_hover/FloodPatchRes";

const BaseMap = ({ pageName, mapType, ConfigComponent, LegendConfig}) => {

  const [loading, setLoading] = useState(false);
  const [mapVersion, setMapVersion] = useState(0); 
  const [hoverData, setHoverData] = useState(null);
  const [currentSessionID, setCurrentSessionID] = useState(null);
  const [showWaterMarkers, setShowWaterMarkers] = useState(false);

  // We use the prop 'pageId' instead of a hardcoded state
  const handleMapGenerated = (data) => {
    console.log("Scenario saved to database:", data);

    setCurrentSessionID(data.session_id); // store session ID
    setMapVersion(prev => prev + 1); // refresh map
    setLoading(false); // stop loading
  };

       
  const handleMapHover = (data) => {
    setHoverData(data); // update hover data for flood patch
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-full max-w-md md:w-80 flex-shrink-0 border-r border-gray-200 h-full overflow-y-auto z-[1001] relative">
        {/* Pass pageId down to Config */}
       {ConfigComponent ? (
          <ConfigComponent
            setLoading={setLoading} 
            loading={loading} 
            onMapGenerated={handleMapGenerated} 
            pageName={pageName} 
            mapType={mapType}
            onToggleWater={setShowWaterMarkers}
            isWaterOn = {showWaterMarkers}

          />
        ) : <p>Loading Config...</p>}
      </div>

      {/* Map Area */}
      <div className="flex-1 flex flex-col relative min-w-0">

        <div className="flex-1 bg-slate-400 min-h-[400px] w-full flex items-center justify-center relative">
            <GeoMap 
                mapVersion={mapVersion} 
                mapType={mapType} // Dynamic: susceptibility or resiliency
                onHover={handleMapHover}
                sessionId={currentSessionID} 
                pageName={pageName}    
                showWaterMarkers={showWaterMarkers}
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
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[5000]">
              <span className="loading loading-spinner loading-lg text-white"></span>
           </div>
        )}
      </div>
    </div>
  );
};

export default BaseMap;