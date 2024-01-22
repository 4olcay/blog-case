import { Repository } from 'typeorm'
import { ICommentRepository } from './model/comment-repository.model'
import { Comment } from '../../../../domain/post/comment/comment.entity'
import { FindCommentDTO } from '../../../../application/post/comment/usecase/find/dto/comment-find.dto'
import { TypeormPostgresDataSource } from '../../../typeorm/connection'
import { injectable } from 'tsyringe'

@injectable()
export class CommentRepository implements ICommentRepository {
    private readonly postgresConnection: Repository<Comment>

    constructor() {
        this.postgresConnection =
            TypeormPostgresDataSource.getRepository(Comment)
    }

    async create(post: Comment): Promise<Comment> {
        return this.postgresConnection.save(post)
    }

    async findOne(search: FindCommentDTO): Promise<Comment> {
        return this.postgresConnection.findOneByOrFail(search)
    }

    async find(search: FindCommentDTO): Promise<Comment[]> {
        return this.postgresConnection.find({
            where: search,
            relations: { profile: true, post: true },
        })
    }

    async update(post: Comment): Promise<Comment> {
        return this.postgresConnection.save(post)
    }

    async delete(id: string): Promise<void> {
        await this.postgresConnection.delete({ uuid: id })
    }

    async deleteByUserId(userId: string): Promise<void> {
        await this.postgresConnection.delete({ profile: { uuid: userId } })
    }

    async deleteByPostId(postId: string): Promise<void> {
        await this.postgresConnection.delete({ post: { uuid: postId } })
    }
}
