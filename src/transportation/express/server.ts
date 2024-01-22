import express, { NextFunction, Request, Response } from 'express'
import logger from '../winston/logger'
import { container, injectable } from 'tsyringe'
import { AuthorizationCouldntFoundException } from './middleware/auth/exception/authorization-couldnt-found.exception'
import { NotImplementedYetException } from '../../common/exception/not-implemented.exception'
import { ValidationException } from '../../common/exception/validation.exception'
import { EntityNotFoundError, QueryFailedError } from 'typeorm'
import { UserNotFoundException } from '../../application/user/usecase/find/exception/user-not-found.exception'
import { WrongPasswordException } from '../../application/user/usecase/find/exception/user-wrong-password.exception'
import { UserAlreadyExistsException } from '../../application/user/usecase/create/exception/user-already-exists.exception'
import { PostController } from './controller/post/post.controller'
import { UserController } from './controller/user/user.controller'
import { CommentController } from './controller/post/comment/comment.controller'
import { NotFoundException } from './exception/not-found.exception'

export const app = express()

@injectable()
export class ExpressServer {
    constructor() {
        app.use(express.json())

        this.initializeControllers()
        this.startServer()
        this.initializeErrorHandler()
    }

    initializeControllers() {
        container.resolve(UserController)
        container.resolve(PostController)
        container.resolve(CommentController)
    }

    initializeErrorHandler() {
        app.use(
            (
                error: Error,
                request: Request,
                response: Response,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                next: NextFunction
            ) => {
                if (error instanceof AuthorizationCouldntFoundException) {
                    response
                        .status(401)
                        .json({ status: false, message: error.message })
                }

                if (error instanceof NotImplementedYetException) {
                    response
                        .status(501)
                        .json({ status: false, message: error.message })
                }

                if (error instanceof ValidationException) {
                    response
                        .status(400)
                        .json({ status: false, message: error.message })
                }

                if (error instanceof QueryFailedError) {
                    response
                        .status(404)
                        .json({ status: false, message: error.message })
                    return
                }

                if (error instanceof EntityNotFoundError) {
                    response
                        .status(404)
                        .json({ status: false, message: error.message })
                }

                if (error instanceof UserAlreadyExistsException) {
                    response
                        .status(409)
                        .json({ status: false, message: error.message })
                    return
                }

                if (error instanceof UserNotFoundException) {
                    response
                        .status(404)
                        .json({ status: false, message: error.message })
                }

                if (error instanceof NotFoundException) {
                    response
                        .status(404)
                        .json({ status: false, message: error.message })
                }

                if (error instanceof WrongPasswordException) {
                    response.status(401).json({
                        status: false,
                        message: error.message,
                    })
                }

                response
                    .status(500)
                    .json({ status: false, message: error.message })
            }
        )
    }

    startServer() {
        const port = process.env.REST_API_PORT || 3000

        app.listen(port, () => {
            logger.info(`[express-server] Express listening on port ${port}`)
        })
    }
}
