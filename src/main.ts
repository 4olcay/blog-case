import 'reflect-metadata'
import { config } from 'dotenv'

config()

import { container } from 'tsyringe'
import { TransportationRegistryService } from './transportation/transportation.registry'
import { TypeormPostgresDataSource } from './infra/typeorm/connection'
import { PostgresSeeder } from './infra/typeorm/seeder/seeder'
import { ElasticSearchSeeder } from './infra/elasticsearch/seeder/seeder'

const bootstrap = async () => {
    container.resolve(TransportationRegistryService)

    await TypeormPostgresDataSource.initialize()

    if (process.env.POSTGRES_SEED == 'true') {
        container.resolve(PostgresSeeder)
    }

    if (process.env.ELASTIC_SEED == 'true') {
        container.resolve(ElasticSearchSeeder)
    }
}

bootstrap()
