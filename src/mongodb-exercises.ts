const test: string | undefined = process.env.TEST
console.log('Test env-fil: ' + test)

import {
  MongoClient,
  Db,
  Collection,
  ObjectId,
  WithId,
  FindCursor,
  InsertOneResult,
  DeleteResult,
  UpdateResult,
} from 'mongodb'
import { Animal } from './models/animals'

async function connect() {
  const con: string | undefined = process.env.CONNECTION_STRING
  if (!con) {
    console.log('ERROR: connection string not found!')
    return
  }
  try {
    const client: MongoClient = new MongoClient(con)

    const db: Db = await client.db('Exercise')
    const col: Collection<Animal> = db.collection<Animal>('animalFacts')

    await fidingTheElephant(col)

    await client.close()
  } catch (error: any) {
    console.log('An error occurred. ' + error.message)
  }
  console.log('Program executed successfully.')
}
async function fidingTheElephant(col: Collection<Animal>): Promise<void> {
  const filter = { score: 32 }
  const found: WithId<Animal> | null = await col.findOne(filter)
  if (found) {
    console.log('The animal you were serching for is: ' + found)
  } else {
    console.log('The animal is out somewhere')
  }
}

connect()
