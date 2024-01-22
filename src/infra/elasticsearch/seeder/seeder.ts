import { singleton } from 'tsyringe'
import client from '../connection'
import { posts } from '../../../../dummy-data/post/post.dummy'
import logger from '../../../transportation/winston/logger'
import { users } from '../../../../dummy-data/user/user.dummy'
import { UserService } from '../../../application/user/user.service'

@singleton()
export class ElasticSearchSeeder {
    constructor(private readonly userService: UserService) {
        this.initialize()
    }

    async initialize() {
        await this.createPostIndices()
        await this.createReaderUserIndices()
        await this.createBloggerUserIndices()
        await this.seedUsers()
    }

    async createPostIndices() {
        await client.indices.create({
            index: 'posts',
            body: {
                mappings: {
                    properties: {
                        title: {
                            type: 'text',
                        },
                        body: {
                            type: 'text',
                        },
                        profile: {
                            properties: {
                                uuid: {
                                    type: 'keyword',
                                },
                                email: {
                                    type: 'keyword',
                                },
                            },
                        },
                        category: {
                            type: 'keyword',
                        },
                        createdAt: {
                            type: 'date',
                        },
                        updatedAt: {
                            type: 'date',
                        },
                    },
                },
            },
        })
    }

    async createReaderUserIndices() {
        await client.indices.create({
            index: 'reader_users',
            body: {
                mappings: {
                    properties: {
                        uuid: {
                            type: 'keyword',
                        },
                        email: {
                            type: 'keyword',
                        },
                    },
                },
            },
        })
    }

    async createBloggerUserIndices() {
        await client.indices.create({
            index: 'blogger_users',
            body: {
                mappings: {
                    properties: {
                        uuid: {
                            type: 'keyword',
                        },
                        email: {
                            type: 'keyword',
                        },
                    },
                },
            },
        })
    }

    async seedUsers() {
        logger.info('[ElasticSeeder] Seeding users...')

        for await (const [userIndex, user] of users.entries()) {
            const postsList = posts.filter(
                (post) => post.profile.email === user.email
            )
            const userPercentage = (
                ((userIndex + 1) / users.length) *
                100
            ).toFixed(2)

            logger.info(
                `[ElasticSeeder] [User: ${userPercentage}% - Post: 0.00%] Seeding user [user: ${user.email}, posts: 0/${postsList.length}, queue: ${userIndex + 1}/${users.length}]`
            )

            const userId = await this.userService
                .findOne({ email: user.email })
                .then((foundUser) => (foundUser ? foundUser.uuid : ''))

            const usersIndex =
                postsList.length > 0 ? 'blogger_users' : 'reader_users'

            await client.index({
                index: usersIndex,
                body: {
                    uuid: userId,
                    email: user.email,
                },
            })

            for await (const [postIndex, post] of postsList.entries()) {
                await client.index({
                    index: 'posts',
                    body: {
                        title: post.title,
                        body: post.body,
                        profile: {
                            uuid: userId,
                            email: post.profile.email,
                        },
                        category: post.category
                            .toLowerCase()
                            .replace(/ /g, '-'),
                        createdAt: post.createdAt,
                        updatedAt: post.updatedAt,
                    },
                })

                const postPercentage = (
                    ((postIndex + 1) / postsList.length) *
                    100
                ).toFixed(2)
                logger.info(
                    `[ElasticSeeder] [User: ${userPercentage}% - Post: ${postPercentage}%] Seeding user [user: ${user.email}, posts: ${postIndex + 1}/${postsList.length}, queue: ${userIndex + 1}/${users.length}]`
                )
            }
        }

        logger.info('[ElasticSeeder] Seeding users done!')
    }
}
