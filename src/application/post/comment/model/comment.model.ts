import { Comment } from '../../../../domain/post/comment/comment.entity'
import { CreateCommentDTO } from '../usecase/create/dto/comment-create.dto'
import { FindCommentDTO } from '../usecase/find/dto/comment-find.dto'
import { UpdateCommentDTO } from '../usecase/update/dto/comment-update.dto'

export interface ICommentService {
    create(data: CreateCommentDTO): Promise<Comment>
    findOne(search: FindCommentDTO): Promise<Comment>
    find(search: FindCommentDTO): Promise<Comment[]>
    deleteById(id: string): Promise<void>
    updateById(id: string, data: UpdateCommentDTO): Promise<void>
}
