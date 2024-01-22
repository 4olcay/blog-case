import { injectable } from 'tsyringe'
import { CommentRepository } from '../../../../../infra/repository/post/comment/comment.repository'
import { IUpdateCommentCase } from './model/comment-update.model'
import { CommentNotFoundException } from '../../exception/comment-not-found.exception'
import { UpdateCommentDTO } from './dto/comment-update.dto'

@injectable()
export class UpdateCommentCase implements IUpdateCommentCase {
    constructor(private readonly repository: CommentRepository) {}

    async updateById(id: string, data: UpdateCommentDTO): Promise<void> {
        const comment = await this.repository.findOne({ uuid: id })
        if (!comment) {
            throw new CommentNotFoundException()
        }

        const newComment = { ...comment, ...data }

        await this.repository.update(newComment)
    }
}
