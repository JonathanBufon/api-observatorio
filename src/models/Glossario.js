import mongoose from 'mongoose';

const glossarioSchema = new mongoose.Schema({
    termo: { type: String, required: true, unique: true, trim: true },
    definicao: { type: String, required: true }
}, { timestamps: true });

const Glossario = mongoose.model('Glossario', glossarioSchema);
export default Glossario;
