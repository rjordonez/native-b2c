import { supabase } from '../../../../shared/services/supabase';
import { AppError, ErrorMessages, logError } from '../../../../utils/error';

/**
 * Base class for persistence services
 * Provides common database operations and error handling
 */
export abstract class PersistenceBase {
  protected supabase = supabase;

  /**
   * Handle database errors consistently
   */
  protected handleError(error: any, operation: string, customMessage?: string): never {
    logError(error, `${this.constructor.name}.${operation}`);
    
    const message = customMessage || this.getErrorMessage(operation);
    throw new AppError(
      message,
      `${operation.toUpperCase()}_ERROR`,
      error
    );
  }

  /**
   * Get user-friendly error message based on operation
   */
  protected getErrorMessage(operation: string): string {
    const errorMap: Record<string, string> = {
      'saveConversation': ErrorMessages.CONVERSATION_SAVE_FAILED,
      'deleteConversation': ErrorMessages.CONVERSATION_DELETE_FAILED,
      'saveMessage': ErrorMessages.MESSAGE_SAVE_FAILED,
      'saveTranscription': ErrorMessages.TRANSCRIPTION_SAVE_FAILED,
      'savePronunciation': ErrorMessages.PRONUNCIATION_SAVE_FAILED,
      'load': 'Failed to load data',
      'update': 'Failed to update data',
      'delete': 'Failed to delete data',
    };

    return errorMap[operation] || 'Database operation failed';
  }

  /**
   * Execute a database operation with error handling
   */
  protected async executeDbOperation<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      this.handleError(error, operationName);
    }
  }

  /**
   * Check if a record exists by ID
   */
  protected async recordExists(table: string, column: string, value: string): Promise<boolean> {
    const { data } = await this.supabase
      .from(table)
      .select('id')
      .eq(column, value)
      .maybeSingle();
    
    return !!data;
  }
}