const mongoose = require('mongoose');
const { Schema } = mongoose;

const UnitSchema = new Schema({
    unitName:{
        type:String,
        required:true,
    }
});

module.exports = mongoose.model('Unit', UnitSchema);