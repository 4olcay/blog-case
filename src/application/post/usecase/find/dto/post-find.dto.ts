import { Post } from '../../../../../domain/post/post.entity'

export class FindPostDTO implements Partial<Omit<Post, 'deletedAt'>> {}
