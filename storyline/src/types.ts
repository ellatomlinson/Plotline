export type Book = {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    averageRating?: number
    ratingsCount?: number
    categories?: string[]
    publisher?: string
    publishedDate?: string
    description?: string
    imageLinks?: {
      smallThumbnail?: string
      thumbnail?: string
    }
    infoLink?: string
    pageCount?: number
  }
  accessInfo: {
    webReaderLink?: string
    accessViewStatus?: string
    embeddable?: boolean
    publicDomain?: boolean
  }
}

export type GoogleBooksApiResponse = {
  totalItems: number
  items: Book[]
}

export enum ReadingStatus {
  CURRENTLY_READING = 'currently_reading',
  READ = 'read',
  READING_LIST = 'reading_list',
  REMOVE = 'remove',
  DID_NOT_FINISH = 'did_not_finish'
}

export type DbBook = {
  id: number,
  google_book_id: string,
  created_at: string,
  finished_reading: string,
  status: ReadingStatus,
  user_id: string
}
