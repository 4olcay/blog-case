import { Post } from '../../../../../domain/post/post.entity'
import { UseCase } from '../../../../common/model/usecase'
import { CreatePostDTO } from '../dto/post-create.dto'

export interface ICreatePostCase extends UseCase {
    create(data: CreatePostDTO): Promise<Post>
}
