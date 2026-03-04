import Navbar from "../components/navbars/Navbar";
import BgImg from "../assets/homepage_bg.png";
import Logo from "../assets/Daluyan_PH_Logo.png";
import ModelLaunch from "../components/ModelLaunch";
import { Link } from "react-router-dom";
import { LayoutGrid, CloudRain, Map, Droplets } from 'lucide-react';

const modelData = [
  {
    title: "Greater Manila Rainfall Partition",
    subtitle: "Simulate Flood Prediction",
    Link: "/greater-manila-partition-splitting",
    Icon: CloudRain
  }
]


const HomePage = () => {
  return (

   <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: `linear-gradient(rgba(30, 41, 59, 0.7), rgba(30, 41, 59, 0.7)), url(${BgImg})` }}
    >

    <Navbar />

    {/* Title */}
    <div className="text-center text-5xl font-sans text-white pt-5 p-3"> Launch your Simulation Model</div>
      
    {/* Model Launchers */}
    <div className=" max-w-7xl mx-auto p-10 justify-item-center">
      {modelData.map((item, index) => (
        <ModelLaunch
          key={index}
          title={item.title}
          subtitle={item.subtitle}
          launchLink={item.Link}
          Icon={item.Icon}
        />
      ))}
    </div> 
      

      {/* About Us */}
      <div className="w-full max-h-fit bg-slate-800 text-white p-11 grid grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">About Us</h2>
              <p>
                <span className="font-bold text-xl"> DaluyanPH </span>is a web-based platform that aims to support disaster risk reduction in Manila City. 
                Our system helps visualize and monitor flood accumulation in real time, providing residents 
                and authorities with accessible data to make informed decisions during heavy rainfall. 
                By combining technology and community awareness, DaluyanPH strives to build a safer and more resilient city.
              </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Vision & Mission</h2>
            <p>
              To build a safer and more resilient Manila City through accessible technology 
              that empowers citizens to prepare for and respond to flooding.<br></br>
              Our mission is to provide a reliable web platform that visualizes flood accumulation, 
              supports disaster preparedness, and promotes data-driven decision-making 
              for both residents and local authorities.
              </p>
          </div>
      </div>

    {/* Footer */}
    <footer className="footer bg-base-200 text-base-content p-10">
      <aside className="flex flex-col items-center">
        <img src={Logo} alt="DaluyanPH Logo" className="items-center w-22 h-8 mb-1" />
        <p className="text-center">
          DaluyanPH
          <br />
          Predictive model research
        </p>
      </aside>

      <nav>
        <h6 className="footer-title">Contact Us</h6>
        <a className="link link-hover">charlize_brodeth@dlsu.edu.ph</a>
        <a className="link link-hover">candice_fernandez@dlsu.edu.ph</a>
        <a className="link link-hover">miko_santos@dlsu.edu.ph</a>
        <a className="link link-hover">alliyah_zulueta@dlsu.edu.ph</a>
      </nav>

      <nav>
        <h6 className="footer-title">Project of</h6>
        <a className="link link-hover">Charlize Kirsten M. Brodeth</a>
        <a className="link link-hover">Candice Aura T. Fernandez</a>
        <a className="link link-hover">Miko L. Santos</a>
        <a className="link link-hover">Alliyah Gaberielle D. Zulueta</a>
      </nav>
    </footer>
    </div>

    

  
  );
};

export default HomePage;
