import { UseCase } from '../../../../../common/model/usecase'

export interface IDeleteCommentCase extends UseCase {
    deleteById(id: string): Promise<void>
}
