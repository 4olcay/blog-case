import { Comment } from '../../../../../../domain/post/comment/comment.entity'
import { UseCase } from '../../../../../common/model/usecase'
import { CreateCommentDTO } from '../dto/comment-create.dto'

export interface ICreateCommentCase extends UseCase {
    create(data: CreateCommentDTO): Promise<Comment>
}
