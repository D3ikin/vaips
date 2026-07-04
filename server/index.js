// ===== СЕРВЕР МАГАЗИНА =====
// Хранит данные в data/store.json, отдаёт их сайту и принимает правки из админки.
// Запуск: node server/index.js   (порт: переменная PORT, по умолчанию 3001)
// Пароль админки: переменная ADMIN_PASSWORD или файл data/admin-password.txt
// (генерируется автоматически при первом запуске).

import express from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
import defaults from '../src/data/defaults.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const DATA_DIR = path.join(ROOT, 'data')
const STORE_FILE = path.join(DATA_DIR, 'store.json')
const PASSWORD_FILE = path.join(DATA_DIR, 'admin-password.txt')
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads')
const DIST_DIR = path.join(ROOT, 'dist')
const PORT = process.env.PORT || 3001

// --- подготовка данных ---
fs.mkdirSync(UPLOADS_DIR, { recursive: true })

if (!fs.existsSync(STORE_FILE)) {
  fs.writeFileSync(STORE_FILE, JSON.stringify(defaults, null, 2))
  console.log('Создан data/store.json с данными по умолчанию')
}

let adminPassword = process.env.ADMIN_PASSWORD
if (!adminPassword) {
  if (!fs.existsSync(PASSWORD_FILE)) {
    fs.writeFileSync(PASSWORD_FILE, crypto.randomBytes(8).toString('hex'))
    console.log('Сгенерирован пароль админки — смотрите файл data/admin-password.txt')
  }
  adminPassword = fs.readFileSync(PASSWORD_FILE, 'utf8').trim()
}

// --- простая авторизация по токену ---
const tokens = new Map() // token -> срок действия (ms)
const TOKEN_TTL = 24 * 60 * 60 * 1000

function issueToken() {
  const token = crypto.randomBytes(24).toString('hex')
  tokens.set(token, Date.now() + TOKEN_TTL)
  return token
}

function requireAuth(req, res, next) {
  const token = (req.headers.authorization || '').replace(/^Bearer /, '')
  const expires = tokens.get(token)
  if (!expires || expires < Date.now()) {
    tokens.delete(token)
    return res.status(401).json({ error: 'Не авторизован' })
  }
  next()
}

// --- загрузка картинок ---
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS_DIR,
    filename(req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase() || '.webp'
      cb(null, `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`)
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    cb(null, /^image\//.test(file.mimetype))
  },
})

// --- приложение ---
const app = express()
app.use(express.json({ limit: '1mb' }))

app.get('/api/store', (req, res) => {
  res.sendFile(STORE_FILE)
})

app.post('/api/login', (req, res) => {
  const { password } = req.body || {}
  if (password !== adminPassword) {
    return res.status(401).json({ error: 'Неверный пароль' })
  }
  res.json({ token: issueToken() })
})

app.put('/api/store', requireAuth, (req, res) => {
  const data = req.body
  // минимальная проверка структуры, чтобы не сохранить мусор
  if (
    !data ||
    typeof data !== 'object' ||
    !data.model ||
    typeof data.model.price !== 'number' ||
    !Array.isArray(data.flavors) ||
    !Array.isArray(data.wallets)
  ) {
    return res.status(400).json({ error: 'Некорректная структура данных' })
  }
  fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2))
  res.json({ ok: true })
})

app.post('/api/upload', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Файл не принят (только картинки до 5 МБ)' })
  }
  res.json({ path: `/uploads/${req.file.filename}` })
})

app.use('/uploads', express.static(UPLOADS_DIR))

// в продакшене отдаём собранный сайт (npm run build)
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR))
  app.get('*', (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`)
  console.log(`Админка: http://localhost:${PORT}/admin (в dev-режиме — на порту Vite)`)
})
