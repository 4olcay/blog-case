import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import { Categories } from './model/categories'
import { BaseEntity } from '../base/base.entity'
import { User } from '../user/user.entity'
import { Comment } from './comment/comment.entity'
import { IsArray, IsString } from 'class-validator'

@Entity()
export class Post extends BaseEntity {
    @ManyToOne(() => User, (user) => user.posts)
    @IsArray()
    profile!: User

    @OneToMany(() => Comment, (comment) => comment.post)
    @IsArray()
    comments!: Comment[]

    @Column({ type: 'varchar', nullable: false })
    @IsString()
    category!: Categories

    @Column({ type: 'varchar', nullable: true })
    @IsString()
    title!: string

    @Column({ type: 'text', nullable: false })
    @IsString()
    body!: string
}
