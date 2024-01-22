import { UseCase } from '../../../../common/model/usecase'
import { UpdatePostDTO } from '../dto/post-update.dto'

export interface IUpdatePostCase extends UseCase {
    update(data: UpdatePostDTO): Promise<void>
}
