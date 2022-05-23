const createError = require("../utils/createError");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { User } = require("../models");

exports.login = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const { firstName, lastName, emailOrPhone, password, confirmPassword } =
      req.body;

    if (!emailOrPhone) {
      createError("email or phone is required", 400);
    }

    if (!password) {
      createError("password is required");
    }

    if (password !== confirmPassword) {
      createError("password is not match");
    }

    const isEmail = validator.isEmail(emailOrPhone + "");
    const isMobilePhone = validator.isMobilePhone(emailOrPhone + "");

    if (!isEmail && !isMobilePhone) {
      createError("Email or PhoneNumber is invalid format", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email: isEmail ? emailOrPhone : null,
      phoneNumber: isMobilePhone ? emailOrPhone : null,
      password: hashedPassword,
    });

    const payload = {
      id: user.id,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};
