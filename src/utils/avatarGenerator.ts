/**
 * Generates a unique gradient avatar based on user identifier
 * Returns a data URL that can be stored directly in the database
 */

// Predefined color palettes for gradients
const gradientPalettes = [
  ['#667eea', '#764ba2'], // Purple to violet
  ['#f093fb', '#f5576c'], // Pink to red
  ['#4facfe', '#00f2fe'], // Blue to cyan
  ['#43e97b', '#38f9d7'], // Green to turquoise
  ['#fa709a', '#fee140'], // Pink to yellow
  ['#30cfd0', '#330867'], // Cyan to dark purple
  ['#a8edea', '#fed6e3'], // Light blue to pink
  ['#ff9a9e', '#fecfef'], // Coral to light pink
  ['#fbc2eb', '#a6c1ee'], // Pink to lavender
  ['#fdcbf1', '#e6dee9'], // Light pink to gray
  ['#a1c4fd', '#c2e9fb'], // Light blue gradient
  ['#d299c2', '#fef9d7'], // Mauve to cream
  ['#89f7fe', '#66a6ff'], // Sky blue gradient
  ['#fddb92', '#d1fdff'], // Peach to light blue
  ['#9890e3', '#b1f4cf'], // Purple to mint
  ['#ebc0fd', '#d9ded8'], // Lavender to gray
  ['#96e6a1', '#d4fc79'], // Light green gradient
  ['#ffecd2', '#fcb69f'], // Peach gradient
];

/**
 * Simple hash function to convert string to number
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Generates a gradient avatar SVG as a data URL
 * @param identifier - Unique identifier (email, username, or user ID)
 * @param size - Size of the avatar in pixels (default: 200)
 * @returns Data URL of the SVG gradient avatar
 */
export function generateGradientAvatar(identifier: string, size: number = 200): string {
  // Always use the app's primary blue gradient for consistency
  const palette = ['hsl(221.2, 83.2%, 53.3%)', 'hsl(221.2, 83.2%, 53.3%, 0.6)'];
  
  // Get hash for gradient direction (still use identifier for variety in direction)
  const hash = hashCode(identifier);
  
  // Determine gradient direction based on hash
  const directions = [
    '0% 0%, 100% 100%', // Diagonal down-right
    '0% 100%, 100% 0%', // Diagonal up-right
    '0% 0%, 0% 100%',   // Vertical
    '0% 0%, 100% 0%',   // Horizontal
  ];
  const directionIndex = (hash >> 8) % directions.length;
  const direction = directions[directionIndex];
  
  // Create SVG with gradient
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient" x1="${direction.split(', ')[0]}" y1="${direction.split(', ')[0].split(' ')[1]}" x2="${direction.split(', ')[1]}" y2="${direction.split(', ')[1].split(' ')[1]}">
          <stop offset="0%" style="stop-color:${palette[0]};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${palette[1]};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" fill="url(#gradient)" />
    </svg>
  `;
  
  // Convert to base64 data URL
  const base64 = btoa(svg.trim());
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Generates initials for fallback display
 * @param fullName - User's full name
 * @returns Initials (max 2 characters)
 */
export function getInitials(fullName: string): string {
  if (!fullName) return '?';
  
  const parts = fullName.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
}

/**
 * Generates a gradient avatar with initials overlay
 * @param identifier - Unique identifier for gradient generation
 * @param fullName - User's full name for initials
 * @param size - Size of the avatar in pixels
 * @returns Data URL of the SVG gradient avatar with initials
 */
export function generateGradientAvatarWithInitials(
  identifier: string,
  fullName: string,
  size: number = 200
): string {
  // Always use the app's primary blue gradient for consistency
  const palette = ['hsl(221.2, 83.2%, 53.3%)', 'hsl(221.2, 83.2%, 53.3%, 0.6)'];
  
  // Get hash for gradient direction (still use identifier for variety in direction)
  const hash = hashCode(identifier);
  
  // Determine gradient direction
  const directions = [
    '0% 0%, 100% 100%',
    '0% 100%, 100% 0%',
    '0% 0%, 0% 100%',
    '0% 0%, 100% 0%',
  ];
  const directionIndex = (hash >> 8) % directions.length;
  const direction = directions[directionIndex];
  
  const initials = getInitials(fullName);
  const fontSize = size * 0.4;
  
  // Create SVG with gradient and initials
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient" x1="${direction.split(', ')[0]}" y1="${direction.split(', ')[0].split(' ')[1]}" x2="${direction.split(', ')[1]}" y2="${direction.split(', ')[1].split(' ')[1]}">
          <stop offset="0%" style="stop-color:${palette[0]};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${palette[1]};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" fill="url(#gradient)" />
      <text
        x="50%"
        y="50%"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="${fontSize}"
        font-weight="600"
        fill="white"
        text-anchor="middle"
        dominant-baseline="central"
        style="user-select: none;"
      >${initials}</text>
    </svg>
  `;
  
  // Convert to base64 data URL
  const base64 = btoa(svg.trim());
  return `data:image/svg+xml;base64,${base64}`;
}