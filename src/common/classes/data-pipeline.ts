import { Request } from 'express'
import { DataManipulationHandler } from 'common/classes/data-manipulation-handler'

// This class is used to handle the data pipeline for the repository
// For example select fields -> filter -> sort -> paginate
// Call the handle method to start the pipeline
// Call the getQueryArgs method to get the query arguments

export class DataPipeline<T extends Request, D extends object> {
  private readonly handler: DataManipulationHandler<T, D>
  private queryArgs: D

  public constructor(handler: DataManipulationHandler<T, D>) {
    this.handler = handler
    this.queryArgs = {} as D
  }

  public handle(request: T) {
    this.handler.handle(request, this.queryArgs)
  }

  public getQueryArgs(): D {
    return this.queryArgs
  }
}
