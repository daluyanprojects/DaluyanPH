import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import parseGeoraster from "georaster";
import GeoRasterLayer from "georaster-layer-for-leaflet";
import "leaflet/dist/leaflet.css";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import waterMarker from "../assets/water.png"
import { GeoJSON } from "react-leaflet";

// imports from other files
import { useDistrictBoundary } from "../utils/useDistrictBoundary";
import MapHoverHandler from "./MapHoverHandler"

const colors = ["rgba(0,0,0,0)", "#C6DBEF", "#6BAED6", "#2171B5", "#08306B"];
const resilienceColors = {
  0: "rgba(0,0,0,0)", 
  1: "#22c55e",  
  2: "#f97316",  
  3: "#961620",
};

const opacity = 0.7;
const waterIcon = new L.Icon({
    iconUrl: waterMarker,
    iconSize: [25, 25],     // Size of the icon
    iconAnchor: [17, 35],    // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -35],   // Point from which the popup should open relative to the iconAnchor
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null
});


function GeoRaster({ mapVersion, mapType, sessionId, pageName, setGlobalLayer }) {
  const map = useMap();
  const [layer, setLayer] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (mapVersion > 0 && sessionId && pageName) {
      (async () => {
        try {
          const fetchUrl = `http://localhost:8000/daluyan-map/?sessionId=${sessionId}&page_name=${pageName}&type=${mapType}&tif=true`;
          const res = await fetch(fetchUrl);
          if (!res.ok) throw new Error(`Failed to fetch TIF`);

          const arrayBuffer = await res.arrayBuffer();
          const georaster = await parseGeoraster(arrayBuffer);
          console.log("TIF Projection:", georaster.projection)
          if (cancelled) return;

          const pixelValuesToColorFn = (values) => {
            const v = values[0];
            if (v === 255 || v === null || isNaN(v)) return null;
            if (mapType === "resiliency") return resilienceColors[v] ?? null;
            return colors[v] ?? null;  // existing flood colors
          };

          const grLayer = new GeoRasterLayer({
            georaster,
            opacity,
            resolution: 256,
            pixelValuesToColorFn,
          });

          if (layer) map.removeLayer(layer);
          grLayer.addTo(map);
          setLayer(grLayer);
        
          if (setGlobalLayer) setGlobalLayer({ layer: grLayer, georaster });

        } catch (err) {
          console.error("GeoTIFF error:", err);
        }
      })();
    }
    return () => { 
      cancelled = true; 
      if (layer) map.removeLayer(layer); 
    };
  }, [mapVersion, mapType, map, sessionId, pageName]);
  return null;
}



export default function GeoMap({ mapVersion, 
  mapType, 
  onHover, 
  sessionId, 
  pageName, 
  showWaterMarkers, 
  isBuildingsOn, 
  selectedDistrict, 
  barangayGeojson 
}) {
  const [activeLayer, setActiveLayer] = useState(null);
  const [waterBodies, setWaterBodies] = useState([]);
  const [buildings, setBuildings] = useState(null);
  const districtBoundary = useDistrictBoundary(selectedDistrict, barangayGeojson);

 useEffect(() => {
  if (isBuildingsOn && !buildings) {
    fetch("http://localhost:8000/api/buildings/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(res => {
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        return res.json();
      })
      .then(data => {
      
        setBuildings(data); 
      })
      .catch(err => console.error("Error fetching buildings:", err));
  }
}, [isBuildingsOn]);


  useEffect(() => {
    if (showWaterMarkers && waterBodies.length === 0) {
      fetch("http://localhost:8000/water-bodies/")
        .then(res => res.json())
        .then(data => setWaterBodies(data))
        .catch(err => console.error("Error fetching water bodies:", err));
    }
  }, [showWaterMarkers, waterBodies.length]);


  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={[14.5995, 120.9842]}
        zoom={13}
        style={{ height: "100%", width: "100%", backgroundColor: "#020617" }} 
        key={mapVersion}
        zoomControl={false}
      >
        <TileLayer 
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" 
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        <GeoRaster 
          mapVersion={mapVersion} 
          mapType={mapType} 
          sessionId={sessionId} 
          pageName={pageName} 
          setGlobalLayer={setActiveLayer} 
        />

        {/* District highlight boundary */}
        {districtBoundary && (
          <GeoJSON
            key={selectedDistrict}   /* force remount when district changes */
            data={districtBoundary}
            style={{
              color: "#F97316",
              weight: 2,
              fillOpacity: 0,
            }}
          />
        )}
      

     {isBuildingsOn && buildings && (
          <GeoJSON 
            data={buildings} 
            style={{ 
              color: '#000000', 
              weight: 1.5,
              fillOpacity: 0.4,
              fillColor: "rgba(0,0,0,0)"
            }} 
          />
        )}


        {sessionId && (
          <MapHoverHandler 
            onHover={onHover} 
            activeLayer={activeLayer} 
            scenarioId={sessionId}
            pageName={pageName}
            mapType={mapType} 
          />
        )}

        {showWaterMarkers && waterBodies.map((wb) => (
          <Marker 
            key={wb.id} 
            position={[wb.lat, wb.lng]} 
            icon={waterIcon}
          >
            <Popup maxWidth={300}>
              <div className="flex flex-col gap-2 p-1">
                <h3 className="font-bold text-slate-900 border-b pb-1 text-sm">
                  {wb.name} 
                  <span className="text-[10px] text-blue-600 uppercase ml-2 px-1 bg-blue-50 rounded">
                    {wb.water_type}
                  </span>
                </h3>
                
                {wb.image_url ? (
                  <img 
                    src={`http://localhost:8000${wb.image_url}`} 
                    alt={wb.name} 
                    className="w-full h-40 object-cover rounded-md shadow-sm border border-slate-200"
                    // Fallback for broken images
                    onError={(e) => { 
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image+Available'; }}
                  />
                ) : (
                  <div className="w-full h-32 bg-slate-100 flex items-center justify-center text-slate-400 text-xs rounded">
                    No image available
                  </div>
                )}
                
                <p className="text-xs text-slate-600 leading-tight italic">
                  {wb.description || "No description provided."}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
        
      </MapContainer>
    </div>
  );
}