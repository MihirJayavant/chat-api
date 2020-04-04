import { Request, Response, NextFunction } from 'express'
import { ValidationError, validate } from 'class-validator'
import { createResponseMessage } from '../models'

// get error
function standardizeError(errors: ValidationError[]) {
  const constraints = errors[0].constraints
  const messages = Object.keys(constraints).map(p => constraints[p])
  return messages[0]
}

export function checkBody(modelCreator: (body: any) => any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const data = modelCreator(req.body)

    const errors = await validate(data)
    if (errors.length > 0) {
      const errRes = createResponseMessage(400, standardizeError(errors))
      res.status(errRes.statusCode).send(errRes.response)
      return
    }

    next()
  }
}
