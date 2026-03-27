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

export const getBydate = (req, res) => {

};

export const getByCategory = (req, res) => {

};