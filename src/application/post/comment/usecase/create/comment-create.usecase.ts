import { container, injectable } from 'tsyringe'
import { PostService } from '../../../post.service'
import { UserService } from '../../../../user/user.service'
import { UserNotFoundException } from '../../../../user/usecase/find/exception/user-not-found.exception'
import { Comment } from '../../../../../domain/post/comment/comment.entity'
import { CreateCommentDTO } from './dto/comment-create.dto'
import { ICreateCommentCase } from './model/comment-create.model'
import { CommentRepository } from '../../../../../infra/repository/post/comment/comment.repository'
import { PostNotFoundException } from '../../../exception/post-not-found.exception'

@injectable()
export class CreateCommentCase implements ICreateCommentCase {
    constructor(private readonly repository: CommentRepository) {}

    async create(data: CreateCommentDTO): Promise<Comment> {
        const postService = container.resolve(PostService)
        const post = await postService.findOne({ uuid: data.post_id })
        if (!post) {
            throw new PostNotFoundException()
        }

        const userService = container.resolve(UserService)
        const user = await userService.findOne({ uuid: data.user_id })
        if (!user) {
            throw new UserNotFoundException()
        }

        const comment = new Comment()
        comment.body = data.body
        comment.post = post
        comment.profile = user

        return this.repository.create(comment)
    }
}
