const asyncHandler = require('express-async-handler');
const authService = require('../services/authService');

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    try {
        const userData = await authService.registerUser(name, email, password);
        res.status(201).json(userData);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    try {
        const userData = await authService.loginUser(email, password);
        res.status(200).json(userData);
    } catch (error) {
        res.status(401);
        throw new Error(error.message);
    }
});

const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

module.exports = {
    registerUser,
    loginUser,
    getMe,
};
