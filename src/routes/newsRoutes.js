import express from "express";
import {
    getByTitle,
    getBydate,
    getByCategory,
} from "../controllers/newsController.js";

const router = express.Router();

router.get("/get-by-title:title", getByTitle);
router.get("/get-by-date", getBydate);
router.get("/get-by-category:category", getByCategory);