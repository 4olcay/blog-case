import { container, injectable } from 'tsyringe'
import { Post } from '../../../../domain/post/post.entity'
import { UserService } from '../../../user/user.service'
import { UserNotFoundException } from '../../../user/usecase/find/exception/user-not-found.exception'
import { ICreatePostCase } from './model/post-create.model'
import { CreatePostDTO } from './dto/post-create.dto'
import { PostRepository } from '../../../../infra/repository/post/post.repository'

@injectable()
export class CreatePostCase implements ICreatePostCase {
    constructor(private readonly repository: PostRepository) {}

    async create(data: CreatePostDTO): Promise<Post> {
        const userService = container.resolve(UserService)
        const user = await userService.findOne({ uuid: data.user_id })
        if (!user) {
            throw new UserNotFoundException()
        }

        const post = new Post()
        post.title = data.title
        post.body = data.body
        post.category = data.category
        post.profile = user

        return this.repository.create(post)
    }
}
