import schema from "./SensorReadingSchema.json";

export const SensorReading = {
  schema,

  // Example dataset (replace with actual data source later)
  records: [
  {
    zone_id: "Zone 1",
    soil_moisture: 55,
    temperature: 26,
    humidity: 69,
    soil_ph: 6.8,
    nitrogen: 40,
    phosphorus: 22,
    potassium: 30,
    light_intensity: 500,
    wind_speed: 3.5,
    created_date: "2025-09-08T10:00:00Z"
  },
  {
    zone_id: "Zone 2",
    soil_moisture: 45,
    temperature: 28,
    humidity: 60,
    soil_ph: 6.5,
    nitrogen: 35,
    phosphorus: 18,
    potassium: 28,
    light_intensity: 600,
    wind_speed: 4.2,
    created_date: "2025-09-08T11:00:00Z"
  }
],


  /**
   * Filter records based on query
   * @param {Object} query key-value pairs to match
   * @param {string|null} sort field to sort by, prefix "-" for descending
   * @param {number|null} limit max number of results
   */
  async filter(query = {}, sort = null, limit = null) {
    let results = this.records;

    // filter
    results = results.filter(record =>
      Object.entries(query).every(([key, value]) => record[key] === value)
    );

    // sort
    if (sort) {
      const [field, order] = sort.startsWith("-")
        ? [sort.slice(1), "desc"]
        : [sort, "asc"];

      results = results.sort((a, b) => {
        if (typeof a[field] === "number" && typeof b[field] === "number") {
          return order === "desc" ? b[field] - a[field] : a[field] - b[field];
        }
        return order === "desc"
          ? String(b[field]).localeCompare(String(a[field]))
          : String(a[field]).localeCompare(String(b[field]));
      });
    }

    // limit
    if (limit) {
      results = results.slice(0, limit);
    }

    return results;
  }
};
