/**
 * Utility to detect valid URLs in a given string.
 * Checks for http:// or https:// prefix.
 * 
 * @param {string} text - The string to analyze
 * @returns {Array} Array of URL matches with their positions
 */
export const detectURLs = (text) => {
  if (!text || typeof text !== 'string') return [];
  
  const urlRegex = /(https?:\/\/[^\s"']+)/g;
  const matches = [];
  let match;
  
  while ((match = urlRegex.exec(text)) !== null) {
    matches.push({
      url: match[0],
      start: match.index,
      end: match.index + match[0].length
    });
  }
  
  return matches;
};