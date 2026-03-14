/**
 * One-time script to patch users who have a null/empty name field.
 * Run with: node patchUsers.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function patchUsers() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const usersWithNoName = await User.find({
        $or: [{ name: null }, { name: "" }, { name: { $exists: false } }],
    });

    console.log(`Found ${usersWithNoName.length} users with missing name.`);

    for (const user of usersWithNoName) {
        const fallbackName = user.email.split("@")[0];
        user.name = fallbackName;
        await user.save();
        console.log(
            `  Patched: ${user.email} → name set to "${fallbackName}"`,
        );
    }

    console.log("Done! All users patched.");
    await mongoose.disconnect();
}

patchUsers().catch((err) => {
    console.error("Error:", err);
    process.exit(1);
});
