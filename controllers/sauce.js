const Sauce = require('../models/sauce');
const fs = require('fs');
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
        .then(() => { res.status(201).json({ message: 'Sauce enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })
};


exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};
exports.likeSauce = (req, res, next) => {
    //console.log(req.body);
    const like = req.body.like;
    const idSauce = req.params.id;
    let actionLike = {}
    Sauce.findOne({ _id: idSauce })
        .then((sauce) => {
            //console.log(like);
            switch (like) {
                case 0: actionLike = (sauce.usersDisliked.includes(req.body.userId)) ? actionLike = { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } } : actionLike ;
                actionLike = (sauce.usersLiked.includes(req.body.userId)) ? { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } } : actionLike      
                break;
                case 1: actionLike = { $push: { usersLiked: req.body.userId }, $inc: { likes: +1 } }
                break;
                case -1: actionLike = { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 } }
            }
            Sauce.updateOne({ _id: idSauce }, actionLike)
                .then(() => res.status(200).json({ message: 'like ajouté!' }))
                .catch(error => res.status(401).json({ error }));
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
}
exports.modifySauce = (req, res, next) => {

    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject._userId;
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            //console.log(Sauce);
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce modifié!' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(Sauce => {
            if (Sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = Sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Sauce supprimé !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find().then(
        (Sauces) => {
            res.status(200).json(Sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};