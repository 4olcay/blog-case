import { IsUUID, IsString } from 'class-validator'

export class UpdatePostDTO {
    @IsUUID()
    uuid!: string

    @IsString()
    title!: string

    @IsString()
    body!: string
}
