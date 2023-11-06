export interface IPaginationStrategy<T> {
  countRecords(where: object): Promise<number>
  getRecords(args: object): Promise<T[]>
}

export const PAGINATION_STRATEGY = Symbol('IPaginationStrategy')
