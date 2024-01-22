export class PostNotFoundException extends Error {
    constructor() {
        super('Post not found')
    }
}
