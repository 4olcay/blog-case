declare namespace Express {
    export interface Request {
        user: import('../../../../domain/user/model/token').AuthenticationJWTToken
    }
}
