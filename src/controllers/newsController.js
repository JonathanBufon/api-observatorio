import Noticia from "../models/Noticia.js";

const notExpired = {
    $or: [
        { dataExpiracao: { $gte: new Date() } },
        { dataExpiracao: { $exists: false } },
        { dataExpiracao: null }
    ]
};

export const getAllNews = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = notExpired;

        const [news, total] = await Promise.all([
            Noticia.find(filter)
                .sort({ destaque: -1, dataPublicacao: -1 })
                .skip(skip)
                .limit(limit),
            Noticia.countDocuments(filter)
        ]);

        res.status(200).json({
            data: news,
            page,
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        next(error);
    }
};

export const getById = async (req, res, next) => {
    try {
        const news = await Noticia.findById(req.params.id);
        if (!news) return res.status(404).json({ message: "Notícia não encontrada" });
        res.status(200).json(news);
    } catch (error) {
        next(error);
    }
};

export const getByTitle = async (req, res, next) => {
    try {
        const news = await Noticia.find({
            titulo: { $regex: req.params.title, $options: 'i' }
        }).sort({ dataPublicacao: -1 });
        res.status(200).json(news);
    } catch (error) {
        next(error);
    }
};

export const getByDate = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.params;
        const news = await Noticia.find({
            dataPublicacao: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }).sort({ dataPublicacao: -1 });
        res.status(200).json(news);
    } catch (error) {
        next(error);
    }
};

export const getByCategory = async (req, res, next) => {
    try {
        const news = await Noticia.find({
            categorias: req.params.category
        }).sort({ dataPublicacao: -1 });
        res.status(200).json(news);
    } catch (error) {
        next(error);
    }
};

export const getFeatured = async (req, res, next) => {
    try {
        const news = await Noticia.find({
            destaque: true,
            ...notExpired
        }).sort({ dataPublicacao: -1 });
        res.status(200).json(news);
    } catch (error) {
        next(error);
    }
};

export const createNews = async (req, res, next) => {
    try {
        const noticia = new Noticia(req.body);
        const saved = await noticia.save();
        res.status(201).json(saved);
    } catch (error) {
        next(error);
    }
};

export const updateNews = async (req, res, next) => {
    try {
        const news = await Noticia.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!news) return res.status(404).json({ message: "Notícia não encontrada" });
        res.status(200).json(news);
    } catch (error) {
        next(error);
    }
};

export const deleteNews = async (req, res, next) => {
    try {
        const news = await Noticia.findByIdAndDelete(req.params.id);
        if (!news) return res.status(404).json({ message: "Notícia não encontrada" });
        res.status(200).json({ message: "Notícia removida" });
    } catch (error) {
        next(error);
    }
};
