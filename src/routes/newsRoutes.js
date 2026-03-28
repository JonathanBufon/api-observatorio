import express from "express";
import {
    getAllNews,
    getById,
    getByTitle,
    getByDate,
    getByCategory,
    getFeatured,
    createNews,
    updateNews,
    deleteNews
} from "../controllers/newsController.js";

const router = express.Router();

router.get("/", getAllNews);
router.get("/featured", getFeatured);               // ANTES de /:id
router.get("/title/:title", getByTitle);
router.get("/date/:startDate/:endDate", getByDate);
router.get("/category/:category", getByCategory);
router.get("/:id", getById);

router.post("/", createNews);
router.put("/:id", updateNews);
router.delete("/:id", deleteNews);

export default router;
