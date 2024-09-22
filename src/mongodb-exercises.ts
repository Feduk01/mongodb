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
    const rabbit: Animal = {
      species: 'Rabbit',
      factoid: 'Rabbits are extremely cute',
      score: 25,
    }
    await fidingThePingvin(col)
    await findingHighScoreAnimals(col)
    // await insertRabbit(col, rabbit)
    await deleteRabbit(col)
    // await updateRabbit(col)

    await client.close()
  } catch (error: any) {
    console.log('An error occurred. ' + error.message)
  }
  console.log('Program executed successfully.')
}
async function fidingThePingvin(col: Collection<Animal>): Promise<void> {
  const filter = { score: 32 }
  const found: WithId<Animal> | null = await col.findOne(filter)
  if (found) {
    console.log('The animal you were serching for is: ', found)
  } else {
    console.log('The animal is out somewhere')
  }
}
async function findingHighScoreAnimals(col: Collection<Animal>): Promise<void> {
  const filter = { score: { $gte: 60 } }
  const cursor: FindCursor<WithId<Animal>> = col.find(filter)
  const found: WithId<Animal>[] = await cursor.toArray()

  if (found.length < 1) {
    console.log('No animal is cool enough:(')
    return
  }
  found.forEach((animal) => {
    console.log(
      `${animal.species} has a score of ${animal.score} and intresting fact: ${animal.factoid}`
    )
  })
}

async function insertRabbit(
  col: Collection<Animal>,
  rabbit: Animal
): Promise<ObjectId | null> {
  const result: InsertOneResult<Animal> = await col.insertOne(rabbit)
  if (!result.acknowledged) {
    console.log('Could not insert rabbit')
    return null
  }
  console.log(`${rabbit.species} was added to your collection`)

  return result.insertedId
}

async function deleteRabbit(col: Collection<Animal>): Promise<void> {
  const filter = { species: 'Easter Bunny' }
  const result: DeleteResult = await col.deleteMany(filter) //deleteOne tar bort en, deleteMany alla
  if (!result.acknowledged) {
    console.log('Could not delete any rabbits')
    return
  }

  console.log(`Deleted ${result.deletedCount} rabbit`)
}

async function updateRabbit(col: Collection<Animal>): Promise<void> {
  const filter = { species: 'Rabbit' }
  const updateFilter = {
    $set: {
      species: 'Easter Bunny',
      score: 58,
    },
  }
  const result: UpdateResult<Animal> = await col.updateOne(filter, updateFilter)
  if (!result.acknowledged) {
    console.log('Could not update any rabbits')
    return
  }
  console.log(
    `Matched ${result.matchedCount} documents and modified ${result.modifiedCount}`
  )
}
connect()
