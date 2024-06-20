const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    policy: {type:mongoose.Schema.Types.ObjectId, required:true, ref:'Policy'},
    user: {type:mongoose.Schema.Types.ObjectId, required:true, ref:'User'},
    agent: {type:mongoose.Schema.Types.ObjectId, required:true, ref:'Agent'},
    uname: {type: String, required: true},
    mobile: {type: String, required:true},
});

const BookingModel = mongoose.model('Booking', BookingSchema);

module.exports = BookingModel;