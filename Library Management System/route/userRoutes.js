import express from "express";
import { createIUser } from "../controller/userController.js";

const router = express.Router();

// create a user 
router.post('/users', createIUser)

export default router;