import mongoose from "mongoose";

//creating book schema 
const bookSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
      },
    author:{
        type: String,
        required: true,
        trim: true,
      },
});
export const Book = mongoose.model('Book', bookSchema);