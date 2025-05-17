import { ReadingStatus } from './types'

export function processDescription(description: string): string {
  // Replace newlines, tabs, and multiple spaces with a single space
  const normalizedDescription = description.replace(/[\s\t\n]+/g, ' ')
  // Trim leading and trailing spaces
  return normalizedDescription.trim()
}

export function stringToReadingStatus(status: string): ReadingStatus {
  switch (status) {
    case 'currently_reading':
      return ReadingStatus.CURRENTLY_READING
    case 'read':
      return ReadingStatus.READ
    case 'reading_list':
      return ReadingStatus.READING_LIST
    case 'did_not_finish':
      return ReadingStatus.DID_NOT_FINISH
    default:
      return ReadingStatus.REMOVE
  }
}
