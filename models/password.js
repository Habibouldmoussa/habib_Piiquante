const passwordValidator = require('password-validator');
var schemaPassword = new passwordValidator();
schemaPassword
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()
.has().symbols()                                
.has().not().spaces()                           // Should not have spaces

module.exports = schemaPassword;