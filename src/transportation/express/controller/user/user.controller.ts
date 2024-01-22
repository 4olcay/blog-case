import { injectable } from 'tsyringe'
import { app } from '../../server'
import logger from '../../../winston/logger'
import { UserService } from '../../../../application/user/user.service'
import validationMiddleware from '../../middleware/validation/validation.middleware'
import { AuthenticationMiddleware } from './../../middleware/auth/auth.middleware'
import { NextFunction, Request, Response } from 'express'
import { AuthUserRequest } from './request/user-auth.request'
import { CreateUserRequest } from './request/user-create.request'
import { UpdateUserRequest } from './request/user-update.request'

@injectable()
export class UserController {
    constructor(
        private readonly authMiddleware: AuthenticationMiddleware,
        private readonly userService: UserService
    ) {
        logger.info(`[rest-api] UserController initiliazed.`)

        app.get('/user/healthcheck', this.healthcheck)

        app.post('/user/auth', validationMiddleware(AuthUserRequest), this.auth)
        app.post(
            '/user/register',
            validationMiddleware(CreateUserRequest),
            this.register
        )
        app.put('/user/update', this.authMiddleware.verify, this.update)
        app.delete('/user/delete', this.authMiddleware.verify, this.delete)
        app.get(
            '/user/elastic/bloggers-readers-stats',
            this.elasticBloggersReadersStats
        )
    }

    async elasticBloggersReadersStats(
        _request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const bloggerCount = await this.userService.findBloggerCount()
            const readerCount = await this.userService.findReaderCount()

            const data = { bloggerCount, readerCount }

            response.json({
                status: true,
                data,
            })
        } catch (error) {
            next(error)
        }
    }

    async auth(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        const loginRequest: AuthUserRequest = request.body

        try {
            const { token } = await this.userService.getToken(loginRequest)

            response.json({
                status: true,
                data: {
                    token,
                },
            })
        } catch (error) {
            next(error)
        }
    }

    async register(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        const registerRequest: CreateUserRequest = request.body

        try {
            await this.userService.create(registerRequest)

            response.json({
                status: true,
                data: {},
            })
        } catch (error) {
            next(error)
        }
    }

    async update(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        const body: UpdateUserRequest = request.body

        try {
            await this.userService.update(request.user.uuid, body)

            response.json({
                status: true,
                data: {},
            })
        } catch (error) {
            next(error)
        }
    }

    async delete(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            await this.userService.deleteById(request.user.uuid)

            response.json({
                status: true,
                data: {},
            })
        } catch (error) {
            next(error)
        }
    }

    async healthcheck(_request: Request, response: Response): Promise<void> {
        response.send()
    }
}
