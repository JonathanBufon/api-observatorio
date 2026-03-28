import express from "express";
import {
    getByTitle,
    getByBetweenDate,
    getByCategory,
} from "../controllers/newsController.js";

const router = express.Router();

router.get("/get-by-title", getByTitle);
router.get("/get-by-date", getByBetweenDate);
router.get("/get-by-category", getByCategory);