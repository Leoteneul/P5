const Sauce = require('../models/Sauce');

exports.getLiked = (req, res, next) => {

    

    Sauce.findOne({_id: req.params.id})
        .then(sauce => {

            const userCanLike = !sauce.usersLiked.includes(req.body.userId);
            const userWantsToLike = req.body.like === 1;
            const userCanDislike = !sauce.usersDisliked.includes(req.body.userId)
            const userWantsToDislike = req.body.like === -1;

            if(userCanLike && userWantsToLike){

                Sauce.updateOne({_id: req.params.id},
                   {
                        $inc : {likes : 1},
                        $push : {usersLiked : req.body.userId}
                   })

                .then(() => res.status(201).json({ message: "Like ajouté" }))
                .catch(error => res.status(400).json({ error }));
            }

            if(!userCanLike && !userWantsToLike){

                Sauce.updateOne({_id: req.params.id},
                    {
                       $inc : {likes : -1},
                       $pull : {usersLiked : req.body.userId} 
                    })
                
                .then(() => res.status(201).json({ message: "Like retiré" }))
                .catch(error => res.status(400).json({ error }));

            }

            if(userCanDislike && userWantsToDislike){

                Sauce.updateOne({_id: req.params.id},
                   {
                        $inc : {dislikes : 1},
                        $push : {usersDisliked : req.body.userId}
                   })

                .then(() => res.status(201).json({ message: "Dislike ajouté" }))
                .catch(error => res.status(400).json({ error }));
            }

            if(!userCanDislike && !userWantsToDislike){

                Sauce.updateOne({_id: req.params.id},
                    {
                       $inc : {dislikes : -1},
                       $pull : {usersDisliked : req.body.userId} 
                    })
                
                .then(() => res.status(201).json({ message: "Dislike retiré" }))
                .catch(error => res.status(400).json({ error }));

            }
        })
        .catch(error => res.status(404).json({ error }));

}