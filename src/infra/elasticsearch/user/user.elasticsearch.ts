import { Client } from '@elastic/elasticsearch'
import { IUserElasticSearch } from './model/user.model'
import client from '../connection'
import { DeleteBloggerDTO, DeleteReaderDTO, UserDTO } from './dto/user.dto'

export class UserElasticSearch implements IUserElasticSearch {
    private readonly client: Client

    constructor() {
        this.client = client
    }

    async indexReader(data: UserDTO): Promise<void> {
        await this.client.index({
            index: 'blogger_users',
            body: {
                uuid: data.uuid,
                email: data.email,
            },
        })
    }

    async deleteReader(data: DeleteReaderDTO): Promise<void> {
        await this.client.deleteByQuery({
            index: 'blogger_users',
            body: {
                query: {
                    match: {
                        uuid: data.uuid,
                    },
                },
            },
        })
    }

    async getReaderCount(): Promise<number> {
        const result = await this.client.count({
            index: 'reader_users',
        })

        return result.count
    }

    async indexBlogger(data: UserDTO): Promise<void> {
        await this.deleteReader({ uuid: data.uuid })
        await this.deleteBlogger({ uuid: data.uuid })

        await this.client.index({
            index: 'blogger_users',
            body: {
                uuid: data.uuid,
                email: data.email,
            },
        })
    }

    async deleteBlogger(data: DeleteBloggerDTO): Promise<void> {
        await this.client.deleteByQuery({
            index: 'blogger_users',
            body: {
                query: {
                    match: {
                        uuid: data.uuid,
                    },
                },
            },
        })
    }

    async getBloggerCount(): Promise<number> {
        const result = await this.client.count({
            index: 'blogger_users',
        })

        return result.count
    }
}
