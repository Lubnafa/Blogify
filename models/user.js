const { createHmac, randomBytes } = require("node:crypto");
const { createTokenForUser, validateToken } = require('../services/authentication');
const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    fullName: {
        type: String,
        required:true,  
    },
    email: {
        type: String,
        unique: true,
    },
    salt: {
        type: String,
         
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL: {
        type: String,
        default: '/images/user.png',
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: 'USER',
    },
}, { timestamps: true });

userSchema.pre("save", function (next) {
    const user = this;

    if (!user.isModified("password")) return next(); // If password not modified, move to the next middleware

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex");
    user.salt = salt;
    user.password = hashedPassword;

    next();
});
userSchema.static("matchPasswordAndGenerateToken",async function(email,password){
    const user = await this.findOne({email});
    if(!user) throw new Error("user not found");
    const salt=user.salt;
    const hashedPassword=user.password;

    const userProvidedHash=createHmac("sha256", salt)
    .update(password)
    .digest("hex");
    if(hashedPassword!==userProvidedHash)throw new Error("Incorrect password");
    const token = createTokenForUser(user);
    //console.log(token);
    return token;
});
const User = model("user", userSchema);
module.exports = User;
