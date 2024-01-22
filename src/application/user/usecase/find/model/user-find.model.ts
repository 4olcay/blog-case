import { User } from '../../../../../domain/user/user.entity'
import { UseCase } from '../../../../common/model/usecase'
import { FindForAuthenticationDTO, FindUserDTO } from '../dto/user-find.dto'

export interface IFindUserCase extends UseCase {
    findForAuthentication(
        data: FindForAuthenticationDTO
    ): Promise<{ token: string }>
    findOne(search: FindUserDTO): Promise<User | null>
    find(search: FindUserDTO): Promise<User[]>
    findBloggerCount(): Promise<number>
    findReaderCount(): Promise<number>
}
