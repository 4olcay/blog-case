import { UseCase } from '../../../../../common/model/usecase'
import { UpdateCommentDTO } from '../dto/comment-update.dto'

export interface IUpdateCommentCase extends UseCase {
    updateById(id: string, data: UpdateCommentDTO): Promise<void>
}
