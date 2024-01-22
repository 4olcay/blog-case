import {
    IsEmail,
    IsObject,
    IsOptional,
    IsString,
    IsStrongPassword,
    Length,
} from 'class-validator'
import { Location } from '../../../../../domain/user/model/location'

export class UpdateUserDTO {
    @IsString()
    @Length(3, 24)
    @IsOptional()
    username?: string

    @IsString()
    @IsOptional()
    @Length(3, 64)
    full_name?: string

    @IsEmail()
    @IsOptional()
    @Length(3, 64)
    email?: string

    @IsString()
    @IsOptional()
    @Length(3, 64)
    address?: string

    @IsObject()
    @IsOptional()
    location?: Location

    @IsStrongPassword()
    @IsOptional()
    @Length(3, 64)
    password?: string
}
