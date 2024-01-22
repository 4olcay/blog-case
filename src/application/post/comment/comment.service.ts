import { injectable } from 'tsyringe'
import { CreateCommentCase } from './usecase/create/comment-create.usecase'
import { UpdateCommentCase } from './usecase/update/comment-update.usecase'
import { FindCommentCase } from './usecase/find/comment-find.usecase'
import { Comment } from '../../../domain/post/comment/comment.entity'
import { CreateCommentDTO } from './usecase/create/dto/comment-create.dto'
import { ICommentService } from './model/comment.model'
import { DeleteCommentCase } from './usecase/delete/comment-delete.usecase'
import { FindCommentDTO } from './usecase/find/dto/comment-find.dto'
import { UpdateCommentDTO } from './usecase/update/dto/comment-update.dto'

@injectable()
export class CommentService implements ICommentService {
    constructor(
        private readonly createCase: CreateCommentCase,
        private readonly findCase: FindCommentCase,
        private readonly deleteCase: DeleteCommentCase,
        private readonly updateCase: UpdateCommentCase
    ) {}

    async create(data: CreateCommentDTO): Promise<Comment> {
        return this.createCase.create(data)
    }

    async findOne(search: FindCommentDTO): Promise<Comment> {
        return this.findCase.findOne(search)
    }

    async find(search: FindCommentDTO): Promise<Comment[]> {
        return this.findCase.find(search)
    }

    async deleteById(id: string): Promise<void> {
        await this.deleteCase.deleteById(id)
    }

    async updateById(id: string, data: UpdateCommentDTO): Promise<void> {
        await this.updateCase.updateById(id, data)
    }
}
