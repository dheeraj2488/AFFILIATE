const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const authRoutes = require("./src/routes/authRoutes");
const linksRoutes = require("./src/routes/linksRoutes");
const userRoutes = require("./src/routes/userRoutes");
const mongoose = require("mongoose");
const paymentRoutes = require("./src/routes/paymentRoutes");
//middlewares
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=> console.log("MongoDB connected successfully"));


//Razorpay webhooks (and most other payment gateways like Stripe, PayPal, etc.) require the raw request body to verify the signature.
app.use((request, response, next) => {
  if (request.originalUrl.startsWith('/payments/webhook')) {
      return next();
  }

  express.json()(request, response, next);
});
app.use(cookieParser());


const corsOptions = {
  origin : process.env.CLIENT_ENDPOINT ,  // 
  credentials : true, //allow cookies to be sent
}
app.use(cors(corsOptions));


app.use('/auth' , authRoutes );
app.use('/links' , linksRoutes);
app.use('/users' , userRoutes);
app.use('/payments' , paymentRoutes);

const port = process.env.PORT || 6001;
app.listen(port, (err) => {
  if (err) {
    console.log("server not started : ", err);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
 