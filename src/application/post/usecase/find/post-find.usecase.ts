import { injectable } from 'tsyringe'
import { Post } from '../../../../domain/post/post.entity'
import { IFindPostCase } from './model/post-find.model'
import { FindPostDTO } from './dto/post-find.dto'
import { PostRepository } from '../../../../infra/repository/post/post.repository'
import { PostElasticSearch } from '../../../../infra/elasticsearch/post/post.elasticsearch'
import {
    CategoryPercents,
    PostGroupByInterval,
} from '../../../../infra/elasticsearch/post/dto/post.dto'

@injectable()
export class FindPostCase implements IFindPostCase {
    constructor(
        private readonly repository: PostRepository,
        private readonly postElasticSearch: PostElasticSearch
    ) {}

    async findOne(search: FindPostDTO): Promise<Post> {
        return this.repository.findOne(search)
    }

    async find(search: FindPostDTO): Promise<Post[]> {
        return this.repository.find(search)
    }

    async getCategoryPercents(): Promise<CategoryPercents> {
        return this.postElasticSearch.getCategoryPercents()
    }

    async getCategoryGroupByInterval(
        interval: 'day' | 'week' | 'month' | 'year'
    ): Promise<PostGroupByInterval[]> {
        return this.postElasticSearch.groupPostsByInterval(interval)
    }
}
