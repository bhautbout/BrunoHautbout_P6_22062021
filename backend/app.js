const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const mongoSanitize = require('express-mongo-sanitize');

//connection à la base de données MongoDb//
mongoose.connect('mongodb+srv://test:test@projet6.ornc8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Création de l'application express//
const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(express.json());

//Evite le piratage par injection dans la base de données MongoDb//
app.use(mongoSanitize({replaceWith: '_',}),);

//Permet d'utiliser des fichiers statiques dans express//
app.use('/images', express.static(path.join(__dirname, 'images')));

//Accès aux routes//
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;