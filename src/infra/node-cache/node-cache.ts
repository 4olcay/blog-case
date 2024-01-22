import NCache from 'node-cache'
import { singleton } from 'tsyringe'

export interface INodeCache {
    get<T>(key: string): T | undefined
    set<T>(key: string, value: T): boolean
    delete(key: string): number
    flush(): void
}

@singleton()
export class NodeCache implements INodeCache {
    private readonly cache: NCache

    constructor() {
        this.cache = new NCache({
            stdTTL: 3600,
            checkperiod: 3600,
        })
    }

    createUserSession(uuid: string, token: string): void {
        this.cache.set(`user-session:${uuid}`, token)
    }

    get<T>(key: string): T | undefined {
        return this.cache.get<T>(key)
    }

    set<T>(key: string, value: T): boolean {
        return this.cache.set<T>(key, value)
    }

    delete(key: string): number {
        return this.cache.del(key)
    }

    flush(): void {
        return this.cache.flushAll()
    }
}
