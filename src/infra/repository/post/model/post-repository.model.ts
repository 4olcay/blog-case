import { FindPostDTO } from '../../../../application/post/usecase/find/dto/post-find.dto'
import { Post } from '../../../../domain/post/post.entity'

export interface IPostRepository {
    create(post: Post): Promise<Post>
    findOne(search: FindPostDTO): Promise<Post>
    find(search: FindPostDTO): Promise<Post[]>
    update(post: Post): Promise<Post>
    delete(id: string): Promise<void>
    deleteByUserId(id: string): Promise<void>
}
