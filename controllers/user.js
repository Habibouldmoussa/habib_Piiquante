// Récuperation des plugin et models nécessaire
const bcrypt = require('bcrypt')
const User = require('../models/user')
const passwordvalid = require('../models/password')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
// Récuperation du token dans les variable d'environement 
const RANDOM_TOKEN_SECRET = process.env.APP_SECRET
// Création d'utilisateur 
exports.signup = (req, res, next) => {
    // On passe le mot de passe au validateur 
    if (passwordvalid.validate(req.body.password)) {
        // Si le mot de passe est valide on le hash 10 fois
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    email: req.body.email,
                    password: hash
                });
                // Sauvgarde de l'user dans la base de donnée 
                user.save()
                    .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                    .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));

    } else {
        return res.status(422).json({ error: 'le mot de passe est pas assez fort ' + passwordvalid.validate(req.body.password, { list: true }) })
    }

};
// Connexion de l'utilisateur 
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            // On verifie si l'utilisateur existe on ne transmet pas l'information au client pour ne pas indiqué si le mail est inscrit ou pas pour des raison de discretion 
            if (!user) {
                return res.status(401).json({ error });
            }
            // On compare les mot de passe hashé 
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error });
                    }
                    // si le mot de passe coresspond on donne un token au client 
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            RANDOM_TOKEN_SECRET,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};