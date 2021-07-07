const express = require('express');
const router = express.Router()
const userCtrl = require('../controllers/user');
const passwordValidator = require('../middleware/passwordValidator');
const rateLimit = require('express-rate-limit');

//controleur d'accès aux comptes//
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,//nouvelle tentative dans 15 minutes//
    max: 5,
    message: "Trop d'essais, veuillez réessayer dans 15 minutes", 
});

//controleur de création de compte//
const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, //nouvelle tentative dans 1 heure//
    max: 5, //bloquage après 5 essais//
    message: "Trop de création de comptes pour cette adresse IP, svp réessayez de nouveau dans une heure"
});

router.post('/signup', passwordValidator, createAccountLimiter, userCtrl.signup);
router.post('/login', apiLimiter, userCtrl.login);

module.exports = router;