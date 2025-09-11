import { ReadingStatus } from './types'

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
