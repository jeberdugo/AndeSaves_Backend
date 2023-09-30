const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
});

// Método para validar la contraseña
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('user', userSchema);