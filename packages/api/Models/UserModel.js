const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
      },
      password: {
        type: String,
        required: [true, "Password is required"],
      },
      email: {
        type: String,
        unique: true,
      },
      businessIdList: {
        type: [String],
        default: [],
      },
      emailVerified: {
        type: Boolean,
        default: false,
      },
      emailVerificationToken: {
        type: String,
        default: "",
      },
}); 


// userSchema.pre("save", async function () {
//     this.password = await bcrypt.hash(this.password, 12);
// });

module.exports = mongoose.model("User", userSchema);

