import Glossario from "../models/Glossario.js";

export const getAllTerms = async (req, res, next) => {
    try {
        const terms = await Glossario.find().sort({ termo: 1 });
        res.status(200).json(terms);
    } catch (error) {
        next(error);
    }
};

export const createTerm = async (req, res, next) => {
    try {
        const term = new Glossario(req.body);
        const saved = await term.save();
        res.status(201).json(saved);
    } catch (error) {
        next(error);
    }
};

export const updateTerm = async (req, res, next) => {
    try {
        const term = await Glossario.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!term) return res.status(404).json({ message: "Termo não encontrado" });
        res.status(200).json(term);
    } catch (error) {
        next(error);
    }
};

export const deleteTerm = async (req, res, next) => {
    try {
        const term = await Glossario.findByIdAndDelete(req.params.id);
        if (!term) return res.status(404).json({ message: "Termo não encontrado" });
        res.status(200).json({ message: "Termo removido" });
    } catch (error) {
        next(error);
    }
};
