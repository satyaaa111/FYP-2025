import connectToDatabase from '../mongodb';
import PlantHealthRecord from '@/models/PlantHealthRecordSchema';

export const PlantHealthR = {
  /**
   * Filter plant health records.
   * @param {object} query - MongoDB query object (e.g., { zone_id: "Zone 1" })
   * @param {string} sortKey - Field to sort by (e.g., "-confidence_score")
   * @param {number} limit - Max number of results
   */
  async filter(query = {}, sortKey = "-confidence_score", limit = 1) {
    try {
      await connectToDatabase();
      
      const sortOptions = {};
      const desc = sortKey.startsWith("-");
      const key = desc ? sortKey.substring(1) : sortKey;
      sortOptions[key] = desc ? -1 : 1;

      const result = await PlantHealthRecord.find(query)
        .sort(sortOptions)
        .limit(limit)
        .lean();
        
      return result;
    } catch (error) {
      console.error('Error filtering plant health records:', error);
      return [];
    }
  }
};