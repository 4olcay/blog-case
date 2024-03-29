import { singleton } from 'tsyringe'
import client from '../connection'
import { posts } from '../../../../dummy-data/post/post.dummy'
import logger from '../../../transportation/winston/logger'
import { users } from '../../../../dummy-data/user/user.dummy'
import { UserService } from '../../../application/user/user.service'

@singleton()
export class ElasticSearchSeeder {
    private indices: string[] = [
        'posts',
        'reader_users',
        'blogger_users',
    ];

    constructor(private readonly userService: UserService) {
        this.initialize()
    }

    async initialize() {
        await this.removeExistingIndices()
        await this.createPostIndices()
        await this.createReaderUserIndices()
        await this.createBloggerUserIndices()
        await this.seedUsers()
    }

    async removeExistingIndices() {
        for await (const index of this.indices) {
            logger.info(`[ElasticSeeder] Removing ${index} index if exists...`)

            await client.indices.delete({
                index,
            }).catch(error => {
                const errorType = error.meta.body.error.type;

                if (errorType === 'index_not_found_exception') {
                    logger.info(`[ElasticSeeder] ${index} index not found, skipping deletion`)
                } else {
                    logger.error(`[ElasticSeeder] Something went wrong while deleting ${index} index, code: ${errorType}`)
                }
            })
        }
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
        }).catch(error => {
            const errorType = error.meta.body.error.type;

            if (errorType === 'resource_already_exists_exception') {
                logger.info('[ElasticSeeder] Post index already exists, skipping creation')
            } else {
                logger.error(`[ElasticSeeder] Something went wrong while creating post index, code: ${errorType}`)
            }
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
        }).catch(error => {
            const errorType = error.meta.body.error.type;

            if (errorType === 'resource_already_exists_exception') {
                logger.info('[ElasticSeeder] reader_users index already exists, skipping creation')
            } else {
                logger.error(`[ElasticSeeder] Something went wrong while creating reader_users index, code: ${errorType}`)
            }
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
        }).catch(error => {
            const errorType = error.meta.body.error.type;

            if (errorType === 'resource_already_exists_exception') {
                logger.info('[ElasticSeeder] blogger_users index already exists, skipping creation')
            } else {
                logger.error(`[ElasticSeeder] Something went wrong while creating blogger_users index, code: ${errorType}`)
            }
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
