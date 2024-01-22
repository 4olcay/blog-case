import jwt, { JwtPayload } from 'jsonwebtoken'
import { injectable } from 'tsyringe'
import { IJWT } from './model/jwt.model'

@injectable()
export class JWT implements IJWT {
    verify(token: string): string | JwtPayload {
        const { JWT_KEY } = process.env

        return jwt.verify(token, JWT_KEY as string)
    }

    sign(data: object, ttl = 3600): string {
        const { JWT_KEY } = process.env

        return jwt.sign(data, JWT_KEY as string, {
            expiresIn: ttl,
        })
    }

    decode(token: string): null | string | JwtPayload {
        return jwt.decode(token)
    }
}
