import { PostElasticSearch } from './../../../../infra/elasticsearch/post/post.elasticsearch'
import { injectable } from 'tsyringe'
import { app } from '../../server'
import logger from '../../../winston/logger'
import { PostService } from '../../../../application/post/post.service'
import { AuthenticationMiddleware } from '../../middleware/auth/auth.middleware'
import validationMiddleware from '../../middleware/validation/validation.middleware'
import { NextFunction, Request, Response } from 'express'
import { CreatePostRequest } from './request/post-create.request'
import { UpdatePostRequest } from './request/post-update.request'
import { ValidationException } from '../../../../common/exception/validation.exception'
import { NotFoundException } from '../../exception/not-found.exception'
import { UnauthorizedException } from '../../exception/unauthorized.exception'
import { Like } from 'typeorm'

@injectable()
export class PostController {
    constructor(
        public authMiddleware: AuthenticationMiddleware,
        private readonly postService: PostService,
        private readonly postElasticSearch: PostElasticSearch
    ) {
        logger.info(`[rest-api] PostController initiliazed.`)

        app.get('/post/healthcheck', this.healthcheck)
        app.post(
            '/post',
            this.authMiddleware.verify,
            validationMiddleware(CreatePostRequest),
            this.create
        )
        app.get(
            '/post/my-history',
            this.authMiddleware.verify,
            this.getMyHistory
        )
        app.get('/post/category/:category', this.getByCategory)
        app.get('/post/elastic/group-posts', this.elasticGroupPosts)
        app.get('/post/elastic/category-percents', this.elasticCategoryPercents)
        app.get('/post/search', this.search)
        app.get('/post/:id', this.get)
        app.get('/post', this.getAll)
        app.put(
            '/post',
            this.authMiddleware.verify,
            validationMiddleware(UpdatePostRequest),
            this.update
        )
        app.delete('/post/:id', this.authMiddleware.verify, this.delete)
    }

    async healthcheck(_request: Request, response: Response): Promise<void> {
        response.send()
    }

    async elasticGroupPosts(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        let { interval } = request.query
        if (!interval) {
            throw new ValidationException('interval is required in query')
        }

        interval = interval.toString()

        if (!['day', 'week', 'month', 'year'].includes(interval)) {
            throw new ValidationException('interval is not valid')
        }

        try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const postCounts = await this.postElasticSearch.groupPostsByInterval(interval)

            response.json({
                status: true,
                data: {
                    postCounts,
                },
            })
        } catch (error) {
            next(error)
        }
    }

    async elasticCategoryPercents(
        _request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const categories =
                await this.postElasticSearch.getCategoryPercents()

            response.json({
                status: true,
                data: {
                    categories,
                },
            })
        } catch (error) {
            next(error)
        }
    }

    async create(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        const body: CreatePostRequest = request.body

        try {
            const post = await this.postService.create({
                user_id: request.user.uuid,
                body: body.body,
                category: body.category,
                title: body.title,
            })

            response.json({
                status: true,
                data: {
                    post,
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
            throw new NotFoundException('id is required in params')
        }

        try {
            const post = await this.postService.findOne({ uuid: id })

            response.json({
                status: true,
                data: {
                    post,
                },
            })
        } catch (error) {
            next(error)
        }
    }

    async getAll(
        _request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const posts = await this.postService.find({})

            response.json({
                status: true,
                data: {
                    posts,
                },
            })
        } catch (error) {
            next(error)
        }
    }

    async getByCategory(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        const { category } = request.params
        if (!category) {
            throw new NotFoundException('category is required in params')
        }

        try {
            const posts = await this.postService.find({ category })

            response.json({
                status: true,
                data: {
                    posts,
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
            const posts = await this.postService.find({
                profile: { uuid: request.user.uuid },
            })

            response.json({
                status: true,
                data: {
                    posts,
                },
            })
        } catch (error) {
            next(error)
        }
    }

    async search(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        const { title } = request.query
        if (!title) {
            throw new NotFoundException('title is required in query')
        }

        try {
            const posts = await this.postService.find({
                title: Like(`%${title}%`),
            })

            response.json({
                status: true,
                data: {
                    posts,
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
            const post = await this.postService.findOne({ uuid: id })

            if (post.profile.uuid !== request.user.uuid) {
                throw new UnauthorizedException('You are not allowed to delete this post')
            }

            await this.postService.deleteById(id)

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
        const body: UpdatePostRequest = request.body

        try {
            const post = await this.postService.findOne({ uuid: body.uuid })

            if (post.profile.uuid !== request.user.uuid) {
                throw new UnauthorizedException('You are not allowed to update this post')
            }

            await this.postService.update(body)

            response.json({
                status: true,
                data: {},
            })
        } catch (error) {
            next(error)
        }
    }
}
