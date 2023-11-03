import { Request } from 'express'

export abstract class DataManipulationHandler<T extends object> {
  private readonly next: DataManipulationHandler<T>

  protected constructor(next: DataManipulationHandler<T>) {
    this.next = next
  }

  abstract doHandle(request: Request, queryArgs: T): boolean

  handle(request: Request, queryArgs: T): boolean {
    if (this.doHandle(request, queryArgs)) {
      return
    }

    if (this.next) {
      this.next.handle(request, queryArgs)
    }
  }
}
