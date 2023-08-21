import { User } from "../model/userModel.js";

// Creating User
export const createIUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        const newUser = new User({ name, email });
        await newUser.save();
        res.json(newUser);
    } catch (error) {
        console.log('Error in CreateUser Controller', error);
        return res.status(404).json({ message: error });
    }
}