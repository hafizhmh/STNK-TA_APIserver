const express = require('express');
const mongoose = require('mongoose');

// set up express app
const app = express();
const fs = require('fs');
const http = require('http');
const https = require('https');

// Please put MongoDB connection string on ./connectionString.txt
const connectionString = fs.readFileSync('./connectionString.txt', 'utf8')
// get local ip
var os = require('os');
var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

// HTTPS?
const isHTTPS = false

// Certificate
if (isHTTPS) {
        const privateKey = fs.readFileSync('/etc/letsencrypt/live/stnk-api-ta.tech/privkey.pem', 'utf8');
        const certificate = fs.readFileSync('/etc/letsencrypt/live/stnk-api-ta.tech/cert.pem', 'utf8');
        const ca = fs.readFileSync('/etc/letsencrypt/live/stnk-api-ta.tech/chain.pem', 'utf8');
        const credentials = {
                key: privateKey,
                cert: certificate,
                ca: ca
        };
}

// connect to mongodb
mongoose.connect(connectionString);
mongoose.Promise = global.Promise;

//app.use(function(req, res, next) {
//      if ((req.get('X-Forwarded-Proto') !== 'https')) {
//        res.redirect('https://' + req.get('Host') + req.url);
//      } else
//        next();
//    });

// use body-parser middleware
app.use(express.json({ limit: '100MB'}));

// initialize routes
if (isHTTPS) {
        app.use (function (req, res, next) {
                if (req.secure) {
                        // request was via https, so do no special handling
                        next();
                } else {
                        // request was via http, so redirect to https
                        res.redirect('https://' + req.headers.host + req.url);
                }
        });
}

app.use('/api', require('./routes/api'));

// def
app.get('/', (req, res) => {
	  res.redirect('/api/test');
});

// error handling
app.use(function(err, req, res, next){
  console.log(err);
  res.status(422).send({error: err.message});
});

if (isHTTPS) {
        const httpServer = http.createServer(app);
        const httpsServer = https.createServer(credentials, app);
        
        httpServer.listen(80, () => {
                console.log('HTTP Server running on port 80');
        });
        
        httpsServer.listen(443, () => {
                console.log('HTTPS Server running on port 443');
        });
} else {
        // listen for requests
        app.listen(process.env.port || 4000, function(){
                console.log('now listening for requests');
        });

}
console.log("Local IP:")
console.log(addresses);