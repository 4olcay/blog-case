import { injectable } from 'tsyringe'
import { app } from '../../../server'
import { NextFunction, Request, Response } from 'express'
import logger from '../../../../winston/logger'
import { AuthenticationMiddleware } from '../../../middleware/auth/auth.middleware'
import validationMiddleware from '../../../middleware/validation/validation.middleware'
import { ValidationException } from '../../../../../common/exception/validation.exception'
import { CreateCommentRequest } from './request/comment-create.request'
import { CommentService } from '../../../../../application/post/comment/comment.service'
import { UnauthorizedException } from '../../../exception/unauthorized.exception'
import { UpdateCommentRequest } from './request/comment-update.request'

@injectable()
export class CommentController {
    constructor(
        public authMiddleware: AuthenticationMiddleware,
        private readonly commentService: CommentService
    ) {
        logger.info(`[rest-api] CommentController initiliazed.`)

        app.get('/post/comment/healthcheck', this.healthcheck)
        app.post(
            '/post/:id/comment',
            this.authMiddleware.verify,
            validationMiddleware(CreateCommentRequest),
            this.create
        )
        app.get(
            '/post/comment/my-history',
            this.authMiddleware.verify,
            this.getMyHistory
        )
        app.get('/post/comment/:id', this.get)
        app.get('/post/:id/comment', this.getPostComments)
        app.delete('/post/comment/:id', this.delete)
        app.put('/post/comment/:id', this.update)
    }

    async healthcheck(_request: Request, response: Response): Promise<void> {
        response.send()
    }

    async create(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        const { id } = request.params
        if (!id) {
            throw new ValidationException('id is required in params')
        }

        const body: CreateCommentRequest = request.body

        try {
            const comment = await this.commentService.create({
                post_id: id,
                user_id: request.user.id,
                body: body.body,
            })

            response.json({
                status: true,
                data: {
                    comment,
                },
            })
        } catch (error) {
            next(error)
        }
    }

    async get(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        const { id } = request.params

        if (!id) {
            throw new ValidationException('id is required in params')
        }

        try {
            const comment = await this.commentService.findOne({ uuid: id })

            response.json({
                status: true,
                data: {
                    comment,
                },
            })
        } catch (error) {
            next(error)
        }
    }

    async getMyHistory(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const comments = await this.commentService.find({
                profile: { uuid: request.user.uuid },
            })

            response.json({
                status: true,
                data: {
                    comments,
                },
            })
        } catch (error) {
            next(error)
        }
    }

    async getPostComments(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        const { id } = request.params

        if (!id) {
            throw new ValidationException('id is required in params')
        }

        try {
            const comments = await this.commentService.find({
                post: { uuid: id },
            })

            response.json({
                status: true,
                data: {
                    comments,
                },
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
        const { id } = request.params
        if (!id) {
            throw new ValidationException('id is required in params')
        }

        try {
            const comment = await this.commentService.findOne({ uuid: id })

            if (comment.profile.uuid !== request.user.uuid) {
                throw new UnauthorizedException(
                    'You are not allowed to delete this comment'
                )
            }

            await this.commentService.deleteById(id)

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
        const { id } = request.params
        if (!id) {
            throw new ValidationException('id is required in params')
        }

        const body: UpdateCommentRequest = request.body

        try {
            await this.commentService.updateById(id, body)

            response.json({
                status: true,
                data: {},
            })
        } catch (error) {
            next(error)
        }
    }
}
