export type Book = {
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
