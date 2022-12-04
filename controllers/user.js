const bcrypt = require("bcrypt") 
const User = require("../models/user") 
const passwordvalid = require("../models/password")
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();
const RANDOM_TOKEN_SECRET = process.env.APP_SECRET
exports.signup = (req, res, next) => {
   if ( passwordvalid.validate(req.body.password)) {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));

   } else {
        return res.status(422).json({ error : "le mot de passe est pas assez fort "+ passwordvalid.validate(req.body.password, { list: true }) } )
   }

  };
  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error });
                    }
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