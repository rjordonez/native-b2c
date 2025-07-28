import { supabase } from '../../../shared/services/supabase';

interface Topic {
  id: string;
  title: string;
  part: string;
}

export class TopicService {
  /**
   * Get a random topic for a specific part
   * @param part - 'part1', 'part2', or 'part3'
   */
  static async getRandomTopicForPart(part: string): Promise<Topic | null> {
    try {
      // Fetch all topics for the specified part
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('part', part);

      if (error) {
        console.error('Error fetching topics:', error);
        return null;
      }

      if (!data || data.length === 0) {
        console.warn(`No topics found for ${part}`);
        return null;
      }

      // Select a random topic
      const randomIndex = Math.floor(Math.random() * data.length);
      const randomTopic = data[randomIndex];

      return {
        id: randomTopic.id,
        title: randomTopic.title,
        part: randomTopic.part
      };
    } catch (error) {
      console.error('Error getting random topic:', error);
      return null;
    }
  }
}