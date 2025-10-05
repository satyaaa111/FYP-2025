/**
 * Creates a URL for navigating to a specific page
 * @param {string} pageName - The name of the page to navigate to
 * @returns {string} The URL path for the page
 */
export function createPageUrl(pageName) {
  return `/${pageName}`;
}

/**
 * Utility function for combining CSS class names
 * @param {...string} classes - Class names to combine
 * @returns {string} Combined class names
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}