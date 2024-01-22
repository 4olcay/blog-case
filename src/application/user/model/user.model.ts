import { User } from '../../../domain/user/user.entity'
import { CreateUserDTO } from '../usecase/create/dto/user-create.dto'
import {
    FindForAuthenticationDTO,
    FindUserDTO,
} from '../usecase/find/dto/user-find.dto'
import { UpdateUserDTO } from '../usecase/update/dto/user-update.dto'

export interface IUserService {
    create(data: CreateUserDTO): Promise<User>
    find(search: FindUserDTO): Promise<User[]>
    findOne(search: FindUserDTO): Promise<User | null>
    findBloggerCount(): Promise<number>
    findReaderCount(): Promise<number>
    getToken(data: FindForAuthenticationDTO): Promise<{ token: string }>
    update(id: string, data: UpdateUserDTO): Promise<User>
    deleteById(id: string): Promise<void>
}
