const express = require("express");
const dbConnect = require("./Config/dbConnect");
const bodyParser = require("body-parser");
const app = express();
const dotenv = require("dotenv").config();

const PORT = process.env.PORT;
const morgan = require("morgan");
const cors = require("cors");

dbConnect();
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/user', require("./Routers/UserRouter"))

app.get('/', async (req, res) => {
  res.send('<h1 class="red">Server <span class="blue">is</span> <span class="green">running</span> 👍👍</h1>');
});


app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT} 👍👍`);
}); 