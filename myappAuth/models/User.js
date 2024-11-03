const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  displayName: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, unique: true }, // Ensure email is unique
  picture: { type: String },
  provider: { type: String, required: true }, // Field to store OAuth provider
  providerId: { type: String, required: true, unique: true }, // Field for the provider's user ID
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
