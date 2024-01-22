import { BaseEntity } from '../base/base.entity'
import { Column, Entity, OneToMany } from 'typeorm'
import { Location } from './model/location'
import { Post } from '../post/post.entity'
import { Comment } from '../post/comment/comment.entity'

@Entity()
export class User extends BaseEntity {
    @Column({ type: 'varchar', nullable: false, unique: true })
    username!: string

    @Column({ type: 'varchar', nullable: false })
    full_name!: string

    @Column({ type: 'varchar', nullable: false, unique: true })
    email!: string

    @Column({ type: 'varchar', nullable: false })
    address!: string

    @Column({ type: 'json', nullable: false })
    location!: Location

    @Column({ type: 'varchar', nullable: false, select: false })
    password!: string

    @OneToMany(() => Post, (post) => post.profile)
    posts!: Post[]

    @OneToMany(() => Comment, (comment) => comment.profile)
    comments!: Comment[]
}
