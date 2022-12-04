// Importation des models et des plugin nécessaire 
const passwordValidator = require('password-validator');
// Création du shema de force du mot de passe avec 
var schemaPassword = new passwordValidator();
schemaPassword
    .is().min(8)                                    // Minimum de 8 caractaire 
    .is().max(100)                                  // Maximum de 100 caractaire 
    .has().uppercase()                              // Au moins une majuscule 
    .has().lowercase()                              // Au moins une minuscule
    .has().digits()                                 // Au moins un nombre 
    .has().symbols()                                // Au moins un symbole 
    .has().not().spaces()                           // Pas d'espace 

module.exports = schemaPassword;