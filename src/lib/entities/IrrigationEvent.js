// /lib/IrrigationEvent.js
let irrigationEvents = [
  {
    id: 1,
    zone_id: "Zone 1",
    event_type: "pump_on",
    duration_minutes: 15,
    trigger_reason: "Soil moisture below threshold",
    water_amount_liters: 120,
    created_date: new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1 hr ago
  },
  {
    id: 2,
    zone_id: "Zone 2",
    event_type: "pump_off",
    duration_minutes: 10,
    trigger_reason: "Manual override",
    water_amount_liters: 80,
    created_date: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 min ago
  }
];

export const IrrigationEvent = {
  async filter(query, sortField = "-created_date", limit = 10) {
    let result = irrigationEvents.filter(e => e.zone_id === query.zone_id);

    if (sortField.startsWith("-")) {
      const field = sortField.slice(1);
      result.sort((a, b) => new Date(b[field]) - new Date(a[field]));
    }
    return result.slice(0, limit);
  },

  async create(data) {
    const event = {
      id: Date.now(),
      created_date: new Date().toISOString(),
      ...data
    };
    irrigationEvents.unshift(event);
    return event;
  }
};
