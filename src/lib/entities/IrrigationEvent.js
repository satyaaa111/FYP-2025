import connectToDatabase from '../mongodb';
import IrrigationEvent from '@/models/IrrigationSchema';

export const IrrigationE = {
  /**
   * Filter irrigation events based on query.
   * @param {object} query - MongoDB query object (e.g., { zone_id: "Zone 1" })
   * @param {string} sortField - Field to sort by (e.g., "-created_date")
   * @param {number} limit - Max number of results
   */
  async filter(query, sortField = "-created_date", limit = 10) {
    try {
      await connectToDatabase();

      // Convert sortField string to MongoDB sort object
      const sortOptions = {};
      const field = sortField.startsWith("-") ? sortField.slice(1) : sortField;
      sortOptions[field] = sortField.startsWith("-") ? -1 : 1;

      const result = await IrrigationEvent.find(query)
        .sort(sortOptions)
        .limit(limit)
        .lean();
        
      return result;
    } catch (error) {
      console.error('Error filtering irrigation events:', error);
      return [];
    }
  },

  /**
   * Create a new irrigation event.
   * @param {object} data - Data for the new event
   */
  async create(data) {
    try {
      await connectToDatabase();
      // The 'created_date' is set by default from the schema
      const event = await IrrigationEvent.create(data);
      return event.toObject(); // Convert Mongoose doc to plain object
    } catch (error) {
      console.error('Error creating irrigation event:', error);
      return null;
    }
  }
};