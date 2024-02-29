const db = require("../Models/UserModel");
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const postdata = async (req, res) => {
  const {
    name,
    email,
    password,
    mobilenumber,
    gender,
    occupation,
  } = req.body;
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    const userExists = await db.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newuserData = {
      name,
      email,
      password,
      mobilenumber,
      gender,
      occupation,
    };
    const newAdmin = new db(newuserData);

    const userData = await newAdmin.save();
    res.status(200).json({ success: true, userData, message: "User Created" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getdata = async (req, res) => {
  try {
    const getdata = await db.find();
    res.status(200).json(getdata);
  } catch (error) {
    console.log(error);
  }
}

let apiCallCount = 0;
const getsingledata = async (req, res) => {
  try {
    apiCallCount++;
    const getdata = await db.findOne({ _id: req.params.id });
    res.status(200).json({ count: apiCallCount, data: getdata });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }
    const user = await db.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRETKEY, { expiresIn: '1h' });
    res.status(200).json({ user, token});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  postdata,
  loginUser,
  getdata,
  getsingledata,
}