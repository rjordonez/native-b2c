// Re-export all services from their respective modules
export { userAnalyticsService } from './analytics/userAnalyticsService';
export { databaseAnalyticsService } from './analytics/databaseAnalyticsService';
export { conversationService } from './conversationService';

// For backward compatibility, export a combined service object
import { userAnalyticsService } from './analytics/userAnalyticsService';
import { databaseAnalyticsService } from './analytics/databaseAnalyticsService';
import { conversationService } from './conversationService';

export const devDashService = {
  // User Analytics
  ...userAnalyticsService,
  
  // Database Analytics
  ...databaseAnalyticsService,
  
  // User Detail Modal Services
  ...conversationService,
};