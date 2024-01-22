import { container, singleton } from 'tsyringe'
import { ExpressServer } from './express/server'

@singleton()
export class TransportationRegistryService {
    constructor() {
        container.resolve(ExpressServer)
    }
}
