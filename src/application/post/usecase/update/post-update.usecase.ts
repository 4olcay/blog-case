import { injectable } from 'tsyringe'
import { IUpdatePostCase } from './model/post-update.model'
import { PostRepository } from '../../../../infra/repository/post/post.repository'
import { PostNotFoundException } from '../../exception/post-not-found.exception'
import { UpdatePostDTO } from './dto/post-update.dto'

@injectable()
export class UpdatePostCase implements IUpdatePostCase {
    constructor(private readonly repository: PostRepository) {}

    async update(data: UpdatePostDTO): Promise<void> {
        const post = await this.repository.findOne({ uuid: data.uuid })
        if (!post) {
            throw new PostNotFoundException()
        }

        const newPost = { ...post, ...data }

        await this.repository.update(newPost)
    }
}
