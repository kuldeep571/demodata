const db = require("../Models/UserModel");
const validator = require('validator');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const postdata = async (req, res) => {
  const {
    name,
    email,
    password,
    contact,
    gender,
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
      contact,
      gender,
    };
    const newAdmin = new db(newuserData);

    const userData = await newAdmin.save();
    res.status(200).json({ success: true, userData, message: "User Created" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getdata = async(req, res)=>{
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
    const getdata = await db.findOne({_id: req.params.id});
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
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const transporter = nodemailer.createTransport({
  service: process.env.data,
  auth: {
    user: process.env.mp,
    pass: process.env.pass
  }
});

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: "Please provide your email" });
    }
    const user = await db.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    const hashedOTP = await bcrypt.hash(otp, 10);

    // Save the hashed OTP and current time to the user document
    user.otpHash = hashedOTP;
    user.otpCreatedAt = new Date();
    await user.save();

    const mailOptions = {
      from: process.env.data,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to send OTP" });
      }
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: "OTP sent to your email" });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Please provide email, OTP, and new password" });
    }
    const user = await db.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(otp, user.otpHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otpHash = null; // Clear the OTP after successful password reset
    await user.save();
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getTodayAllData = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to the beginning of the day

    const endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999); // Set time to the end of the day

    const data = await db.find({
      createdAt: { $gte: today, $lt: endDate }
    });

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




const getYesterdayAllData = async (req, res) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // Set date to yesterday

    const startDate = new Date(yesterday);
    startDate.setHours(0, 0, 0, 0); // Set time to the beginning of the day

    const endDate = new Date(yesterday);
    endDate.setHours(23, 59, 59, 999); // Set time to the end of the day

    const data = await db.find({
      createdAt: { $gte: startDate, $lt: endDate }
    });

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




module.exports = {
  postdata,
  loginUser,
  getdata,
  getsingledata,
  forgotPassword,
  resetPassword,
  getYesterdayAllData,
  getTodayAllData
}