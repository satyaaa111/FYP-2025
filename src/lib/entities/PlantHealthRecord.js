// lib/PlantHealthRecord.js
import data from "./PlantHealthRecord.json";

export const PlantHealthRecord = {
  filter: (query = {}, sortKey = "-confidence_score", limit = 1) => {
    let result = data;

    // Filtering
    if (query.zone_id) {
      result = result.filter(r => r.zone_id === query.zone_id);
    }
    if (query.health_status) {
      result = result.filter(r => r.health_status === query.health_status);
    }

    // Sorting
    if (sortKey) {
      const desc = sortKey.startsWith("-");
      const key = desc ? sortKey.substring(1) : sortKey;
      result = result.sort((a, b) => {
        if (typeof a[key] === "number") {
          return desc ? b[key] - a[key] : a[key] - b[key];
        }
        return desc
          ? String(b[key]).localeCompare(String(a[key]))
          : String(a[key]).localeCompare(String(b[key]));
      });
    }

    // Limit results
    return result.slice(0, limit);
  }
};
