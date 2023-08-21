import { Book } from "../model/bookModel.js";
import { BorrowedBook } from "../model/borrowedBookModel.js";

//transaction code for borrowed book 
export const borrowBookController = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId, bookId } = req.body;

        const book = await Book.findById(bookId).session(session);
        if (!book) {
            session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Book not found' });
        }

        const borrowedBook = await BorrowedBook.findOne({ bookId }).session(session);
        if (borrowedBook) {
            session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Book is already borrowed' });
        }

        const currentDate = new Date();
        const dueDate = new Date();
        dueDate.setDate(currentDate.getDate() + 14);

        const newBorrowedBook = new BorrowedBook({
            userId,
            bookId,
            borrowed_date: currentDate,
            due_date: dueDate,
        });

        await newBorrowedBook.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.json(newBorrowedBook);
    } catch (error) {
        console.error(error);
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: 'Internal server error' });
    }
};
//normal code for borrowed book 
//  async (req, res) => {
//     try {
//         const { userId, bookId } = req.body;

//         // Check if the book is available
//         const book = await Book.findById(bookId);
//         if (!book) {
//             return res.status(404).json({ message: 'Book not found' });
//         }

//         // Check if the book is already borrowed
//         const borrowedBook = await BorrowedBook.findOne({ bookId });
//         if (borrowedBook) {
//             return res.status(400).json({ message: 'Book is already borrowed' });
//         }

//         // Create a new borrowed book entry
//         const borrowedDate = new Date();
//         const dueDate = new Date(borrowedDate);
//         dueDate.setDate(dueDate.getDate() + 14); // Assuming 2-week borrowing period

//         const newBorrowedBook = new BorrowedBook({
//             borrowed_date: borrowedDate,
//             due_date: dueDate,
//             userId,
//             bookId,
//         });
//         await newBorrowedBook.save();

//         res.json(newBorrowedBook);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

//



//transaction code for return book 
export const returnBookController = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId, bookId } = req.body;

        const borrowedBook = await BorrowedBook.findOne({ userId, bookId }).session(session);
        if (!borrowedBook) {
            session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Borrowed book not found' });
        }

        await BorrowedBook.findByIdAndDelete(borrowedBook._id, { session });

        await session.commitTransaction();
        session.endSession();

        res.json({ message: 'Book returned successfully' });
    } catch (error) {
        console.error(error);
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: 'Internal server error' });
    }
};
//normal code for return controller 
// async (req, res) => {
//     try {
//         const { userId, bookId } = req.body;

//         // Check if the borrowed book exists
//         const borrowedBook = await BorrowedBook.findOne({ userId, bookId });
//         if (!borrowedBook) {
//             return res.status(404).json({ message: 'Borrowed book not found' });
//         }

//         // Delete the borrowed book entry
//         await BorrowedBook.findByIdAndDelete(borrowedBook._id);

//         res.json({ message: 'Book returned successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// Controller for Books Borrowed By User
export const getBooksBorrowedByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const borrowedBooks = await BorrowedBook.find({ userId }).populate('bookId');
        res.json(borrowedBooks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

//Controller for fetch the Users Who Borrowed Book
export const getUsersWhoBorrowedBook = async (req, res) => {
    try {
        const { bookId } = req.params;

        const borrowedUsers = await BorrowedBook.find({ bookId }).populate('userId');
        res.json(borrowedUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller for fetch the Currently Borrowed Books 
export const getCurrentlyBorrowedBooks = async (req, res) => {
    try {
        const currentlyBorrowedBooks = await BorrowedBook.find();
        res.json(currentlyBorrowedBooks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//Controller for fetch the Over Due Books
export const getOverdueBooks = async (req, res) => {
    try {
        const today = new Date();
        const overdueBooks = await BorrowedBook.find({ due_date: { $lt: today } });
        res.json(overdueBooks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// top borrowers
export const getTopBorrowers = async (req, res) => {
    try {
        const topBorrowers = await BorrowedBook.aggregate([
            {
                $group: {
                    _id: '$userId',
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'users', // Name of the Users collection
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            { $unwind: '$user' },
            { $project: { _id: 0, user: 1, count: 1 } },
        ]);

        res.json(topBorrowers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


//get books borrowed per month 
export const getBooksBorrowedPerMonth = async (req, res) => {
    try {
        const lastYearDate = new Date();
        lastYearDate.setFullYear(lastYearDate.getFullYear() - 1); // One year ago

        const booksBorrowedPerMonth = await BorrowedBook.aggregate([
            {
                $match: {
                    borrowed_date: { $gte: lastYearDate },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$borrowed_date' },
                        month: { $month: '$borrowed_date' },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);

        res.json(booksBorrowedPerMonth);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};