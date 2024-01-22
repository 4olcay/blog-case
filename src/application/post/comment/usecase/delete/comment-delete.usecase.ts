import { injectable } from 'tsyringe'
import { IDeleteCommentCase } from './model/comment-delete.model'
import { CommentRepository } from '../../../../../infra/repository/post/comment/comment.repository'

@injectable()
export class DeleteCommentCase implements IDeleteCommentCase {
    constructor(private readonly repository: CommentRepository) {}

    async deleteById(id: string): Promise<void> {
        await this.repository.delete(id)
    }
}
