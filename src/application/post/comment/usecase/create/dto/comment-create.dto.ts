import { IsUUID, IsString, Length } from 'class-validator'

export class CreateCommentDTO {
    @IsUUID()
    user_id!: string

    @IsUUID()
    post_id!: string

    @IsString()
    @Length(1)
    body!: string
}
