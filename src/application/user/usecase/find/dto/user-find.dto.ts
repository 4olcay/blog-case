import { IsEmail, IsStrongPassword } from 'class-validator'
import { User } from '../../../../../domain/user/user.entity'

export class FindForAuthenticationDTO {
    @IsEmail()
    email!: string

    @IsStrongPassword()
    password!: string
}

export class FindUserDTO implements Partial<Omit<User, 'deletedAt'>> {}
