import { singleton } from 'tsyringe'
import { AuthenticationJWTToken } from '../../domain/user/model/token'
import { JwtPayload } from 'jsonwebtoken'
import { UserSessionCache } from '../../infra/node-cache/cache/user-session'
import { InvalidTokenException } from './exception/auth-invalid-token.exception'
import { JWT } from '../../infra/jwt/jwt'
import { IAuthenticationService } from './model/authentication.model'

@singleton()
export class AuthenticationService implements IAuthenticationService {
    constructor(
        private readonly jwt: JWT,
        private readonly cache: UserSessionCache
    ) {}

    verify(token: string): AuthenticationJWTToken & JwtPayload {
        try {
            const decoded = this.jwt.verify(token) as AuthenticationJWTToken &
                JwtPayload

            if (!this.cache.validate(decoded.uuid, token)) {
                throw new InvalidTokenException()
            }

            return decoded
        } catch (error) {
            throw new InvalidTokenException()
        }
    }

    decode(token: string): AuthenticationJWTToken & JwtPayload {
        return this.jwt.decode(token) as AuthenticationJWTToken & JwtPayload
    }

    sign(data: AuthenticationJWTToken, ttl = 3600): string {
        this.cache.delete(data.uuid)

        const token = this.jwt.sign(data, ttl)
        this.cache.create(data.uuid, token)
        return token
    }

    deleteUserSession(uuid: string): void {
        this.cache.delete(uuid)
    }
}
