import { User } from '../../../../../domain/user/user.entity'
import { UseCase } from '../../../../common/model/usecase'
import { UpdateUserDTO } from '../dto/user-update.dto'

export interface IUpdateUserCase extends UseCase {
    update(uuid: string, data: UpdateUserDTO): Promise<User>
}
