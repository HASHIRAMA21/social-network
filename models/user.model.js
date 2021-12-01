const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    pseudo: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 55,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        validate: [isEmail],
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        maxLength: 1024,
        minLength: 8
    },
    picture: {
        type: String,
        default: "./uploads/profile/random.user.png"
    },
    bio: {
        type: String,
        max: 1024
    },
    folowers: {
        type: [String]
    },
    likes: {
        type: [String]
    }
}, {
    timestamps: true,
})

//play function before  save into dispalay :'Block
userSchema.pre("save", async function(next) {
    const salt = await bcrypt.gentSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.static.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password')
    }
    throw Error('incorrect email')
}

const UserModel = mongoose.model('user', userSchema);
module.exports = UserModel;