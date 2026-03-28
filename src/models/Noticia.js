import mongoose from 'mongoose';

const noticiaSchema = new mongoose.Schema({

    // ── DADOS BÁSICOS ──
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    resumo: {
        type: String,
        required: true
    },
    linkSite: {
        type: String,
        trim: true
    },
    dataPublicacao: {
        type: Date,
        default: Date.now
    },
    dataExpiracao: {
        type: Date
    },
    destaque: {
        type: Boolean,
        default: false
    },
    categorias: [{
        type: String,
        enum: ['economia', 'orcamento', 'judiciario', 'legislativo', 'saude', 'educacao', 'seguranca', 'internacional'],
        required: true
    }],
    fontes: [{
        type: String,
        trim: true
    }],

    // ── ANÁLISE ──
    analise: {
        beneficiados: [{
            tipo: {
                type: String,
                enum: ['direto', 'indireto'],
                required: true
            },
            descricao: {
                type: String,
                required: true
            }
        }],
        efeitosPraticos: [{
            type: String
        }]
    },

    // ── CORTINA DE FUMAÇA ──
    cortinaFumaca: {
        titulo: { type: String },
        descricao: { type: String },
        evidencias: [{
            rotulo: { type: String },
            texto: { type: String }
        }]
    },

    // ── CONFRONTO: DISCURSO vs REALIDADE ──
    confronto: {
        discursoOficial: { type: String },
        realidade: { type: String }
    },

    // ── RAIO-X DOS AGENTES PÚBLICOS ──
    agentesPublicos: [{
        nome: { type: String, required: true },
        iniciais: { type: String, required: true },
        cargo: { type: String, required: true },
        historico: { type: String, required: true }
    }],

    // ── VÍDEO DE REFERÊNCIA ──
    videoReferencia: {
        titulo: { type: String },
        descricao: { type: String },
        url: { type: String }
    },

    // ── GLOSSÁRIO INLINE ──
    glossario: [{
        termo: { type: String, required: true },
        definicao: { type: String, required: true }
    }]

}, {
    timestamps: true
});

noticiaSchema.index({ titulo: 'text' });
noticiaSchema.index({ categorias: 1 });
noticiaSchema.index({ dataPublicacao: -1 });
noticiaSchema.index({ destaque: 1, dataPublicacao: -1 });

const Noticia = mongoose.model('Noticia', noticiaSchema);
export default Noticia;
