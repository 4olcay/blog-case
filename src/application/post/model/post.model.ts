import { Post } from '../../../domain/post/post.entity'
import { CreatePostDTO } from '../usecase/create/dto/post-create.dto'
import { FindPostDTO } from '../usecase/find/dto/post-find.dto'
import { UpdatePostDTO } from '../usecase/update/dto/post-update.dto'

export interface IPostService {
    create(data: CreatePostDTO): Promise<Post>
    find(search: FindPostDTO): Promise<Post[]>
    findOne(search: FindPostDTO): Promise<Post>
    deleteById(id: string): Promise<void>
    update(data: UpdatePostDTO): Promise<void>
}
