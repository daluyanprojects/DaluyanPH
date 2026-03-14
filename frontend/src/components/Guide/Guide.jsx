import React from "react";
import ketsana from "../../assets/storm_satellite/ketsana.jpg";
import karding from "../../assets/storm_satellite/karding.jpg";
import pedring from "../../assets/storm_satellite/pedring.jpg";
import ulysses from "../../assets/storm_satellite/ulyssses.png";

const guideData = [
  {
    title: "SCS Front-Loaded",
    storm: "Typhoon Ulysses",
    image: ulysses,
    description:
      "Most rainfall occurs early in the storm, producing an intense spike that can cause rapid runoff and flash flooding.",
  },
  {
    title: "SCS Balanced",
    storm: "Typhoon Pedring",
    image: pedring,
    description:
      "Rainfall is distributed more evenly across the storm duration, producing moderate but sustained flooding.",
  },
  {
    title: "SCS Back-Loaded",
    storm: "Typhoon Karding",
    image: karding,
    description:
      "Rainfall builds gradually and peaks late in the storm; flooding may occur toward the end of the event.",
  },
  {
    title: "Chicago Triangular",
    storm: "Typhoon Ondoy (Ketsana)",
    image: ketsana,
    description:
      "A synthetic design storm where rainfall intensity rises to a peak, then declines. The peak timing can be adjusted to test how rainfall timing affects flooding.",
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