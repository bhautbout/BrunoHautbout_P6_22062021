const schema = require('../models/passwordValidator');

module.exports = (req, res, next) => {
    
    if (!schema.validate(req.body.password)) {

      res.status(401).json({
        error: ('Mot de passe trop faible !')
      });
    
    } else {
      next();
    }
  };