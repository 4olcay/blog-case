export class CommentNotFoundException extends Error {
    constructor() {
        super('Comment not found')
    }
}
