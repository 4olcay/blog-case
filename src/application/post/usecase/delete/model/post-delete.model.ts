import { UseCase } from '../../../../common/model/usecase'

export interface IDeletePostCase extends UseCase {
    deleteById(id: string): Promise<void>
}
