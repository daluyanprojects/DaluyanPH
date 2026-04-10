import React from "react";
import ketsana from "../../assets/storm_satellite/ketsana.jpg";
import carina from "../../assets/storm_satellite/carina.jpg";
import paeng from "../../assets/storm_satellite/paeng.png";
import ulysses from "../../assets/storm_satellite/ulyssses.png";

const guideData = [
  {
    title: "SCS Front-Loaded",
    storm: "Typhoon Ondoy",
    image: ketsana,
    description:
      "While Ondoy was a long-duration event the initial phases in Metro Manila exhibited frontloaded characteristics where the most extreme rainfall intensities occurred early in the day (the cloudburst phase), quickly overwhelming the citys drainage capacity before the storm had even reached its midpoint.",
  },
  {
    title: "SCS Balanced",
    storm: "Typhoon Carina",
    image: carina,
    description:
      "Recent studies on the 2024 monsoon-enhanced typhoons show that while the total volume is high, many individual storm cells within the Habagat flow follow a balanced distribution, peaking as the core of a convective cell passes directly over a rain gauge",
  },
  {
    title: "SCS Back-Loaded",
    storm: "Typhoon Ulysses",
    image: ulysses,
    description:
      "Ulysses followed a series of other storms (like Rolly). By the time its heaviest backloaded bands hit Rizal and Marikina, the soil was already at 100% capacity. The peak rainfall at the tail end of the event caused the massive, rapid rise of the Marikina River.",
  },
  {
    title: "Chicago Triangular",
    storm: "Typhoon Paeng",
    image: paeng,
    description:
      "Paeng had convective bands that acted like triangular spikes. In just 30–60 minutes, a location would receive nearly 50–80mm of rain, overwhelming urban gutters instantly",
  },
];

const GuideLaunch = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-8">

        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#133d62]">
            Understanding Rainfall Scenarios
          </h2>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            These rainfall distributions represent different storm behaviors
            used in hydrologic flood modeling.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {guideData.map((item, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition hover:-translate-y-2"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-44 object-cover group-hover:scale-105 transition duration-500"
              />

              <div className="p-5 space-y-3">
                <h3 className="text-lg font-bold text-[#133d62]">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-500 italic">
                  Example: {item.storm}
                </p>

                <p className="text-sm text-slate-700">
                  {item.description}
                </p>

                {/*
                <div className="text-sm text-slate-600 pt-2 border-t">
                  <p><strong>24 hr rainfall:</strong> {item.rainfall24}</p>
                  <p><strong>1 hr rainfall :</strong> {item.rainfall1}</p> 
                </div> */}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default GuideLaunch;