import express from "express";
import { createBookController, deleteBookController, updateBookController } from "../controller/bookController.js";

const router = express.Router();

//to create a book
router.post('/books', createBookController);

//to update a book
router.put('/books/:id', updateBookController);

//to delete a book
router.delete('/books/:id', deleteBookController);

export default router;