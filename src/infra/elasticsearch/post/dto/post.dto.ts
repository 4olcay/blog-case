import { IsArray, IsDate, IsObject, IsString, IsUUID } from 'class-validator'
import { UserDTO } from '../../user/dto/user.dto'

export class PostDTO {
    @IsUUID()
    uuid!: string

    @IsString()
    title!: string

    @IsString()
    body!: string

    @IsObject()
    profile!: UserDTO

    @IsString()
    category!: string

    @IsDate()
    createdAt!: Date

    @IsDate()
    updatedAt!: Date
}

export class DeletePostDTO {
    @IsUUID()
    uuid!: string
}

export class PostGroupByInterval {
    @IsString()
    date!: string

    @IsArray()
    categories!: []
}

export class CategoryPercents {
    @IsString()
    name!: string

    @IsString()
    percent!: number
}
