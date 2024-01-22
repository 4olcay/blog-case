import { FindUserDTO } from '../../../../application/user/usecase/find/dto/user-find.dto'
import { User } from '../../../../domain/user/user.entity'

export interface IUserRepository {
    create(user: User): Promise<User>
    findOne(search: FindUserDTO): Promise<User | null>
    find(search: FindUserDTO): Promise<User[]>
    findPasswordByEmail(email: string): Promise<string>
    update(user: User): Promise<User>
    delete(id: string): Promise<void>
}
