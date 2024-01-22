import { NextFunction, Request, Response } from 'express'
import { container, injectable } from 'tsyringe'
import { AuthenticationService } from '../../../../application/auth/authentication.service'
import { InvalidTokenException } from '../../../../application/auth/exception/auth-invalid-token.exception'
import { AuthorizationCouldntFoundException } from './exception/authorization-couldnt-found.exception'

@injectable()
export class AuthenticationMiddleware {
    verify(request: Request, _response: Response, next: NextFunction) {
        const authorization = request.header('Authorization')?.toString()

        if (!authorization) {
            throw new AuthorizationCouldntFoundException()
        }

        if (!authorization.startsWith('Bearer ')) {
            throw new InvalidTokenException()
        }

        const token = authorization.toString().replace('Bearer ', '')
        request.user = container.resolve(AuthenticationService).verify(token)
        next()
    }
}
