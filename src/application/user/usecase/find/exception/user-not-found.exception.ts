export class UserNotFoundException extends Error {
    constructor() {
        super('User could not found.')
    }
}
