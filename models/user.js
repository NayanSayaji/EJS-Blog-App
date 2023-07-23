const { createHmac, randomBytes } = require("crypto");

const { Schema , model} = require("mongoose");
const { createTokenForUser } = require("../services/authentication");


const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
        // required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageUrl: {
        type: String,
        default: '/images/userAvatar.png',
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    },

},
    { timestamps: true }
);


userSchema.pre('save', function(next){
    const user = this;

    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString();

    const hashedPassword = createHmac('sha256', salt)
    .update(user.password)
    .digest("hex");

    this.salt = salt;

    this.password = hashedPassword;

    next();
});


userSchema.static('matchPasswordAndGenerateToken', async function(email, password){
    // searching for the user in database using email and storing that object into const user
    const user = await this.findOne({email});
    if(!user) throw new Error('User not found!'); // if not found

    // if found then
    const hashedPassword = user.password; // hashedPassword of the user
    const salt =  user.salt; // salt of the hashedPassword of the user

    // generating hash of the user provided password while signin
    const userProvidedHash = createHmac("sha256", salt)
        .update(password)
        .digest("hex");

    if(hashedPassword !== userProvidedHash) 
        throw new Error('Incorrect Password')

    // password in DB and user Provided password matched
    const token = createTokenForUser(user) ;
    return token;
})


const User = model("user", userSchema);

module.exports = User;