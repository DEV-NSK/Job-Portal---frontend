// Utility function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) return imagePath;
  
  // In production, prepend the backend URL
  const baseUrl = import.meta.env.PROD 
    ? 'https://job-portal-backend-fna9xur1a-bathula-sai-kirans-projects.vercel.app'
    : '';
    
  return `${baseUrl}${imagePath}`;
};