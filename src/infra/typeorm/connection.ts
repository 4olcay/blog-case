import { DataSource } from 'typeorm'
import { User } from '../../domain/user/user.entity'
import { Post } from '../../domain/post/post.entity'
import { Comment } from '../../domain/post/comment/comment.entity'

const {
    POSTGRES_DB_HOST,
    POSTGRES_DB_PORT,
    POSTGRES_DB_USERNAME,
    POSTGRES_DB_PASSWORD,
    POSTGRES_DB_NAME,
} = process.env

export const TypeormPostgresDataSource = new DataSource({
    type: 'postgres',
    host: POSTGRES_DB_HOST || 'localhost',
    port: (POSTGRES_DB_PORT as unknown as number) || 5432,
    username: POSTGRES_DB_USERNAME,
    password: POSTGRES_DB_PASSWORD,
    database: POSTGRES_DB_NAME,
    synchronize: true,
    logging: false,
    entities: [User, Post, Comment],
    subscribers: [],
    migrations: [],
})
