const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();


exports.signup = (req, res, next) => {
    
    const strongPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#_?&])[A-Za-z\d@$!%_*#?&]{8,}$/
    
    if(!strongPassword.test(req.body.password)){

        return res.status(400).json({message: 'error'})
        
    }else{
        
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur Créé !'}))
        .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }));
    }    
};


exports.login = (req, res, next) => {

    User.findOne({ email: req.body.email})
        .then(user => {
            if(user === null){
                res.status(401).json({ message: 'La paire email/mot eeeeeeede passe ne corresponds pas'})
            }else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if(!valid){
                            res.status(401).json({ message: 'La paire email/mot de passe ne corresponds pas'})
                        }else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    {userId: user._id},
                                    'salt',
                                    { expiresIn: '24h' }
                                )
                            })
                        }
                    })
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
};
    

