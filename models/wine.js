const mongoose = require('mongoose');

let wineModel = {};

const wineSchema = new mongoose.Schema({
    country: {type: String},
    description: {type: String},
    points: {type: Number},
    variety: {type: String},
    price: {type: Number},
    winery: {type: String}  
});

wineSchema.statics.findByVariety = (currVariety, callback) => {
    const search = {
        variety: currVariety,
    }
    
    return wineModel.find(search);
}


module.exports = mongoose.model('wine', wineSchema)
