import Noticia from "../models/Noticia.js";

export const getByTitle = async (req, res) => {
    try {
        const { title } = req.params; // busaca usando o titutlo definido no Model
        const news = await Noticia.find({
            titulo: { $regex: title, $options: 'i'}
        });
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar por título", error: error.menssage });
    }

};

export const getByBetweenDate = (req, res) => {
    const { dataInicio, dataFim } = req.query;
    const query = {
        data_publicacao: {
            $gte: new Date(dataInicio),
            $lte: new Date(dataFim)
        }
    };
    res.json(query)
};

export const getByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const news = await Noticia.find({ categoria: category });
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar por categoria", error: error.message });
    }

};