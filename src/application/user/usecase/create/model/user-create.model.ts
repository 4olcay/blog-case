import { User } from '../../../../../domain/user/user.entity'
import { UseCase } from '../../../../common/model/usecase'
import { CreateUserDTO } from '../dto/user-create.dto'

export interface ICreateUserCase extends UseCase {
    create(data: CreateUserDTO): Promise<User>
}
