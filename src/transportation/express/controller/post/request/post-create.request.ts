import { IsString, Length } from 'class-validator'
import { CreatePostDTO } from '../../../../../application/post/usecase/create/dto/post-create.dto'
import { Categories } from '../../../../../domain/post/model/categories'

export class CreatePostRequest implements Omit<CreatePostDTO, 'user_id'> {
    @IsString()
    @Length(1)
    title!: string

    @IsString()
    @Length(1)
    body!: string

    @IsString()
    @Length(1)
    category!: Categories
}
