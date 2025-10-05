import data from "./SystemAlert.json";

export const SystemAlert = {
  async filter(query = {}, sort = null, limit = null) {
    let results = data.records || []; // records should be an array inside your JSON

    // filter
    results = results.filter(record =>
      Object.entries(query).every(([key, value]) => record[key] === value)
    );

    // sort
    if (sort) {
      const [field, order] = sort.startsWith("-")
        ? [sort.slice(1), "desc"]
        : [sort, "asc"];
      results.sort((a, b) =>
        order === "desc" ? b[field] - a[field] : a[field] - b[field]
      );
    }

    // limit
    if (limit) {
      results = results.slice(0, limit);
    }

    return results;
  }
};
