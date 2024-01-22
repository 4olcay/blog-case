import { FindCommentDTO } from '../../../../../application/post/comment/usecase/find/dto/comment-find.dto'
import { Comment } from '../../../../../domain/post/comment/comment.entity'

export interface ICommentRepository {
    create(comment: Comment): Promise<Comment>
    findOne(search: FindCommentDTO): Promise<Comment>
    find(search: FindCommentDTO): Promise<Comment[]>
    update(comment: Comment): Promise<Comment>
    delete(id: string): Promise<void>
    deleteByPostId(postId: string): Promise<void>
    deleteByUserId(userId: string): Promise<void>
}
