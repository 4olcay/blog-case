import { injectable } from 'tsyringe'
import { CreatePostCase } from './usecase/create/post-create.usecase'
import { FindPostCase } from './usecase/find/post-find.usecase'
import { UpdatePostCase } from './usecase/update/post-update.usecase'
import { Post } from '../../domain/post/post.entity'
import { IPostService } from './model/post.model'
import { CreatePostDTO } from './usecase/create/dto/post-create.dto'
import { DeletePostCase } from './usecase/delete/post-delete.usecase'
import { FindPostDTO } from './usecase/find/dto/post-find.dto'
import { UpdatePostDTO } from './usecase/update/dto/post-update.dto'

@injectable()
export class PostService implements IPostService {
    constructor(
        private readonly createCase: CreatePostCase,
        private readonly findCase: FindPostCase,
        private readonly deleteCase: DeletePostCase,
        private readonly updateCase: UpdatePostCase
    ) {}

    async create(data: CreatePostDTO): Promise<Post> {
        return this.createCase.create(data)
    }

    async find(search: FindPostDTO): Promise<Post[]> {
        return this.findCase.find(search)
    }

    async findOne(search: FindPostDTO): Promise<Post> {
        return this.findCase.findOne(search)
    }

    async deleteById(id: string): Promise<void> {
        await this.deleteCase.deleteById(id)
    }

    async update(data: UpdatePostDTO): Promise<void> {
        await this.updateCase.update(data)
    }
}
