import { Comment } from '../../../../../../domain/post/comment/comment.entity'

export class FindCommentDTO implements Omit<Partial<Comment>, 'deletedAt'> {}
