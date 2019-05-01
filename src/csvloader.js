const express = require('express')
const csv = require('fast-csv')
const router = express.Router();
const fs = require('fs');
const mongoose = require('mongoose');
const Product  = mongoose.model('wine');
const csvfile = `${__dirname}/../client/wine.csv`;
const stream = fs.createReadStream(csvfile);

console.log('test')