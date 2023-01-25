const Sauce = require('../models/Sauce'); // on importe le modèle sauce
const fs = require('fs'); // on importe filesystem pour gerer les fichiers

// création d'une sauce
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
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => res.status(400).json({ error }));
};

//modification d'une sauce par un UserId
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject._userId;

    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: 'Requête non autorisée !' });
            }
            else {

                const reqFile = req.file;
                if (!reqFile) {
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
                        .catch(error => res.status(401).json({ error }));
                }

                else {
                    const filename = sauce.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                            .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
                            .catch(error => res.status(401).json({ error }));
                    })
                }
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

//suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non autorisé' });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Sauce supprimée !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

// afficher une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

//afficher toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// gestion des Likes et Dislikes
exports.likesOrDislikesSauce = (req, res, next) => {
    // Like
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (!sauce.usersLiked.includes(req.auth.userId) && req.body.like === 1) {
                Sauce.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { likes: 1 },
                        $push: { usersLiked: req.auth.userId }
                    })
                    .then(() => res.status(200).json({ message: 'Votre like a bien été enregistré !' }))
                    .catch(error => res.status(400).json({ error }));
                // Dislike
            } else if (!sauce.usersDisliked.includes(req.auth.userId) && req.body.like === -1) {
                Sauce.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { dislikes: 1 },
                        $push: { usersDisliked: req.auth.userId },
                    })
                    .then(() => res.status(200).json({ message: 'Votre dislike a bien été pris en compte.' }))
                    .catch(error => res.status(400).json({ error }));
            } else {
                // Supprime le like
                if (sauce.usersLiked.includes(req.auth.userId)) {
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { likes: -1 },
                            $pull: { usersLiked: req.auth.userId }
                        })
                        .then(() => res.status(200).json({ message: 'Votre like a bien été supprimé' }))
                        .catch(error => res.status(400).json({ error }));
                    // Supprime le dislike
                } else if (sauce.usersDisliked.includes(req.auth.userId)) {
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { dislikes: -1 },
                            $pull: { usersDisliked: req.auth.userId }
                        }
                    )
                        .then(() => res.status(200).json({ message: 'Votre dislike a bien été supprimé' }))
                        .catch(error => res.status(400).json({ error }));
                }
            }
        })
        .catch(error => res.status(400).json({ error }));
};