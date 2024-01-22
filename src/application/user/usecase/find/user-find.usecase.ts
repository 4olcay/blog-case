import { injectable } from 'tsyringe'
import { UserNotFoundException } from './exception/user-not-found.exception'
import { WrongPasswordException } from './exception/user-wrong-password.exception'
import { User } from '../../../../domain/user/user.entity'
import { AuthenticationService } from '../../../auth/authentication.service'
import { IFindUserCase } from './model/user-find.model'
import { FindForAuthenticationDTO, FindUserDTO } from './dto/user-find.dto'
import { UserRepository } from '../../../../infra/repository/user/user.repository'
import bcrypt from 'bcrypt'
import { UserElasticSearch } from '../../../../infra/elasticsearch/user/user.elasticsearch'

@injectable()
export class FindUserCase implements IFindUserCase {
    constructor(
        private readonly repository: UserRepository,
        private readonly userElasticSearch: UserElasticSearch,
        private readonly authenticationService: AuthenticationService
    ) {}

    async findForAuthentication(
        data: FindForAuthenticationDTO
    ): Promise<{ token: string }> {
        const user = await this.repository.findOne({ email: data.email })
        if (!user) {
            throw new UserNotFoundException()
        }

        const password = await this.repository.findPasswordByEmail(data.email)
        const comparePassword = bcrypt.compareSync(data.password, password)
        if (!comparePassword) {
            throw new WrongPasswordException()
        }

        const { uuid, username } = user
        const token = this.authenticationService.sign({ uuid, username })

        return { token }
    }

    async find(search: FindUserDTO): Promise<User[]> {
        return this.repository.find(search)
    }

    async findOne(search: FindUserDTO): Promise<User | null> {
        return this.repository.findOne(search)
    }

    async findBloggerCount(): Promise<number> {
        return this.userElasticSearch.getBloggerCount()
    }

    async findReaderCount(): Promise<number> {
        return this.userElasticSearch.getReaderCount()
    }
}
