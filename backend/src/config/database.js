const mongoose = require("mongoose");
const config = require("./");
const User = require("../app/models/User");
const UserDetails = require("../app/models/UserDetails");

const connectDB = async () => {
  try {
    await mongoose.connect(config.DB_URI);

    // Seed admin user only once (runs only in primary now)
    const existingUser = await User.findOne({ email: "admin@gmail.com" });
    if (!existingUser) {
      const user = await User.create({
        name: "Admin",
        email: "admin@gmail.com",
        password: "12345678",
      });
      await UserDetails.create({
        user_id: user._id,
        mobile: "1234567890",
        profile_image: "alice.png",
        address: "Wonderland",
      });
      // console.log("✅ Admin user created.");
    } else {
      // console.log("⚡ Admin user already exists.");
    }
  } catch (error) {
    console.log(`Unable to connect with DB`, error);
  }
};

module.exports = connectDB;
