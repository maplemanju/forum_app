// Add this helper function at the top of the file
export const stripMarkdown = (content: string, limit: number = 300) => {
  const strippedContent = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[^;]+;/g, '') // Remove HTML entities
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links but keep text
    .replace(/[#*`_~]/g, '') // Remove markdown symbols
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim()
    .slice(0, limit) // Limit to 180 characters

  return strippedContent
}
