const jwt = require("jsonwebtoken");
const Users = require("../model/Users");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const { validationResult } = require("express-validator");
const { send } = require("../service/emailService");
const authController = {
  login: async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }
    try {
      // these values are here becuase of express.json() middleware
      const { username, password } = req.body;

      console.log("Recived req for : ", username);
      const data = await Users.findOne({ email: username }); // if we will not use await code will move forward without waiting for fething the data
      console.log("Data fetched from DB : ", data);
      if (!data) {
        return res.status(401).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, data.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid Credentials" });
      }

      const userDetails = {
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role ? data.role : "admin", // default role if not set
        adminId: data.adminId,
        credits: data.credits,
      };

      const token = jwt.sign(userDetails, process.env.JWT_SECRET_KEY, {
        expiresIn: "1h",
      });

      const refreshToken = jwt.sign(
        userDetails,
        process.env.JWT_REFRESH_TOKEN_SECRET,
        {
          expiresIn: "7d",
        }
      );

      res.cookie("jwtToken", token, {
        //key and value and configuration
        httpOnly: true, //only server can change the details
        secure: process.env.NODE_ENV === 'production', //will only be accesible on https
        path: "/", //available on which path on the browser ,here it is available for all pages
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: "/",
         sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
      });

      res.json({ message: "User authenticated", userDetails: userDetails });
    } catch (err) {
      console.error("Error during login:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  logout: (req, res) => {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      path: "/",
    };
    res.clearCookie("jwtToken" , cookieOptions);
    res.clearCookie("refreshToken" , cookieOptions);
    res.json({ success: true, message: "User logged out successfully" });
  },
  isUserLoggedIn: async (request, response) => {
    const token = request.cookies.jwtToken;

    if (!token) {
      return response.status(401).json({ message: "Unauthorized access" });
    }
    jwt.verify(
      token,
      process.env.JWT_SECRET_KEY,
      async (error, decodedSecret) => {
        if (error) {
          return response.status(401).json({ message: "Unauthorized access" });
        } else {
          const data = await Users.findById(decodedSecret.id);
          return response.json({ userDetails: data });
        }
      }
    );
  },

  register: async (req, res) => {
    try {
      const { name, username, password } = req.body;

      // Check if user already exists
      const existingUser = await Users.findOne({ email: username });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      const user = new Users({
        email: username,
        password: encryptedPassword,
        name: name,
        role: "admin",
      });

      await user.save();

      const userDetails = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: "admin",
        credits: user.credits,
      };

      const token = jwt.sign(userDetails, process.env.JWT_SECRET_KEY, {
        expiresIn: "1h",
      });
    

      res.cookie("jwtToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: "/",
         sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'


      });


      res.json({ message: "User authenticated", userDetails: userDetails });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  googleAuth: async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "invalid request" });
    }

    try {
      const googleClinet = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const response = await googleClinet.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
      });

      const payload = response.getPayload();

      const { sub: googleId, email, name } = payload;

      let data = await Users.findOne({ email: email });

      if (!data) {
        //create new user
        data = new Users({
          email: email,
          name: name,
          isGoogleUser: true,
          googleId: googleId,
          role: "admin",
        });

        await data.save();
      }

      const userDetails = {
        id: data._id ? data._id : googleId,
        name: data.name,
        email: data.email,
        role: data.role ? data.role : "admin", // default role if not set
        credits: data.credits,
      };

      const token = jwt.sign(userDetails, process.env.JWT_SECRET_KEY, {
        expiresIn: "1h",
      });
      const refreshToken = jwt.sign(userDetails, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

      res.cookie("jwtToken", token, {
        //key and value and configuration
       httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: "/",
         sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: "/",
         sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
    });

      res.json({ message: "User authenticated", userDetails: userDetails });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  refreshToken: async (request, response) => {
    try {
      const refreshToken = request.cookies?.refreshToken;

      if (!refreshToken) {
        return response.status(401).json({ message: 'No refresh token' });
      }

      // Verify the refresh token
      const decoded = await jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);

      // Find user by ID from token payload
      console.log("Decoded refresh token:", decoded);

      const data = await Users.findById({ _id: decoded.id });
      if (!data) {
        return response.status(404).json({ message: 'User not found' });
      }

      // Prepare payload for new access token
      const user = {
        id: data._id,
        username: data.email,
        name: data.name,
        role: data.role || 'admin',
        credits: data.credits,
        subscription: data.subscription
      };

      // Generate new access token (short-lived)
      const newAccessToken = jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

      // Send new token as httpOnly cookie
      response.cookie('jwtToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: "/",
         sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
      });

      return response.json({
        message: 'Token refreshed',
        userDetails: user
      });

    } catch (error) {
      console.log(error);
      return response.status(500).json({
        message: 'Internal server error'
      });
    }
  },
  sendResetPasswordToken : async (req, res) => {
    const { email } = req.body;
  
    if (!email) return res.status(400).json({ message: 'Email is required' });
  
    try {
      const user = await Users.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const resetCode = Math.floor(100000 + Math.random() * 900000); // 6-digit code
      const expiry = new Date(Date.now() + 10 * 60 * 1000); // valid for 10 mins
  
      user.resetPasswordCode = resetCode;
      user.resetPasswordExpiry = expiry;
      await user.save();
  
      // Send the email
      await send(
        email,
        'Your Password Reset Code',
        `Your password reset code is: ${resetCode}`,
      );
  
      res.status(200).json({ message: 'Reset code sent to email' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  resetPassword : async (req, res) => {
    const { email, code, newPassword } = req.body;
  
    if (!email || !code || !newPassword)
      return res.status(400).json({ message: 'All fields are required' });
  
    try {
      const user = await Users.findOne({ email });
  
      if (!user || !user.resetPasswordCode || !user.resetPasswordExpiry)
        return res.status(400).json({ message: 'Invalid or expired code' });
  
      if (user.resetPasswordCode !== code.toString())
        return res.status(400).json({ message: 'Incorrect reset code' });
  
      if (user.resetPasswordExpiry < new Date())
        return res.status(400).json({ message: 'Reset code expired' });
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
  
      // Clear reset fields
      user.resetPasswordCode = undefined;
      user.resetPasswordExpiry = undefined;
  
      await user.save();
  
      res.status(200).json({ message: 'Password reset successful' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = authController;
