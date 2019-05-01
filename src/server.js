const http = require('http');
const url = require('url');
const query = require('querystring');
const express = require('express');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
const csvHandler = require('./csvResponses.js')
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const wineSchema = require(`${__dirname}/../models/wine.js`)

const csv = require('fast-csv')
const router = express.Router();
const fs = require('fs');
const wine  = mongoose.model('wine');
const csvfile = `${__dirname}/../client/wine.csv`;
const stream = fs.createReadStream(csvfile);

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/WineData';

const app = express();

app.use(session({ test: { maxAge: 60000 }, 
                  secret: 'secret',
                  resave: false, 
                  saveUninitialized: false}));

mongoose.Promise = global.Promise;

mongoose.connect(dbURL, (err) => {
  if(err){
    console.log('Error connecting to database')
    throw err;
  }
})

const handleGet = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/css/main.css') {
    htmlHandler.getCSS(request, response);
  } 
  else if (parsedUrl.pathname === '/js/main.js') {
    htmlHandler.getMainJS(request, response);
  } 
  else if (parsedUrl.pathname === '/js/d3.layout.cloud.js') {
    htmlHandler.getCloud(request, response);
  } 
  else if (parsedUrl.pathname === '/Fonts/Handwriting2.ttf') {
    htmlHandler.getFont(request, response);
  } 
  else if (parsedUrl.pathname === '/js/d3.v5.min.js'){
    htmlHandler.getD3(request, response);
  }
  else if (parsedUrl.pathname === '/wine.csv'){
   getCSV(request, response);
  }
  else if(parsedUrl.pathname === '/'){
    htmlHandler.getIndex(request, response);
  }
  else {
    jsonHandler.notFound(request, response);
  }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
    handleGet(request, response, parsedUrl);
};

const importCSV = (request, response) => {
   const wines = []
  
    const csvStream = csv().on("data", (d) => {
    
    
  let item = new wine({
      country: d[1],
      description: d[2],
      points: d[4],
      variety: d[12],
      price: d[5],
      winery: d[13]
    })

    item.save((err) => {
    if(err)
        throw err;
    });
    
  }).on('end', () => console.log("File imported"));
  stream.pipe(csvStream);
  
}
//const makerPage = (req, res) => {
//  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
//    if (err) {
//      console.log(err);
//      return res.status(400).json({ error: 'An error occurred' });
//    }
//
//	return res.render('app', {domos: docs});
//    //return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
//  });
//};



const getCSV = (req, res) => {
  importCSV();
  console.log('done import')
 wine.find({}, (err, docs) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(docs));
      console.log('done writing')
      res.end();
 })
}



http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
