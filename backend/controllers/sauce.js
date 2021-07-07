const Sauce = require('../models/Sauce');
const fs = require('fs');

//Créé la sauce//
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
     likes: 0,
     dislikes: 0,
     usersLiked: [],
     usersDisliked: [],
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce sauvegardée !'}))
    .catch(error => res.status(400).json({ error }));
};

// Affiche toutes les sauces de la BDD//
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json({ error }));
};

//Affiche la sauce sélectionnée//
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

//Modifie la sauce sélectionnée//
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

//Supprime la sauce sélectionnée//
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.likeSauce = (req, res, next) => {
  const sauceObject = req.body;
  let likes = req.body.like;
  let userId = req.body.userId;
  delete sauceObject._id;
//si l'utilisateur aime la sauce alors like = 1//
  if (likes === 1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { likes: +1 },
        $push: { usersLiked: userId },
      }
    )
    .then(() => res.status(200).json( {message: "Vous adorez cette sauce !"}))
    .catch((error) => res.status(400).json({error}));
    
// si l'utilisateur n'aime pas la sauce alors like = -1//
  } else if (likes === -1) {
    Sauce.updateOne(
      {_id: req.params.id},
      {
        $inc: {dislikes: +1},
        $push: {usersDisliked: userId},
      }
    )
    .then(() => res.status(200).json({message: "Cette sauce ne vous plait pas !"}))
    .catch((error) => res.status(400).json({error}));

  } else {
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
      console.log(sauce);
      if(sauce.usersLiked == userId) {
        Sauce.updateOne(
          {_id: req.params.id},
          {
            $inc: {likes: -1},
            $pull: {usersLiked: userId},
          }
        )
        .then(() => res.status(200).json({message: "Vous n'aimez plus cette sauce !"}))
        .catch((error) => res.status(400).json({error}));
      } else if (sauce.usersDisliked == userId) {
        Sauce.updateOne(
          {_id:req.params.id},
          {
            $inc: {dislikes: -1},
            $pull: {usersDisliked: userId},
          }
        )
        .then(() => res.status(200).json({message: "Je n'aime pas retiré !"}))
        .catch((error) => res.status(400).json({error}));
      }
    })
    .catch((error) => res.status(400).json({error}));
  }
};

  

 