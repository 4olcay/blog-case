import { PostDTO, PostGroupByInterval } from '../dto/post.dto'

export interface IPostElasticSearch {
    index(data: PostDTO): Promise<void>
    delete(data: PostDTO): Promise<void>
    getCount(): Promise<number>
    groupPostsByInterval(
        interval: 'day' | 'week' | 'month' | 'year'
    ): Promise<PostGroupByInterval[]>
}
