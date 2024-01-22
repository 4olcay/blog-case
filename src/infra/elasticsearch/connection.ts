import { Client } from '@elastic/elasticsearch'

const { ELASTIC_NODE, ELASTIC_API_ID, ELASTIC_API_KEY } = process.env

const client = new Client({
    node: ELASTIC_NODE,
    auth: {
        apiKey: {
            id: ELASTIC_API_ID || '',
            api_key: ELASTIC_API_KEY || '',
        },
    },
})

export default client
