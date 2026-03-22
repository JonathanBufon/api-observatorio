import express from 'express';
import newsRoutes from './src/routes/newsRoutes.js';
import dotenv from 'dotenv';
import connectDB from './src/config/mongoose.js'

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Rotas
app.use('/api/news', newsRoutes);

// Rota inical
app.get('/', (req, res) => {
    res.send('API Rodando!');
})
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
})