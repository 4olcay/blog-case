import { JwtPayload } from 'jsonwebtoken'
import { AuthenticationJWTToken } from '../../../domain/user/model/token'

export interface IAuthenticationService {
    verify(token: string): AuthenticationJWTToken & JwtPayload
    decode(token: string): AuthenticationJWTToken & JwtPayload
    sign(data: AuthenticationJWTToken, ttl?: number): string
}
