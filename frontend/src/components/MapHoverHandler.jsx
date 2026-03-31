import { memo, useCallback } from "react";
import { useMapEvents } from "react-leaflet";
import debounce from "lodash/debounce";

const MapHoverHandler = memo(function MapHoverHandler({ onHover, activeLayer, scenarioId, pageName, mapType }) {
  const fetchConfidenceFromDB = useCallback(
    debounce(async (lat, lng) => {
      if (!scenarioId) return;
      try {
        const response = await fetch(`http://localhost:8000/daluyan-map/flood-patch/${scenarioId}/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat, lng, page_name: pageName }),
        });
        if (!response.ok) return;
        const data = await response.json();
        onHover((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            confidence: data.confidence,
            barangay_name: data.barangay_name,
            hazardValue: data.hazardValue,
            poverty: data.poverty,
          };
        });
      } catch (err) {
        console.error("DB Hover Error:", err);
      }
    }, 150),
    [scenarioId, pageName, onHover]
  );

  useMapEvents({
    mousemove: (e) => {
      if (!activeLayer || !onHover) return;
      const { georaster } = activeLayer;
      const map = e.target;
      let hazard = null;

      try {
        if (georaster) {
          const point = map.options.crs.project(e.latlng);
          const { xmin, ymax, pixelWidth, pixelHeight, width, height, values } = georaster;
          const x = Math.floor((point.x - xmin) / pixelWidth);
          const y = Math.floor((ymax - point.y) / pixelHeight);

          if (x >= 0 && y >= 0 && x < width && y < height) {
            const value = values[0][y][x];
            if (value === -1) {
              hazard = 0;
            } else if (value !== null && value !== 255 && !isNaN(value)) {
              hazard = value;
            }
          }
        }
      } catch (err) {
        console.error("Raster read error:", err);
      }

      if (hazard === null) {
        onHover({ latlng: e.latlng, containerPoint: e.containerPoint, hazardValue: null, confidence: null, mapType });
        return;
      }

      onHover({ latlng: e.latlng, containerPoint: e.containerPoint, hazardValue: hazard, barangay_name: null, confidence: "...", mapType });
      fetchConfidenceFromDB(e.latlng.lat, e.latlng.lng);
    },
    mouseout: () => onHover(null),
  });

  return null;
});

export default MapHoverHandler;