import {
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { v4 as uuid } from 'uuid'

@Entity()
export class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string = uuid()

    @DeleteDateColumn({ select: false })
    deletedAt: Date | null = null

    @UpdateDateColumn()
    updatedAt: Date = new Date()

    @CreateDateColumn()
    createdAt: Date = new Date()
}
