import {
    IsString,
    Length,
    IsEmail,
    IsObject,
    IsStrongPassword,
} from 'class-validator'
import { User } from '../../../../../domain/user/user.entity'
import { Location } from '../../../../../domain/user/model/location'

export class CreateUserDTO
    implements
        Omit<
            User,
            | 'uuid'
            | 'username'
            | 'posts'
            | 'comments'
            | 'createdAt'
            | 'updatedAt'
            | 'deletedAt'
        >
{
    @IsString()
    @Length(3, 64)
    full_name!: string

    @IsEmail()
    email!: string

    @IsString()
    address!: string

    @IsObject()
    location!: Location

    @IsStrongPassword()
    password!: string
}
