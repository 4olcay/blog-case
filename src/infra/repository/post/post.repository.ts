import { UserElasticSearch } from './../../elasticsearch/user/user.elasticsearch'
import { Repository } from 'typeorm'
import { IPostRepository } from './model/post-repository.model'
import { TypeormPostgresDataSource } from '../../typeorm/connection'
import { Post } from '../../../domain/post/post.entity'
import { FindPostDTO } from '../../../application/post/usecase/find/dto/post-find.dto'
import { injectable } from 'tsyringe'

@injectable()
export class PostRepository implements IPostRepository {
    private readonly postgresConnection: Repository<Post>

    constructor(private readonly userElasticSearch: UserElasticSearch) {
        this.postgresConnection = TypeormPostgresDataSource.getRepository(Post)
    }

    async create(post: Post): Promise<Post> {
        await this.userElasticSearch.indexBlogger({
            uuid: post.profile.uuid,
            email: post.profile.email,
        })

        return this.postgresConnection.save(post)
    }

    async findOne(search: FindPostDTO): Promise<Post> {
        return this.postgresConnection.findOneOrFail({
            where: search,
            relations: { profile: true, comments: true },
        })
    }

    async find(search: FindPostDTO): Promise<Post[]> {
        return this.postgresConnection.findBy(search)
    }

    async update(post: Post): Promise<Post> {
        return this.postgresConnection.save(post)
    }

    async delete(id: string): Promise<void> {
        const post = await this.postgresConnection.findOneOrFail({
            where: { uuid: id },
            relations: { profile: true },
        })

        await this.postgresConnection.delete({ uuid: id })

        const postCount = await this.postgresConnection.countBy({
            profile: { uuid: post.profile.uuid },
        })

        if (postCount < 1) {
            await this.userElasticSearch.deleteBlogger({
                uuid: post.profile.uuid,
            })
            await this.userElasticSearch.indexReader({
                uuid: post.profile.uuid,
                email: post.profile.email,
            })
        }
    }

    async deleteByUserId(id: string): Promise<void> {
        const post = await this.postgresConnection.findOneOrFail({
            where: { uuid: id },
            relations: { profile: true },
        })

        await this.postgresConnection.delete({ profile: { uuid: id } })

        const postCount = await this.postgresConnection.countBy({
            profile: { uuid: post.profile.uuid },
        })

        if (postCount < 1) {
            await this.userElasticSearch.deleteBlogger({
                uuid: post.profile.uuid,
            })
            await this.userElasticSearch.indexReader({
                uuid: post.profile.uuid,
                email: post.profile.email,
            })
        }
    }
}
