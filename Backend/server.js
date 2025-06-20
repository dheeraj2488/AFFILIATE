const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const cookieParser = require("cookie-parser");
const authRoutes = require("./src/routes/authRoutes");
//middlewares
app.use(cors());
app.use(express.json()); //it is used to parse JSON bodies
app.use(cookieParser());
dotenv.config();

app.use('/auth' , authRoutes );


const port = process.env.PORT || 6001;
app.listen(port, (err) => {
  if (err) {
    console.log("server not started : ", err);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
