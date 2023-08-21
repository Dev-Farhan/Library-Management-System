import express from "express";
import { borrowBookController, getBooksBorrowedByUser, getBooksBorrowedPerMonth, getCurrentlyBorrowedBooks, getOverdueBooks, getTopBorrowers, getUsersWhoBorrowedBook, returnBookController } from "../controller/borrowController.js";


const router = express.Router();

// Borrow a book
router.post('/borrow', borrowBookController);

// Return a book
router.post('/return', returnBookController);

//all books borrowed by a specific user
router.get('/books/user/:userId', getBooksBorrowedByUser);

//all users who have borrowed a specific book
router.get('/users/book/:bookId', getUsersWhoBorrowedBook);

//all books that are currently borrowed
router.get('/books/borrowed', getCurrentlyBorrowedBooks);

//all books that are overdue
router.get('/books/overdue', getOverdueBooks);

// top borrowers
router.get('/top-borrowers', getTopBorrowers);

//books borrowed per month 
router.get('/books-borrowed-per-month', getBooksBorrowedPerMonth);

export default router;