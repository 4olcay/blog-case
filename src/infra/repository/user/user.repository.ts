import { Repository } from 'typeorm'
import { IUserRepository } from './model/user-repository.model'
import { User } from '../../../domain/user/user.entity'
import { TypeormPostgresDataSource } from '../../typeorm/connection'
import { FindUserDTO } from '../../../application/user/usecase/find/dto/user-find.dto'
import { PostRepository } from '../post/post.repository'
import { CommentRepository } from '../post/comment/comment.repository'
import { injectable } from 'tsyringe'
import { UserElasticSearch } from '../../elasticsearch/user/user.elasticsearch'

@injectable()
export class UserRepository implements IUserRepository {
    private readonly postgresConnection: Repository<User>

    constructor(
        private readonly postRepository: PostRepository,
        private readonly commentRepository: CommentRepository,
        private readonly userElasticSearch: UserElasticSearch
    ) {
        this.postgresConnection = TypeormPostgresDataSource.getRepository(User)
    }

    async create(user: User): Promise<User> {
        await this.userElasticSearch.indexReader({
            uuid: user.uuid,
            email: user.email,
        })

        return this.postgresConnection.save(user)
    }

    async findOne(search: FindUserDTO): Promise<User | null> {
        return this.postgresConnection.findOneBy(search)
    }

    async find(search: FindUserDTO): Promise<User[]> {
        return this.postgresConnection.findBy(search)
    }

    async findPasswordByEmail(email: string): Promise<string> {
        const user = await this.postgresConnection.findOneOrFail({
            select: { password: true },
            where: { email },
        })

        return user.password
    }

    async update(user: User): Promise<User> {
        return this.postgresConnection.save(user)
    }

    async delete(id: string): Promise<void> {
        await this.postgresConnection.delete({ uuid: id })
        await this.postRepository.deleteByUserId(id)
        await this.commentRepository.deleteByUserId(id)
        await this.userElasticSearch.deleteReader({ uuid: id })
        await this.userElasticSearch.deleteBlogger({ uuid: id })
    }
}
