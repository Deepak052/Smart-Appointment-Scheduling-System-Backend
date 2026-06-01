const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerUser = async (name, email, password) => {
   
    const userExists = await User.findOne({ email });

    if (userExists) {
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        return {
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        };
    } else {
        throw new Error('Invalid user data');
    }
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        return {
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        };
    } else {
        throw new Error('User name or password is wrong');
    }
};

module.exports = {
    registerUser,
    loginUser
};
