const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema({
    powner: {type:mongoose.Schema.Types.ObjectId, ref:'Agent'},  
    pno: String,
    pname: String,
    ptype: String,
    pquote: String,
    pdesc: String,
    pimages: [String],
    pfeatures: [String],
    pbenifits: String
});

const PolicyModel = mongoose.model('Policy',PolicySchema);

module.exports = PolicyModel;