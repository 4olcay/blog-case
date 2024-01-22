import { IsString } from 'class-validator'
import { CreateCommentDTO } from '../../../../../../application/post/comment/usecase/create/dto/comment-create.dto'

export class CreateCommentRequest
    implements Omit<CreateCommentDTO, 'user_id' | 'post_id'>
{
    @IsString()
    body!: string
}
