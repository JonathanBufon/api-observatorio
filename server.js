import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/mongoose.js';
import newsRoutes from './src/routes/newsRoutes.js';
import glossarioRoutes from './src/routes/glossarioRoutes.js';
import errorHandler from './src/middleware/errorHandler.js';

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/news', newsRoutes);
app.use('/api/glossario', glossarioRoutes);

app.get('/', (req, res) => {
    res.send('API Rodando!');
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
