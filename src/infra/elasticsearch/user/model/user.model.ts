import { DeleteBloggerDTO, DeleteReaderDTO, UserDTO } from '../dto/user.dto'

export interface IUserElasticSearch {
    indexReader(data: UserDTO): Promise<void>
    deleteReader(data: DeleteReaderDTO): Promise<void>
    getReaderCount(): Promise<number>

    indexBlogger(data: UserDTO): Promise<void>
    deleteBlogger(data: DeleteBloggerDTO): Promise<void>
    getBloggerCount(): Promise<number>
}
