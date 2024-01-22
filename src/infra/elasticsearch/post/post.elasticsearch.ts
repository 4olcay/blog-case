/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectable } from 'tsyringe'
import { IPostElasticSearch } from './model/post.model'
import client from '../connection'
import {
    CategoryPercents,
    DeletePostDTO,
    PostDTO,
    PostGroupByInterval,
} from './dto/post.dto'

@injectable()
export class PostElasticSearch implements IPostElasticSearch {
    async index(data: PostDTO): Promise<void> {
        await client.index({
            index: 'posts',
            body: {
                title: data.title,
                body: data.body,
                category: data.category,
                profile: data.profile,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            },
        })
    }

    async delete(data: DeletePostDTO): Promise<void> {
        await client.deleteByQuery({
            index: 'posts',
            body: {
                query: {
                    match: {
                        uuid: data.uuid,
                    },
                },
            },
        })
    }

    async getCount(): Promise<number> {
        const result = await client.count({
            index: 'posts',
        })

        return result.count
    }

    async getCategoryPercents(): Promise<CategoryPercents> {
        const result = await client.search({
            index: 'posts',
            body: {
                aggs: {
                    by_category: {
                        terms: {
                            field: 'category',
                        },
                    },
                },
            },
        })

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const categories = result.aggregations.by_category.buckets.map(
            (item: { key: any; doc_count: any }) => {
                return {
                    category: item.key,
                    count: item.doc_count,
                }
            }
        )

        const total = categories.reduce((acc: any, item: { count: any }) => {
            return acc + item.count
        }, 0)

        return categories.map((item: { category: any; count: number }) => {
            return {
                name: item.category,
                percent: ((item.count / total) * 100).toFixed(2),
            }
        })
    }

    async groupPostsByInterval(
        interval: 'day' | 'week' | 'month' | 'year'
    ): Promise<PostGroupByInterval[]> {
        const result = await client.search({
            index: 'posts',
            body: {
                aggs: {
                    group_by_date: {
                        date_histogram: {
                            field: 'createdAt',
                            calendar_interval: interval,
                        },
                        aggs: {
                            group_by_category: {
                                terms: {
                                    field: 'category',
                                },
                            },
                        },
                    },
                },
            },
        })

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return result.aggregations.group_by_date.buckets.map((item) => {
            return {
                date: item.key_as_string,
                categories: item.group_by_category.buckets.map(
                    (category: { key: string; doc_count: number }) => {
                        return {
                            category: category.key,
                            count: category.doc_count,
                        }
                    }
                ),
            }
        })
    }
}
