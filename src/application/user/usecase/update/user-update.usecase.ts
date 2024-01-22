import { injectable } from 'tsyringe'
import { IUpdateUserCase } from './model/user-update.model'
import { UpdateUserDTO } from './dto/user-update.dto'
import { User } from '../../../../domain/user/user.entity'
import { UserNotFoundException } from '../find/exception/user-not-found.exception'
import { AuthenticationService } from '../../../auth/authentication.service'
import { UserRepository } from '../../../../infra/repository/user/user.repository'
import bcrypt from 'bcrypt'

@injectable()
export class UpdateUserCase implements IUpdateUserCase {
    constructor(
        private readonly repository: UserRepository,
        private readonly authenticationService: AuthenticationService
    ) {}

    async update(uuid: string, data: UpdateUserDTO): Promise<User> {
        const user = await this.repository.findOne({ uuid })

        if (!user) {
            throw new UserNotFoundException()
        }

        const deleteUserSession = data.password || data.email
        if (deleteUserSession) {
            this.authenticationService.deleteUserSession(uuid)
        }

        if (data.password) {
            data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync())
        }

        const updatedUser = { ...user, ...data }
        await this.repository.update(updatedUser)

        return updatedUser
    }
}
