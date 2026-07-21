import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

// Import routes
import artistasRoutes from './routes/artistas.js'
import obrasRoutes from './routes/obras.js'
import showsRoutes from './routes/shows.js'
import contratosRoutes from './routes/contratos.js'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Create Express app
const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' })
})

// API Routes
app.use('/api/artistas', artistasRoutes)
app.use('/api/obras', obrasRoutes)
app.use('/api/shows', showsRoutes)
app.use('/api/contratos', contratosRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: err.message || 'Internal Server Error' })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
  console.log(`📊 Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`)
  console.log(`📚 API Docs: http://localhost:${PORT}/api/health`)
})

export default app
