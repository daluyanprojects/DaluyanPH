import { Route, Routes } from "react-router";
// pages-----------------------------
import HomePage from "./pages/HomePage";
import BaseMap from "./pages/BaseMap";
//-- configs & legends
import Legend from "../src/components/Legends/Legend";
import LegendResiliency from "../src/components/Legends/Legend-Res";

import ManilaPartConfig from "./components/ManilaPartConfig";
import ManilaQuadConfig from "./components/ManilaQuadConfig";
import GMMPartConfig from "./components/GMMPartConfig";
import GMMQuadConfig from "./components/GMMQuadConfig";
// ----------------------------------------
import toast from "react-hot-toast";
import { useEffect } from "react";
import myIcon from "./assets/my-icon.png";
import 'leaflet/dist/leaflet.css';

const App = () => {
  useEffect(() => {
    document.title = "DaluyanPH";

    const sizes = [
    { size: "16x16", file: myIcon },  
    { size: "32x32", file: myIcon },
    { size: "192x192", file: myIcon },
  ];

  sizes.forEach(({size, file}) => {
    const link = 
    document.querySelector("link[rel~='icon']") ||
    document.createElement("link");
    link.rel = "icon";
    link.href = myIcon; 
    link.sizes = "192x192";
    document.head.appendChild(link);

  });
  }, []);

  return <div data-theme="nord"> 
      <Routes>
        <Route path="/" element={<HomePage />} /> 


      {/* Manila Quadrant Susceptibility */}

       <Route path="/manila-quadrant-splitting" 
          element={
            <BaseMap 
              pageName="manila-quadrant" 
              mapType="susceptibility" 
              ConfigComponent={ManilaQuadConfig} 
              LegendConfig={Legend} 
            />
          }/>

      <Route path="/manila-quadrant-resiliency" 
          element={
            <BaseMap 
              pageName="manila-quadrant" 
              mapType="resiliency" 
              ConfigComponent={ManilaQuadConfig} 
              LegendConfig={LegendResiliency} 
            />
          } />

      {/* Manila Partition Susceptibility */}

      <Route path="/manila-partition-splitting" 
          element={
            <BaseMap 
              pageName="manila-partition" 
              mapType="susceptibility" 
              ConfigComponent={ManilaPartConfig} 
              LegendConfig={Legend} 
            />
          }/>

      <Route path="/manila-partition-resiliency" 
          element={
            <BaseMap 
              pageName="manila-partition" 
              mapType="resiliency" 
              ConfigComponent={ManilaPartConfig} 
              LegendConfig={LegendResiliency} 
            />
          } />


        {/* GMM  Quad Susceptibility */}

          <Route path="/greater-manila-quadrant-splitting" 
          element={
            <BaseMap 
              pageName="gmm-quadrant" 
              mapType="susceptibility" 
              ConfigComponent={GMMQuadConfig} 
              LegendConfig={Legend} 
            />
          }/>

      <Route path="/greater-manila-quadrant-resiliency" 
          element={
            <BaseMap 
              pageName="gmm-quadrant" 
              mapType="resiliency" 
              ConfigComponent={GMMQuadConfig} 
              LegendConfig={LegendResiliency} 
            />
          } />

        
        {/* GMM  Partition Susceptibility */}

        <Route path="/greater-manila-partition-splitting" 
          element={
            <BaseMap 
              pageName="gmm-partition" 
              mapType="susceptibility" 
              ConfigComponent={GMMPartConfig} 
              LegendConfig={Legend} 
            />
          }/>

      <Route path="/greater-manila-partition-resiliency" 
          element={
            <BaseMap 
              pageName="gmm-partition" 
              mapType="resiliency" 
              ConfigComponent={GMMPartConfig} 
              LegendConfig={LegendResiliency} 
            />
          } />


      </Routes>

    </div>;
};

export default App;
