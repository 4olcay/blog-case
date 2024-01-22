import { ValidationException } from '../../../../common/exception/validation.exception'
import { plainToInstance } from 'class-transformer'
import { ValidationError, validate } from 'class-validator'
import { NextFunction, Request, RequestHandler, Response } from 'express'

function validationMiddleware(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: any,
    skipMissingProperties = false
): RequestHandler {
    return (request: Request, _response: Response, next: NextFunction) => {
        validate(plainToInstance(type, request.body), {
            skipMissingProperties,
        }).then((errors: ValidationError[]) => {
            if (errors.length > 0) {
                const message = errors.map((error: ValidationError) =>
                    Object.values(error.constraints as object).join(', ')
                )

                next(new ValidationException(message.toString()))
            } else {
                next()
            }
        })
    }
}

export default validationMiddleware
