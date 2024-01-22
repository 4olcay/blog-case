import { Post } from '../../../../../domain/post/post.entity'
import {
    CategoryPercents,
    PostGroupByInterval,
} from '../../../../../infra/elasticsearch/post/dto/post.dto'
import { UseCase } from '../../../../common/model/usecase'
import { FindPostDTO } from '../dto/post-find.dto'

export interface IFindPostCase extends UseCase {
    findOne(search: FindPostDTO): Promise<Post>
    find(search: FindPostDTO): Promise<Post[]>
    getCategoryPercents(): Promise<CategoryPercents>
    getCategoryGroupByInterval(
        interval: 'day' | 'week' | 'month' | 'year'
    ): Promise<PostGroupByInterval[]>
}
