const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllUsers = async(req, res) => {
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
}

module.exports.userInfo = async(req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('ID unknown :' + req.params.id);
    }
    UserModel.findById(req.params.id, (err, docs) => {
        if (!err) res.send(docs);
        else console.log('ID unknown:' + err)

    })
}

module.exports.updateUser = async(req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('ID unknown :' + req.params.id);
    }
    try {
        await userModel.findOneAndUpdate({ _id: req.params.id }, {
                $set: {
                    bio: req.body.bio,
                }
            }, {
                new: true,
                upsert: true,
                setDefaultOnInsert: true
            },
            (err, docs) => {
                if (!err) return res.send(docs)
                if (err) return res.status(500).send({ message: err })
            }
        )
    } catch (err) {
        return res.status(500).json('ID unknown :' + req.params.id)
    }
}

module.exports.deleteUser = async(req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json('ID unknown :' + req.params.id);
    }

    try {
        await UserModel.remove({ _id: req.params.id }).exec();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        return res.status(400).json({ message: "err" })
    }
}

module.exports.follow = async(req, res) => {
    if (!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.params.idToFollow)) {
        return res.status(400).json('ID unknown :' + req.params.id);
    }
    try {
        ///add to follower
        await UserModel.findByIdAndUpdate(
                req.params.id, { $addToSet: { following: req.body.idToFollow } }, { new: true, upsert: true },
                (err, docs) => {
                    if (!err) res.status(201).json(docs)
                    else res.status(400).json(err)
                }
            )
            //add to followings list
        await UserModel.findByIdAndUpdate(
            res.body.idToFollow, { $addToSet: { followers: req.params.id } }, { new: true, upsert: true },
            (err, docs) => {
                //if (!err) res.status(201).json(docs)
                if (err) res.status(400).json(err)
            }
        )

    } catch (err) {
        return res.status(500).json({ message: err });
    }
}

module.exports.unfollow = async(req, res) => {
    if (!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.params.idToUnFollow)) {
        return res.status(400).json('ID unknown :' + req.params.id);
    }
    try {
        ///add to follower
        await UserModel.findByIdAndUpdate(
                req.params.id, { $pull: { following: req.body.idToUnFollow } }, { new: true, upsert: true },
                (err, docs) => {
                    if (!err) res.status(201).json(docs)
                    else res.status(400).json(err)
                }
            )
            //add to followings list
        await UserModel.findByIdAndUpdate(
            res.body.idToUnFollow, { $pull: { followers: req.params.id } }, { new: true, upsert: true },
            (err, docs) => {
                //if (!err) res.status(201).json(docs)
                if (err) res.status(400).json(err)
            }
        )

    } catch (err) {
        return res.status(500).json({ message: err });
    }
}