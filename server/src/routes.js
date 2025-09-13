import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { User, Search } from './models/index.js'

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me'

function signToken(user) {
  return jwt.sign({ uid: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: '7d' })
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || ''
  const [type, token] = header.split(' ')
  if (type !== 'Bearer' || !token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

router.get('/health', (_req, res) => {
  res.json({ ok: true })
})

router.post('/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' })
    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ error: 'Email already in use' })
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, passwordHash })
    const token = signToken(user)
    res.status(201).json({ user: user.toSafeJSON(), token })
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' })
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' })
    const token = signToken(user)
    res.json({ user: user.toSafeJSON(), token })
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

router.get('/auth/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.uid)
  if (!user) return res.status(404).json({ error: 'Not found' })
  res.json({ user: user.toSafeJSON() })
})

router.post('/search-results', authMiddleware, async (req, res) => {
  try {
    const doc = await Search.create({ ...req.body, userId: req.user.uid })
    const io = req.app.get('io')
    io?.emit('search-result:created', { id: doc._id.toString(), userId: req.user.uid })
    res.status(201).json({ success: true, id: doc._id.toString() })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Internal Server Error' })
  }
})

router.get('/search-results/:id', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ error: 'Invalid id' })
    const doc = await Search.findOne({ _id: req.params.id, userId: req.user.uid })
    if (!doc) return res.status(404).json({ success: false, error: 'Not found' })
    res.json({ success: true, data: doc })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Internal Server Error' })
  }
})

router.get('/search-results', authMiddleware, async (req, res) => {
  try {
    const docs = await Search.find({ userId: req.user.uid }).sort({ createdAt: -1 }).limit(100)
    res.json({ success: true, data: docs })
  } catch (err) {
    res.status(500).json({ success: false, error: 'Internal Server Error' })
  }
})

export default router