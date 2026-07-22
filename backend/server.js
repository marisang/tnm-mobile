import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import artistasRouter from './routes/artistas.js';
import obrasRouter from './routes/obras.js';
import showsRouter from './routes/shows.js';
import contratosRouter from './routes/contratos.js';
import transacoesRouter from './routes/transacoes.js';
import albunsRouter from './routes/albuns.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'TNM API está funcionando!' });
});

// Rotas
app.use('/api/artistas', artistasRouter);
app.use('/api/obras', obrasRouter);
app.use('/api/shows', showsRouter);
app.use('/api/contratos', contratosRouter);
app.use('/api/transacoes', transacoesRouter);
app.use('/api/albuns', albunsRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});
