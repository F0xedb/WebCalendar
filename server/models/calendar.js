const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
 user: {
    type: String,
    trim: true,
    required: true,
 },
 start: {
  type: Date,
  trim: true,  
  required: true,
 },
 end: {
    type: Date,
    trim: true,  
    required: true,
   },
 name: {
    type: String,
    trim: true,  
    required: true,
   },
});

module.exports = mongoose.model('Event', EventSchema);