// User model goes here
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please enter a Username'],
      unique: true
    },
    password: {
      type: String,
      required: [true, 'Please enter a Password'],
      unique: true,
      minlength: [6, 'Minimum password length is 6 characters']
    },
    profile: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Mongoose Post Hooks
//https://mongoosejs.com/docs/middleware.html#pre
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
