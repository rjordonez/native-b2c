// Re-export all services from their respective modules
export { userAnalyticsService } from './analytics/userAnalyticsService';
export { databaseAnalyticsService } from './analytics/databaseAnalyticsService';
export { trafficAnalyticsService } from './analytics/trafficAnalyticsService'
export { conversationService } from './conversationService';

// For backward compatibility, export a combined service object
import { userAnalyticsService } from './analytics/userAnalyticsService';
import { databaseAnalyticsService } from './analytics/databaseAnalyticsService';
import { conversationService } from './conversationService';
import { trafficAnalyticsService } from './analytics/trafficAnalyticsService';

export const devDashService = {
  // User Analytics
  ...userAnalyticsService,
  
  // Database Analytics
  ...databaseAnalyticsService,

  // Traffic Analytics
  ...trafficAnalyticsService,
  
  // User Detail Modal Services
  ...conversationService,
};