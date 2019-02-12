const userModel = require('../models/user');
const events = require('./calendar');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');

module.exports = {
 create: function(req, res, next) {
  userModel.create({ name: req.body.name, email: req.body.email, password: req.body.password }, function (err, result) {
      if (err) 
       next(err);
      else
       res.json({status: "success", message: "User added successfully!!!", data: null});
      
    });
 },
 findByEmail: function(req, res, next) {
    userModel.findOne({email:req.params.mailId}, function(err, userInfo){
        if (err) {
            next(err);
        } else {
            res.json({status:"success", message: "User has been found", data:{user: userInfo}});
        }
    });
    },

  authenticate: function(req, res, next) {
    userModel.findOne({email:req.body.email}, function(err, userInfo){
        if (err) {
            next(err);
        } else {
            try{
                if(bcrypt.compareSync(req.body.password, userInfo.password)) {
                    const token = jwt.sign({id: userInfo._id, name: userInfo.name, email: userInfo.email}, req.app.get('secretKey'), { expiresIn: '1h' });
                    res.json({status:"success", message: "user found!!!", data:{user: userInfo, token:token}});
                }else{
                    res.json({status:"error", message: "Invalid email/password!!!", data:null});
                }
            }catch (e) {
                res.json({status:"error", message: "Invalid email/password!!!", data:null});
            }

            
        }
    });
    },
    verify: function(req, res, next){
        jwt.verify(req.body.token,req.app.get('secretKey'),function(err,token){
            if(err){
                res.json({status:"error", message: "Invalid token!", data: false});
            }else{
                res.json({status:"success", message: "valid token!", data: true});
            }
          });
    },
    decrypt: function(req, res, next){
        jwt.verify(req.body.token,req.app.get('secretKey'),function(err,token){
            if(err){
                res.json({status:"error", message: "Invalid token!", data: false});
            }else{
                res.json({status:"success", message: "valid token!", data: jwt.decode(req.body.token, {complete: true})});
            }
          });
    },
    getAll: function(req, res, next){
        jwt.verify(req.headers['x-access-token'],req.app.get('secretKey'),function(err,token){
            if(err){
                res.json({status:"error", message: "Invalid token!", data: false});
            }else{
                let userList = [];
                let mail = jwt.decode(req.headers['x-access-token'], {complete: true}).payload.email;
                if(mail === 'tom@pbfp.be'){
                userModel.find({}, function(err, users){
                    if (err){
                        next(err);
                    } else {
                        for (let user of users) {
                            events.getEventCount(user.email,(count) => {
                                userList.push({id: user._id, name: user.name, email: user.email, eventCount: count, title: user.name + " | " + user.email + " --- " + count});
                                if(users.length === userList.length){
                                    res.json({status:"success", message: "user list found!!!", data:{events: userList}});
                                }
                            });
                        }
                    }
                    });
                }else{
                res.json({status:"error", message: "You are no admin", data: false});
            }
          }
        });
    },
    deleteById: function(req, res, next){
        jwt.verify(req.headers['x-access-token'],req.app.get('secretKey'),function(err,token){
            if(err){
                res.json({status:"error", message: "Invalid token!", data: false});
            }else{
                let mail = jwt.decode(req.headers['x-access-token'], {complete: true}).payload.email;
                if(mail === 'tom@pbfp.be'){
                    userModel.findByIdAndDelete(req.params.id,function(err, delted){
                        events.removeAll(delted.email);
                        res.json({status:"success", message: "Deleted user", data: false});
                    });
                }else{
                res.json({status:"error", message: "You are no admin", data: false});
            }
          }
        });
    }
}