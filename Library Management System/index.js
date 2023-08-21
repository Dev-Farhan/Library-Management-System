import express from "express";

// Create Express app
const app = express();
app.use(express.json());


// Connect to MongoDB
import { connectDB } from "./config/db.js";
connectDB();

//imports essential routes from routes folder
import bookRoutes from "./route/bookRoutes.js"
import userRoutes from "./route/userRoutes.js"
import borrowedBookRoutes from "./route/borrowRoutes.js"

//API's starting points
app.use('/api', bookRoutes);
app.use('/api', userRoutes);
app.use('/api', borrowedBookRoutes);

//server port 
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server Running on localhost:${PORT}`);
});