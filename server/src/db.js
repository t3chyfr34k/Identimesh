import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/idenflow'

let isConnecting = false

export async function connectMongo() {
  if (mongoose.connection.readyState === 1) return mongoose.connection
  if (isConnecting) return new Promise((resolve) => {
    const onOpen = () => {
      mongoose.connection.off('open', onOpen)
      resolve(mongoose.connection)
    }
    mongoose.connection.on('open', onOpen)
  })
  isConnecting = true
  await mongoose.connect(MONGODB_URI, { maxPoolSize: 10 })
  isConnecting = false
  return mongoose.connection
}

export async function ensureCollections() {
  const db = mongoose.connection.db
  const existing = (await db.listCollections().toArray()).map(c => c.name)
  const need = ['users', 'searches']
  for (const name of need) if (!existing.includes(name)) await db.createCollection(name)
}