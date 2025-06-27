const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const cookieParser = require("cookie-parser");
const authRoutes = require("./src/routes/authRoutes");
const linksRoutes = require("./src/routes/linksRoutes");
const mongoose = require("mongoose");
//middlewares
app.use(express.json()); //it is used to parse JSON bodies
app.use(cookieParser());
dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=> console.log("MongoDB connected successfully"));


const corsOptions = {
  origin : process.env.CLIENT_ENDPOINT ,  // 
  credentials : true, //allow cookies to be sent
}
app.use(cors(corsOptions));


app.use('/auth' , authRoutes );
app.use('/links' , linksRoutes)

const port = process.env.PORT || 6001;
app.listen(port, (err) => {
  if (err) {
    console.log("server not started : ", err);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
 