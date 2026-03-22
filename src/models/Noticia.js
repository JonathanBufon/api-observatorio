import mongoose from 'mongoose';

const noticiaSchema = new mongoose.Schema({
    // Usar o JSON que o Rafa tem como exemplo para a Model, ex:
    // titulo: { type: String, required: true },
    // url: { type: String, required: true, unique: true },
    // fonte: { type: String, required: true },
    // dataPublicacao: { type: Date },
    // conteudo: { type: String },
}, {
    timestamps: true
});

const Noticia = mongoose.model('Noticia', noticiaSchema);
export default Noticia;