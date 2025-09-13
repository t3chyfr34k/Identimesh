import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import routes from './routes.js'
import { connectMongo, ensureCollections } from './db.js'
import { User, Search } from './models/index.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new SocketIOServer(httpServer, { cors: { origin: '*' } })
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.set('io', io)
app.use('/api', routes)

io.on('connection', (socket) => {
  console.log('Realtime client connected', socket.id)
  socket.on('disconnect', () => console.log('Realtime client disconnected', socket.id))
})

;(async () => {
  try {
    await connectMongo()
    await Promise.all([User.init(), Search.init()])
    await ensureCollections()
    httpServer.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`)
    })
  } catch (e) {
    console.error('Startup error:', e)
    process.exit(1)
  }
})()