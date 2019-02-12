const calendarModel = require('../models/calendar');
const jwt = require('jsonwebtoken');

module.exports = {
 getById: function(req, res, next) {
  console.log(req.body);
  calendarModel.findById(req.params.calendarId, function(err, calendarInfo){
   if (err) {
    next(err);
   } else {
    res.json({status:"success", message: "event found!!!", data:{events: calendarInfo}});
   }
  });
 },

getAll: function(req, res, next) {
  let calendarList = [];
  let mail = jwt.decode(req.headers['x-access-token'], {complete: true}).payload.email;
  calendarModel.find({user: mail}, function(err, events){
    if (err){
        next(err);
    } else{
        for (let event of events) {
            calendarList.push({id: event._id, name: event.name, start: event.start, end: event.end});
        }
        res.json({status:"success", message: "Events list found!!!", data:{events: calendarList}});
    }
    });
 },

update: function(req, res, next) {
    let mail = jwt.decode(req.headers['x-access-token'], {complete: true}).payload.email;
    calendarModel.findOneAndUpdate({ user: mail, name: req.body.oldName},{ user: mail, name: req.body.name, start: req.body.start, end: req.body.end }, function(err, event){

    if(err)
        next(err);
    else {
        res.json({status:"success", message: "Event updated successfully!!!", data:null});
    }
    });
 },

delete: function(req, res, next) {
    let mail = jwt.decode(req.headers['x-access-token'], {complete: true}).payload.email;
    calendarModel.findOneAndDelete({ user: mail, name: req.body.name}, function(err, event){
        if(err)
            next(err);
        else {
            console.log({ user: mail, name: req.body.name, start: req.body.start, end: req.body.end });
            res.json({status:"success", message: "Event deleted successfully!!!", data:null});
        }
    });
 },

create: function(req, res, next) {
    let mail = '';
    jwt.verify(req.headers['x-access-token'],req.app.get('secretKey'),function(err,token){
        if(err){
            res.json({status:"error", message: "Invalid token!", data: false});
        }else{
            mail = jwt.decode(req.headers['x-access-token'], {complete: true}).payload.email;
            calendarModel.create({ user: mail, name: req.body.name, start: req.body.start, end: req.body.end }, function (err, result) {
                if (err) 
                 next(err);
                else
                 res.json({status: "success", message: "Event added successfully!!!", data: null});
                
              });
        }
      });
 },
 removeAll: function(mail) {
    calendarModel.deleteMany({ user: mail}, function(err){
        console.log("deleted user with mail: " + mail);
    });
 },
 getEventCount: function(mail, callback){
     console.log(mail);
     calendarModel.find({user: mail}, function(err, events){
        if (err){
            next(err);
        } else{
            console.log(events.length);
            callback(events.length);
        }
        });
     
 }

}