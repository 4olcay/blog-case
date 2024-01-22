import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from '../../base/base.entity'
import { User } from '../../user/user.entity'
import { Post } from '../post.entity'
import { IsObject, IsString } from 'class-validator'

@Entity()
export class Comment extends BaseEntity {
    @ManyToOne(() => User, (user) => user.comments)
    @IsObject()
    profile!: User

    @ManyToOne(() => Post, (post) => post.comments)
    @IsObject()
    post!: Post

    @Column({ type: 'text', nullable: false })
    @IsString()
    body: string = ''
}
