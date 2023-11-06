export type PaginatedResult<T> = {
  data: Partial<T>[]
  meta: {
    total: number
    perPage: number
    totalPages: number
    currentPage: number
    prevUrl: string | null
    nextUrl: string | null
    currentUrl: string | null
    lastUrl: string | null
    firstUrl: string | null
  }
}
