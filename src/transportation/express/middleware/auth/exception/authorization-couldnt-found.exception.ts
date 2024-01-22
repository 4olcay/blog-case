export class AuthorizationCouldntFoundException extends Error {
    constructor() {
        super('Authorization could not found in the headers.')
    }
}
