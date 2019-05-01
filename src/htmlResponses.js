const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../client/index.html`);
const mainJS = fs.readFileSync(`${__dirname}/../client/js/main.js`);
const cloudJS = fs.readFileSync(`${__dirname}/../client/js/d3.layout.cloud.js`);
const font = fs.readFileSync(`${__dirname}/../client/Fonts/Handwriting2.ttf`);
const css = fs.readFileSync(`${__dirname}/../client/css/main.css`);
const d3 = fs.readFileSync(`${__dirname}/../client/js/d3.v5.min.js`);

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getMainJS = (request, response) => {
  response.writeHead(200, {'Content-Type': 'text/javascript'})
  response.write(mainJS)
  response.end();
}

const getCloud = (request, response) => {
  response.writeHead(200, {'Content-Type': 'text/javascript'})
  response.write(cloudJS)
  response.end();
}

const getFont = (request, response) => {
  response.writeHead(200, {'Content-Type': 'application/octet-stream'})
  response.write(font)
  response.end();
}

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

const getD3 = (request, response) => {
  response.writeHead(200, {'Content-Type': 'textjavascript'})
  response.write(d3);
  response.end();
}
// set out public exports
module.exports.getIndex = getIndex;
module.exports.getCSS = getCSS;
module.exports.getMainJS = getMainJS;
module.exports.getCloud = getCloud;
module.exports.getFont = getFont;
module.exports.getD3 = getD3;