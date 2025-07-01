const { USER_ROLES } = require("../constants/userConstants");
const bcrypt = require("bcryptjs");
const Users = require("../model/Users");
const { send } = require("../service/emailService");

const generateRandomPassword = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};

const userController = {
  create: async (res, req) => {
    try {
      const { name, email, role } = req.body;

      if (!USER_ROLES.includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const temporaryPassword = generateRandomPassword();
      const hashedPassword = await bcrypt.hash(temporaryPassword, 10); // always use await
      const user = await Users.create({
        email: email,
        password: hashedPassword,
        name: name,
        role: role,
        adminId: req.user._id, // assuming req.user is set by authentication middleware
      });
      try {
        await send(
          email,
          "Welcome to Our affiliate++ links",
          `Your temporary password is: ${temporaryPassword}`
        );
      } catch (error) {
        console.log(
          `user created but email not sent , the password is  : ${temporaryPassword}`
        );
      }
      res.json(user);
    } catch (err) {
      console.error("Error creating user:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getAll: async (req, res) => {
    try {
      const users = await Users.find({ adminId: req.user._id });
      res.json(users);
    } catch (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, role } = req.body;

      if (role && !USER_ROLES.includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const user = await Users.find({ _id: id, adminId: req.user._id });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (name) {
        user.name = name;
      }
      if (role) {
        user.role = role;
      }
      await user.save();

      res.json(user);
    } catch (err) {
      console.error("Error updating user:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  delete : async (req, res) => {
    try {

        const { id } = req.params;
    
        const user = await Users.findOneAndDelete({ _id: id, adminId: req.user._id });
    
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
    
        res.json({ message: "User account deleted successfully" });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
  }
};

module.exports = userController;
