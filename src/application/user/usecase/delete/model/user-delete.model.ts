import { UseCase } from '../../../../common/model/usecase'

export interface IDeleteUserCase extends UseCase {
    delete(uuid: string): Promise<void>
}
