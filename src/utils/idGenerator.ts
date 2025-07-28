/**
 * Generates a unique message ID with better collision resistance
 * Uses timestamp + random component to avoid duplicates from rapid clicks
 */
export function generateMessageId(suffix?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8); // 6 random alphanumeric chars
  const base = `msg-${timestamp}-${random}`;
  return suffix ? `${base}-${suffix}` : base;
}

/**
 * Generates a unique conversation ID
 */
export function generateConversationId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `conv-${timestamp}-${random}`;
}