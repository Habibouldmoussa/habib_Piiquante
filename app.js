const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();
const path = require('path');
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauce');
const MY_MONGODBURL = process.env.MONGODB_URL;

mongoose.connect( MY_MONGODBURL,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
  app.use(express.json());
  app.use((req, res, next) => {
    // on indique que les ressources peuvent être partagées depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    // on indique les entêtes qui seront utilisées après la pré-vérification cross-origin afin de donner l'autorisation
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // on indique les méthodes autorisées pour les requêtes HTTP
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    // on autorise ce serveur à fournir des scripts pour la page visitée
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
  });

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
module.exports = app;