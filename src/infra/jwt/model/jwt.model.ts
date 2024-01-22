import { JwtPayload } from 'jsonwebtoken'

export interface IJWT {
    verify(token: string): string | JwtPayload
    sign(data: object, ttl?: number): string
    decode(token: string): null | JwtPayload | string
}
