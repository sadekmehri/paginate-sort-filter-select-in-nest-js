import { Request } from 'express'
import { DataManipulationHandler } from 'prisma/handlers'

// This class is used to handle the data pipeline for the repository
// For example select fields -> filter -> sort
// Call the handle method to start the pipeline
// Call the getQueryArgs method to get the query arguments

export class DataPipeline<T extends object> {
  private readonly handler: DataManipulationHandler<T>
  private queryArgs: T

  public constructor(handler: DataManipulationHandler<T>) {
    this.handler = handler
    this.queryArgs = {} as T
  }

  public handle(request: Request) {
    this.handler.handle(request, this.queryArgs)
  }

  public getQueryArgs(): T {
    return this.queryArgs
  }
}
