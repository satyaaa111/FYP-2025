import connectToDatabase from '../mongodb';
import SystemAlert from '../../models/SystemAlertSchema';

export const SystemA = {
  /**
   * Filter system alerts.
   * @param {Object} query - MongoDB query object (e.g., { is_read: false })
   * @param {string|null} sort - Field to sort by (e.g., "-created_date")
   * @param {number|null} limit - Max number of results
   */
  async filter(query = {}, sort = null, limit = null) {
    try {
      await connectToDatabase();
      
      const queryBuilder = SystemAlert.find(query);

      if (sort) {
        const sortOptions = {};
        const [field, order] = sort.startsWith("-")
          ? [sort.slice(1), -1]
          : [sort, 1];
        sortOptions[field] = order;
        queryBuilder.sort(sortOptions);
      }

      if (limit) {
        queryBuilder.limit(limit);
      }

      const results = await queryBuilder.lean();
      return results;
    } catch (error) {
      console.error('Error filtering system alerts:', error);
      return [];
    }
  },
  
  /**
   * Create a new system alert.
   * @param {object} data - Data for the new alert (e.g., { level: 'critical', message: '...' })
   */
  async create(data) {
    try {
      await connectToDatabase();
      const alert = await SystemAlert.create(data);
      return alert.toObject();
    } catch (error) {
      console.error('Error creating system alert:', error);
      return null;
    }
  }
};