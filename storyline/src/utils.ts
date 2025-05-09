export function processDescription(description: string): string {
  // Replace newlines, tabs, and multiple spaces with a single space
  const normalizedDescription = description.replace(/[\s\t\n]+/g, ' ')
  // Trim leading and trailing spaces
  return normalizedDescription.trim()
}
