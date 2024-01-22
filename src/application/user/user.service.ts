import { FindUserCase } from './usecase/find/user-find.usecase'
import { injectable } from 'tsyringe'
import { User } from '../../domain/user/user.entity'
import { CreateUserCase } from './usecase/create/user-create.usecase'
import { CreateUserDTO } from './usecase/create/dto/user-create.dto'
import { IUserService } from './model/user.model'
import {
    FindForAuthenticationDTO,
    FindUserDTO,
} from './usecase/find/dto/user-find.dto'
import { UpdateUserDTO } from './usecase/update/dto/user-update.dto'
import { UpdateUserCase } from './usecase/update/user-update.usecase'
import { DeleteUserCase } from './usecase/delete/user-delete.usecase'

@injectable()
export class UserService implements IUserService {
    constructor(
        private readonly createCase: CreateUserCase,
        private readonly findCase: FindUserCase,
        private readonly updateCase: UpdateUserCase,
        private readonly deleteCase: DeleteUserCase
    ) {}

    async create(data: CreateUserDTO): Promise<User> {
        return this.createCase.create(data)
    }

    async find(data: FindUserDTO): Promise<User[]> {
        return this.findCase.find(data)
    }

    async findOne(data: FindUserDTO): Promise<User | null> {
        return this.findCase.findOne(data)
    }

    async findBloggerCount(): Promise<number> {
        return this.findCase.findBloggerCount()
    }

    async findReaderCount(): Promise<number> {
        return this.findCase.findReaderCount()
    }

    async getToken(data: FindForAuthenticationDTO): Promise<{ token: string }> {
        return this.findCase.findForAuthentication(data)
    }

    async update(id: string, data: UpdateUserDTO): Promise<User> {
        return this.updateCase.update(id, data)
    }

    async deleteById(id: string): Promise<void> {
        await this.deleteCase.delete(id)
    }
}
