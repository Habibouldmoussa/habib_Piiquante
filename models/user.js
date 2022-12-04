// Importation des models et des plugin nécessaire 
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
// Le schéme de la table user de la base de donnée 
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);