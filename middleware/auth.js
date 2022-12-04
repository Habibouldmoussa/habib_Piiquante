// Importation des models et des plugin nécessaire 
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
// Récuperation du token dans les variable d'environement 
const RANDOM_TOKEN_SECRET = process.env.APP_SECRET
//-------------------------------------------------

// le middelware verifie si le token du client bon est execute la route si tout est correct 
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, RANDOM_TOKEN_SECRET);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};