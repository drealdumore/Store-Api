import mongoose from "mongoose";
import validator from "validator";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    trim: true,
    maxlength: [50, "User name cannot exceed 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password does not MATCH!!",
    },
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  role: {
    type: String,
    enum: ["user", "admin", "mananger"],
    default: "user",
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  // to disable account if user deletes account
  active: {
    type: Boolean,
    default: true,
    select: false, // show in compass but not in response
  },
});

// HASH password before saving to db
UserSchema.pre("save", async function (next) {
  console.log(this.isModified("password"));

  if (!this.isModified("password")) return next();

  // hash the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// UPDATE passwordChangedAt -1sec
UserSchema.pre("save", function (next) {
  // if not modified || is new
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
});

// HIDE unactive users
UserSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// METHODS
// Check if HASHED PASSWORDS MATCHES
UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// CEHCK if password has been changed over time
// params: time
UserSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    // parse as integer(value, base)
    // Convert passwordChangedAt to seconds for comparison
    const changedTineStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    // Check if JWT was issued before password change
    return JWTTimeStamp < changedTineStamp;
  }

  return false;
};

// CREATE Random Password Reset Token
UserSchema.methods.createPasswordResetToken = async function () {
  // generate random 32 code convert to hex
  const resetToken = crypto.randomBytes(32).toString("hex");

  // hash the resetToke
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expiration time for the reset token (10 minutes)
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // Return the Unhashed Reset Token to be sent to the user
  return resetToken;
};

const User = mongoose.model("User", UserSchema);

export default User;
