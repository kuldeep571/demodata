const { default: mongoose } = require("mongoose");

const dbConnect = () => {
  try {
    // const conn = mongoose.connect('mongodb://127.0.0.1:27017/demo');
    const conn = mongoose.connect(process.env.MONGOURL);
    console.log("Demo Database Connected Successfully");
  } catch (error) {
    console.log("DAtabase error");
  }
};
module.exports = dbConnect;