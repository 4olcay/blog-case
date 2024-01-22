import { singleton } from 'tsyringe'
import { NodeCache } from '../node-cache'

export interface IUserSessionCache {
    create(uuid: string, token: string): void
    get(uuid: string): string | undefined
    delete(uuid: string): void
    validate(uuid: string, token: string): boolean
}

@singleton()
export class UserSessionCache implements IUserSessionCache {
    constructor(private readonly cache: NodeCache) {}

    create(uuid: string, token: string): void {
        this.cache.set<string>(`user-session:${uuid}`, token)
    }

    get(uuid: string): string | undefined {
        return this.cache.get<string>(`user-session:${uuid}`)
    }

    delete(uuid: string): boolean {
        return this.cache.delete(`user-session:${uuid}`) > 0
    }

    validate(uuid: string, token: string): boolean {
        return this.cache.get<string>(`user-session:${uuid}`) === token
    }
}
