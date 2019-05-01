//var express = require('express');
//var csv = require("fast-csv");
//var router = express.Router();
//var fs = require('fs');
//var mongoose = require('mongoose');
//const wine  = mongoose.model('wine');
//const csvfile = `${__dirname}/../client/wine.csv`;
//var stream = fs.createReadStream(csvfile);
//
//
//const importCSV = () => {
//   const wines = []
//  
//    const csvStream = csv().on("data", (d) => {
//    
//    
//  let item = new wine({
//      country: d[1],
//      description: d[2],
//      points: d[4],
//      variety: d[12],
//      price: d[5],
//      winery: d[13]
//    })
//
//  console.log(item)
//    item.save((err) => {
//      console.log(item)
//      
//      if(err)
//        throw err;
//    });
//    
//  }).on('end', () => console.log("File imported"));
//  stream.pipe(csvStream);
//  
//}
//
//module.exports.importCSV = importCSV;
