import connectToDatabase from '../mongodb';
import SensorReading from '@/models/SensorReadingSchema';

export const SensorR = {

  async filter(query = {}, sort = null, limit = null) {
    try {
      await connectToDatabase();
      
      const queryBuilder = SensorReading.find(query);

      if (sort) {
        const sortOptions = {};
        const [field, order] = sort.startsWith("-")
          ? [sort.slice(1), -1] // -1 for descending
          : [sort, 1];          // 1 for ascending
        sortOptions[field] = order;
        queryBuilder.sort(sortOptions);
      }

      if (limit) {
        queryBuilder.limit(limit);
      }

      const results = await queryBuilder.lean();
      return results;
    } catch (error) {
      console.error('Error filtering sensor readings:', error);
      return [];
    }
  },
  

  async create(data) {
    try {
      await connectToDatabase();
      const reading = await SensorReading.create(data);
      return reading.toObject();
    } catch (error) {
      console.error('Error creating sensor reading:', error);
      return null;
    }
  }
};