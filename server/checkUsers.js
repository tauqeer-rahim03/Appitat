/**
 * Quick debug: print all users and their name fields
 */
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function checkUsers() {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({}, { name: 1, email: 1 });
    console.log("All users:");
    users.forEach((u) =>
        console.log(`  email: ${u.email} | name: "${u.name}"`),
    );
    await mongoose.disconnect();
}

checkUsers().catch(console.error);
