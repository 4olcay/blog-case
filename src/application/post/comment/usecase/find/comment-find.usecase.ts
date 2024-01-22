import { injectable } from 'tsyringe'
import { Comment } from '../../../../../domain/post/comment/comment.entity'
import { IFindCommentCase } from './model/comment-find.model'
import { FindCommentDTO } from './dto/comment-find.dto'
import { CommentRepository } from '../../../../../infra/repository/post/comment/comment.repository'

@injectable()
export class FindCommentCase implements IFindCommentCase {
    constructor(private readonly repository: CommentRepository) {}

    async findOne(search: FindCommentDTO): Promise<Comment> {
        return this.repository.findOne(search)
    }

    async find(search: FindCommentDTO): Promise<Comment[]> {
        return this.repository.find(search)
    }
}
