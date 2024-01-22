import { posts } from '../../../../dummy-data/post/post.dummy'
import { users } from '../../../../dummy-data/user/user.dummy'
import { singleton } from 'tsyringe'
import logger from '../../../transportation/winston/logger'
import { Categories } from '../../../domain/post/model/categories'
import { UserService } from '../../../application/user/user.service'
import { PostService } from '../../../application/post/post.service'

@singleton()
export class PostgresSeeder {
    constructor(
        private readonly userService: UserService,
        private readonly postService: PostService
    ) {
        this.seedUsers()
    }

    async seedUsers() {
        logger.info('Seeding users...')
        for await (const [userIndex, user] of users.entries()) {
            const postsList = posts.filter(
                (post) => post.profile.email === user.email
            )

            const userPercentage = (
                ((userIndex + 1) / users.length) *
                100
            ).toFixed(2)

            logger.info(
                `[User: ${userPercentage}% - Post: 0.00%] Seeding user [user: ${user.email}, posts: 0/${postsList.length}, queue: ${userIndex + 1}/${users.length}]`
            )

            const createdUser = await this.userService.create({
                full_name: user.full_name,
                email: user.email,
                address: user.address,
                location: user.location,
                password: 'M!n!m@lP@ssw0rd',
            })

            for await (const [postIndex, post] of postsList.entries()) {
                await this.postService.create({
                    user_id: createdUser.uuid,
                    body: post.body,
                    title: post.title,
                    category: post.category.toLowerCase() as Categories,
                })

                const postPercentage = (
                    ((postIndex + 1) / postsList.length) *
                    100
                ).toFixed(2)
                logger.info(
                    `[User: ${userPercentage}% - Post: ${postPercentage}%] Seeding user [user: ${user.email}, posts: ${postIndex + 1}/${postsList.length}, queue: ${userIndex + 1}/${users.length}]`
                )
            }
        }
        logger.info('Seeding users done!')
    }
}
