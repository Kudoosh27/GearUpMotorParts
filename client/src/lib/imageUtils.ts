// Helper functions for handling images

/**
 * Get the URL for a category image
 * @param imageName The name of the image file without extension
 * @returns The URL for the image
 */
export function getCategoryImageUrl(imageName: string): string {
  try {
    return new URL(`../assets/images/categories/${imageName}.avif`, import.meta.url).href;
  } catch (err) {
    console.error(`Error loading image: ${imageName}`, err);
    return ''; // Return an empty string or a fallback image URL
  }
}