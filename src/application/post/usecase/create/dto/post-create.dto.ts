import { IsUUID, IsString } from 'class-validator'
import { Categories } from '../../../../../domain/post/model/categories'

export class CreatePostDTO {
    @IsUUID()
    user_id!: string

    @IsString()
    body!: string

    @IsString()
    category!: Categories

    @IsString()
    title!: string
}
