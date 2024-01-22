import { Comment } from '../../../../../../domain/post/comment/comment.entity'
import { UseCase } from '../../../../../common/model/usecase'
import { FindCommentDTO } from '../dto/comment-find.dto'

export interface IFindCommentCase extends UseCase {
    findOne(search: FindCommentDTO): Promise<Comment>
    find(search: FindCommentDTO): Promise<Comment[]>
}
