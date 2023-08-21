import mongoose from "mongoose";

//creating Borrowed Book Schema
const borrowedBookSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Book'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    borrowed_date: Date,
    due_date: Date,
});
export const BorrowedBook = mongoose.model('BorrowedBook', borrowedBookSchema);
