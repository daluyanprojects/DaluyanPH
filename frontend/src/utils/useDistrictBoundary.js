import { useMemo } from "react";
import * as turf from "@turf/turf";
import { DISTRICT_BARANGAYS } from "../constants/districts";

export function useDistrictBoundary(selectedDistrict, barangayGeojson) {
  return useMemo(() => {
    if (!selectedDistrict || !barangayGeojson) return null;

    const targetCodes = DISTRICT_BARANGAYS[selectedDistrict];
    if (!targetCodes || targetCodes.length === 0) return null;

    const codeSet = new Set(targetCodes);

    const features = barangayGeojson.features.filter((f) => {
      if (!codeSet.has(f.properties.psgc_code)) return false;
      const coords = f.geometry?.coordinates;
      if (!coords || coords.length === 0) return false;
      return coords.some((ring) => Array.isArray(ring) && ring.length > 0);
    });

    console.log(`[District] "${selectedDistrict}": ${features.length} features matched`);
    if (features.length === 0) return null;

    const polygons = [];
    for (const feat of features) {
      const geom = feat.geometry;
      if (!geom) continue;
      if (geom.type === "Polygon") {
        polygons.push(turf.polygon(geom.coordinates));
      } else if (geom.type === "MultiPolygon") {
        for (const coords of geom.coordinates) {
          polygons.push(turf.polygon(coords));
        }
      }
    }

    if (polygons.length === 0) return null;

    try {
      const merged = turf.union(turf.featureCollection(polygons));
      if (merged) return merged;
    } catch (e) {
      console.warn(`[District] Union failed:`, e.message);
    }

    return turf.featureCollection(polygons);
  }, [selectedDistrict, barangayGeojson]);
}