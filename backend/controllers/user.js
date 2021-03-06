const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const maskData = require('maskdata');

const User = require('../models/User');

//module creation utilisateurs//
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => { //chiffre le mot de passe//
        const user = new User({
            email: maskData.maskEmail2(req.body.email),//masque l'adresse email//
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));

};

//module connection utilisateur//
exports.login = (req, res, next) => {
    User.findOne({ email: maskData.maskEmail2(req.body.email)})
    .then(user => {
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !'});
        }
        bcrypt.compare(req.body.password, user.password)//compare le mot de passe chiffré//
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ error : 'Mot de passe incorrect !'});
        }
        res.status(200).json({
            userId: user._id,
            token: jwt.sign(
                {userId: user._id},
                'RANDOM_TOKEN_SECRET', //clé de chiffrement//
                {expiresIn: '24h'}
            )
        });
    })
    .catch(error => res.status(500).json({ error }));
})
.catch(error => res.status(500).json({ error }));

};