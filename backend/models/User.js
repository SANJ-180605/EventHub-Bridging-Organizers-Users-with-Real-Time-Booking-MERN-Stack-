const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Check if model already exists
if (mongoose.models.User) {
  module.exports = mongoose.models.User;
} 

else {
  // Define user structure
  const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: ['participant', 'organizer'],
      default: 'participant'
    }
  }, {
    timestamps: true // Adds createdAt and updatedAt automatically
  });

  // Encrypt password before saving
  userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });

  // Compare password for login
  userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };

  module.exports = mongoose.model('User', userSchema);
}