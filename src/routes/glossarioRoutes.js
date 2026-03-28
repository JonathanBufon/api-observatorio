import express from "express";
import {
    getAllTerms,
    createTerm,
    updateTerm,
    deleteTerm
} from "../controllers/glossarioController.js";

const router = express.Router();

router.get("/", getAllTerms);
router.post("/", createTerm);
router.put("/:id", updateTerm);
router.delete("/:id", deleteTerm);

export default router;
