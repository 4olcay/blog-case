import { IsEmail, IsUUID } from 'class-validator'

export class UserDTO {
    @IsUUID()
    uuid!: string

    @IsEmail()
    email!: string
}

export class DeleteBloggerDTO {
    @IsUUID()
    uuid!: string
}

export class DeleteReaderDTO {
    @IsUUID()
    uuid!: string
}
