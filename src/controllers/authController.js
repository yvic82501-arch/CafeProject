const jwt = require("jsonwebtoken");
const Users = require("../models/userModel");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    },
  );
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await Users.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "email already exists",
      });
    }
    const user = await Users.create({ name, email, password, role });

    res.status(201).json({
      succes: true,
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password required",
      });
    }

    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "invalid credential",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "invalid credential",
      });
    }

    res.status(201).json({
      succes: true,
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (erorr) {
    next(erorr);
  }
};

const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };
