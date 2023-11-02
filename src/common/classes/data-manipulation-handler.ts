import { Request } from 'express'

export abstract class DataManipulationHandler<T extends Request, D extends object> {
  private readonly next: DataManipulationHandler<T, D>

  protected constructor(next: DataManipulationHandler<T, D>) {
    this.next = next
  }

  abstract doHandle(request: T, queryArgs: D): boolean

  handle(request: T, queryArgs: D): boolean {
    if (this.doHandle(request, queryArgs)) {
      return
    }

    if (this.next) {
      this.next.handle(request, queryArgs)
    }
  }
}
