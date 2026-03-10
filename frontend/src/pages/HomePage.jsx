import BgImg from "../assets/homepage_bg.png";
import Logo from "../assets/daluyan_white.png";
import Logo2 from "../assets/Daluyan_PH_Logo.png"
import ModelLaunch from "../components/ModelLaunch";


import Sec1BG from "../assets/city_skyline.png"
import PHdots from "../assets/ph_dots.png"

import manilaRock from "../assets/manila_water_rocks.jpg"
import rizal from "../assets/rizal.jpg"
import intra from "../assets/intra.jpg"
import recto from "../assets/recto.jpg"

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

  <div className="min-h-screen scroll-smooth flex flex-col  bg-gradient-to-b from-[#0f4c81] via-[#1e6fa8] to-[#63b3ed] ">
    {/* SECTION 1 - MODEL LAUNCH/HOME */}
    <section id="home" className="relative w-full min-h-screen bg-gradient-to-b from-[#0f4c81] via-[#1e6fa8] to-[#63b3ed]">
  
      {/* Skyline */}
      <div className="absolute inset-0 z-0">
        <img src={Sec1BG} alt="Skyline" className="w-full h-full object-cover opacity-20" />
      </div>

      {/* PH Dots */}
      <div className="absolute top-0 right-0 z-0 h-full w-1/2 pointer-events-none">
        <img src={PHdots} alt="PH Dots" className="h-full w-full object-cover opacity-50" />
      </div>

      {/*  Header */}
     <header className="fixed top-0 left-0 w-full z-50 border-b border-white bg-[#0f4c81]/50 backdrop-blur-md transition-all">
         <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between text-white">
            <div className="flex items-center">
              <img src={Logo} alt="logo" className="w-25 h-6"/> 
            </div>
            <nav className="hidden md:flex gap-10 font-medium">
              <a href="#home" className="hover:text-blue-200 transition-colors">Home</a>
              <a href="#about" className="hover:text-blue-200 transition-colors">About Us</a>
              <a href="#contact" className="hover:text-blue-200 transition-colors">Contact Us</a>
            </nav>
        </div>
      </header>

      {/* LAYER 4: Content */}
      <div className="relative z-10 flex flex-col items-center pt-20">
        <div className="text-center text-4xl md:text-6xl font-sans text-white pt-5 p-10 max-w-4xl"> 
          A data-driven platform for flood awareness, preparedness, and public safety. 
        </div>

        <div className="max-w-7xl mx-auto p-10 justify-items-center">
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
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-[calc(100%+1.3px)] h-[100px] rotate-180"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-white"
          ></path>
        </svg>
      </div>
    </section>
  
          

    {/* SECTION 2  - ABOUT US */}
    <section id="about" className="relative w-full py-24 bg-white">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
      
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-[#133d62]">Where It All Begins</h2>
          <p className="text-slate-700 leading-relaxed text-lg">
            DaluyanPH is a web-based platform that aims to support disaster risk reduction in Manila City. 
            Our system helps visualize and monitor flood accumulation in real time, providing residents 
            and authorities with accessible data to make informed decisions during heavy rainfall. 
            By combining technology and community awareness, DaluyanPH strives to build a safer 
            and more resilient city.
          </p>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img src={manilaRock} alt="Manila Skyline" className="w-full h-full object-cover" />
        </div>

      </div>


      <div className="relative">
        <div className="bg-[#1b91c1] rounded-3xl p-12 text-center text-white shadow-xl max-w-5xl  mx-auto my-16 pb-40">
          <h2 className="text-3xl font-bold mb-6">The Future We're Building</h2>

          <div className="space-y-4 text-lg opacity-90 max-w-2xl mx-auto">
            <p>
              To build a safer and more resilient Manila City through accessible
              technology that empowers citizens to prepare for and respond to flooding.
            </p>

            <p>
              Our mission is to provide a reliable web platform that visualizes flood
              accumulation, supports disaster preparedness, and promotes data-driven
              decision-making for both residents and local authorities.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6 -mt-40 relative z-10">

          <div className="rounded-3xl overflow-hidden shadow-xl h-80 border-2 border-white">
            <img src={intra} alt="Intramuros" className="w-full h-full object-cover" />
          </div>

          <div className="rounded-3xl overflow-hidden shadow-xl h-80 border-2 border-white">
            <img src={rizal} alt="Rizal" className="w-full h-full object-cover" />
          </div>

          <div className="rounded-3xl overflow-hidden shadow-xl h-80 border-2 border-white">
            <img src={recto} alt="Recto" className="w-full h-full object-cover" />
          </div>

        </div>

      </div>
</section>

{/* SECTION 3 - CONTACT US */}
<section id="contact" className="relative overflow-hidden bg-gradient-to-b from-[#0f4c81] to-[#1e6fa8] text-white py-16 px-10">
  <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
    <img 
      src={PHdots} 
      alt="" 
      className="h-full w-full object-cover md:object-left" 
    />
  </div>

  
  <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center gap-10">
    
    
    <div className="space-y-4">
      <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
      <div className="space-y-2 opacity-90">
        <p>charlize_brodeth@dlsu.edu.ph</p>
        <p>candice_fernandez@dlsu.edu.ph</p>
        <p>miko_santos@dlsu.edu.ph</p>
        <p>alliyah_zulueta@dlsu.edu.ph</p>
      </div>
    </div>

    
    <div className="hidden md:block w-px h-32 bg-white/50"></div>

    
    <div className="space-y-4">
      <h2 className="text-3xl font-bold mb-6">A Project Initiative of</h2>
      <div className="space-y-2 opacity-90">
        <p>Charlize Kirsten M. Brodeth</p>
        <p>Candice Aura T. Fernandez</p>
        <p>Miko L. Santos</p>
        <p>Alliyah Gaberielle D. Zulueta</p>
      </div>
    </div>
  </div>
</section>



    {/* FOOTER */}

    <footer className="footer footer-center bg-base-300 text-base-content p-4 border-t-4 border-[#133d62]">
      <aside className="flex items-center gap-5">
        <img src={Logo2} alt="logo" className="w-25 h-6 mr-6"/> 
        <p className="text-[#133d62] ml-3">Predicative Model Research   |  2026</p>
      </aside>
    </footer>
    
  </div>

    
  
  );
};

export default HomePage;
