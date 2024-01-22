import { injectable } from 'tsyringe'
import { AuthenticationService } from '../../../auth/authentication.service'
import { IDeleteUserCase } from './model/user-delete.model'
import { UserRepository } from '../../../../infra/repository/user/user.repository'

@injectable()
export class DeleteUserCase implements IDeleteUserCase {
    constructor(
        private readonly repository: UserRepository,
        private readonly authenticationService: AuthenticationService
    ) {}

    async delete(uuid: string): Promise<void> {
        this.authenticationService.deleteUserSession(uuid)

        await this.repository.delete(uuid)
    }
}
