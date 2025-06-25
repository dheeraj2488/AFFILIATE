const jwt = require("jsonwebtoken");
const Users = require("../model/Users");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const { validationResult } = require("express-validator");
const authController = {


  login: async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }
    try {
      // these values are here becuase of express.json() middleware
      const { username, password } = req.body;
      // console.log("Recived req for : " , username);
      const data = await Users.findOne({ email: username }); // if we will not use await code will move forward without waiting for fething the data

      if (!data) {
        return res.status(401).json({ message: "User not found" });
      }
     
      const isMatch =await bcrypt.compare(password, data.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid Credentials" });
      }

      const userDetails = {
        id: data._id,
        name: data.name,
        email: data.email,
      };

      const token = jwt.sign({ userDetails }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1h",
      });

      res.cookie("jwtToken", token, {
        //key and value and configuration
        httpOnly: true, //only server can change the details
        secure: true, //will only be accesible on https
        domain: "localhost", // specified domain
        path: "/", //available on which path on the browser ,here it is available for all pages
      });

      res.json({ message: "User authenticated", userDetails: userDetails });
    } catch (err) {
      console.error("Error during login:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  logout: (req, res) => {
    res.clearCookie("jwtToken");
    res.json({ success: true, message: "User logged out successfully" });
  },
  isUserLoggedIn: (request, response) => {
    const token = request.cookies.jwtToken;

    if (!token) {
      return response.status(401).json({ message: "Unauthorized access" });
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decodedSecret) => {
      if (error) {
        return response.status(401).json({ message: "Unauthorized access" });
      } else {
        return response.json({ userDetails: decodedSecret });
      }
    });
  },

  register : async(req , res) =>{

    try{  

      const { username, password , name  } = req.body;
      const encryptedPassword = await bcrypt.hash(password, 10);

      // Check if user already exists
      const existingUser = await Users.findOne({ email: username });
      if( existingUser ) {
        return res.status(400).json({ message: "User already exists" });
      }


      const user = new Users({
        email : username , 
        password : encryptedPassword,
        name : name
      });

      await user.save();

      res.status(200).json({ success: true ,  message: "User registered successfully" });

    }catch(err){
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } , 

  googleAuth : async (req, res) => {
    
    const {idToken } = req.body;

    if(!idToken){
      return res.status(400).json({ message: "invalid request" });
    }

    try{

      const googleClinet = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const response = await googleClinet.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
      })

      const payload = response.getPayload();

      const { sub : googleId , email , name } = payload;  

      let data = await Users.findOne({ eamil: email });

      if(!data){
        //create new user
        data = new Users({
          email: email,
          name: name,
          isGoogleUser : true , 
          googleId: googleId
        });

        await data.save();
      }

      const userDetails = {
        id: data._id ? data._id : googleId , 
        name: data.name,
        email: data.email,

      };

      const token = jwt.sign({ userDetails }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1h",
      });

      res.cookie("jwtToken", token, {
        //key and value and configuration
        httpOnly: true, //only server can change the details
        secure: true, //will only be accesible on https
        domain: "localhost", // specified domain
        path: "/", //available on which path on the browser ,here it is available for all pages
      });

      res.json({ message: "User authenticated", userDetails: userDetails });



    }catch(err){
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

module.exports = authController;
