import * as turf from "@turf/turf";
import geoData from "../assets/world.geo.json";

export function getCountryFromLatLon(lat, lon) {
    const point = turf.point([lon, lat]);

    for (let feature of geoData.features) {
        try {
            if (turf.booleanPointInPolygon(point, feature)) {
                return feature.properties["ISO3166-1-Alpha-2"];
            }
        } catch (e) {
            continue;
        }
    }

    return null;
}