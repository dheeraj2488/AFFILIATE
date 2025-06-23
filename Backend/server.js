const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const cookieParser = require("cookie-parser");
const authRoutes = require("./src/routes/authRoutes");
//middlewares
app.use(express.json()); //it is used to parse JSON bodies
app.use(cookieParser());
dotenv.config();

const corsOptions = {
  origin : 'http://localhost:5173' ,  // 
  credentials : true, //allow cookies to be sent
}
app.use(cors(corsOptions));


app.use('/auth' , authRoutes );


const port = process.env.PORT || 6001;
app.listen(port, (err) => {
  if (err) {
    console.log("server not started : ", err);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
