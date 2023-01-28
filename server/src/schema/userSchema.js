require('dotenv').config()
const mongoose = require("mongoose");
const { Schema } = mongoose;
const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobile: {
    type: Number,
    required: true
  },
  work: {
    type: String,
    required: true
  },
  messeges: [{
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    mobile: {
      type: Number,
      required: true
    },
    messege: {
      type: String,
      required: true
    },
    date: { type: Date, default: Date.now }
  }],
  pass: {
    type: String,
    required: true
  },
  tokens: [
    {
      token: {
        type: String
      }
    }
  ]
});

// genrating a new token and returning it 
userSchema.methods.generateAuthToken = async function () {
  try {
    const genratedToken = jwt.sign({ _id: this._id }, process.env.SECRET);
    this.tokens = this.tokens.concat({ token: genratedToken });
    await this.save();
    return genratedToken
  } catch (error) {
    console.log(error);
  }
}

// hashing and saving the password
userSchema.pre("save", async function (next) {
  if (this.isModified('pass')) {
    this.pass = await bcrypt.hash(this.pass, 10);
  }
  next();
})

// Storing the messege 
userSchema.methods.addMessege = async function (name, email, mobile, messege) {
  try {
    this.messeges = this.messeges.concat({ name, email, mobile, messege });
    await this.save();
    return this.messeges;
  } catch (error) {
    console.log(error);
  }
}


const usercollection = mongoose.model('USERCOLLECTION', userSchema);
module.exports = usercollection;