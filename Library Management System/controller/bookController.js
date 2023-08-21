import { Book } from "../model/bookModel.js";

//Controller For Creating a Book 
export const createBookController = async (req, res) => {
    try {
        const { title, author } = req.body;
        const newBook = new Book({ title, author });
        await newBook.save();
        res.json(newBook);
    } catch (error) {
        console.log('Error in BookController', error);
        return res.status(404).json({ message: error });
    }
}

//Controller For Updating a Book 
export const updateBookController = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author } = req.body;
        const updatedBook = await Book.findByIdAndUpdate(id, { title, author }, { new: true });
        res.json(updatedBook);
    } catch (error) {
        console.log('Error in UpdateBook Controller', error);
        return res.status(404).json({ message: error });
    }
};

//Controller For Deleting a Book 
export const deleteBookController = async (req, res) => {
    try {
        const { id } = req.params;
        await Book.findByIdAndDelete(id);
        res.json({ message: 'Book deleted' });
    } catch (error) {
        console.log('Error in DeleteBook Controller', error);
        return res.status(404).json({ message: error });

    }
}