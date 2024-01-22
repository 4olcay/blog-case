import { injectable } from 'tsyringe'
import { IDeletePostCase } from './model/post-delete.model'
import { PostRepository } from '../../../../infra/repository/post/post.repository'
import { CommentRepository } from '../../../../infra/repository/post/comment/comment.repository'

@injectable()
export class DeletePostCase implements IDeletePostCase {
    constructor(
        private readonly repository: PostRepository,
        private readonly commentRepository: CommentRepository
    ) {}

    async deleteById(id: string): Promise<void> {
        await this.repository.delete(id)
        await this.commentRepository.deleteByPostId(id)
    }
}
