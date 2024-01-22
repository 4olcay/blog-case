import { injectable } from 'tsyringe'
import { User } from '../../../../domain/user/user.entity'
import { UserAlreadyExistsException } from './exception/user-already-exists.exception'
import { CreateUserDTO } from './dto/user-create.dto'
import { ICreateUserCase } from './model/user-create.model'
import { UserRepository } from '../../../../infra/repository/user/user.repository'
import bcrypt from 'bcrypt'

@injectable()
export class CreateUserCase implements ICreateUserCase {
    constructor(private readonly repository: UserRepository) {}

    async create(data: CreateUserDTO): Promise<User> {
        const user = await this.repository.findOne({ email: data.email })
        if (user) {
            throw new UserAlreadyExistsException()
        }

        const newUser = new User()
        newUser.username = data.full_name
            .trim()
            .replace(/ /g, '_')
            .toLocaleLowerCase()
        newUser.full_name = data.full_name
        newUser.email = data.email
        newUser.address = data.address
        newUser.location = data.location
        newUser.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync())

        return this.repository.create(newUser)
    }
}
