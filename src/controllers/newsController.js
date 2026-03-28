export const getByTitle = (req, res) => {

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

export const getByCategory = (req, res) => {

};