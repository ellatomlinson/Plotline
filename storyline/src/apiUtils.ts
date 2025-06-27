// import type { Book } from "./types"

// async function getBookById(bookId: string): Promise<Book>{
//     const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`)
//     if (!response.ok) {
//       throw new Error(`Failed to fetch book with ID ${bookId}`)
//     }
//     const data = await response.json()
//     return data
//   }