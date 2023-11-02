export type PaginatedResult<T> = {
  data: Partial<T>[]
  meta: {
    total: number
    lastPage: number
    currentPage: number
    perPage: number
    prevUrl: string | null
    currentUrl: string | null
    nextUrl: string | null
    firstUrl: string | null
    lastUrl: string | null
  }
}
