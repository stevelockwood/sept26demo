'use strict';

console.log(`process.env.SERVER = ${process.env.SERVER}`);
// get the environment variable, but default to localhost:8082 if its not set
const SERVER = process.env.SERVER ? process.env.SERVER : "http://localhost:8082";
const BUILDTIME = process.env.BUILDTIME ? process.env.BUILDTIME : "00-00-00";


//
// express is a nodejs web server
// https://www.npmjs.com/package/express
const express = require('express');

// converts content in the request into parameter req.body
// https://www.npmjs.com/package/body-parser
const bodyParser = require('body-parser');

// express-handlebars is a templating library 
// https://www.npmjs.com/package/express-handlebars
// - look inside the views folder for the templates
// data is inserted into a template inside {{ }}
const hbs = require('express-handlebars');

// request is used to make REST calls to the backend microservice
// details here: https://www.npmjs.com/package/request
var request = require('request');

// create the server
const app = express();

// set up handlbars as the templating engine
app.set('view engine', 'hbs');
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultView: 'default'
}));

app.use(express.static('static')); 

// set up the parser to get the contents of data from html forms 
// this would be used in a POST to the server as follows:
// app.post('/route', urlencodedParser, (req, res) => {}
const urlencodedParser = bodyParser.urlencoded({ extended: false });


// defines a route that receives the request to /
app.get('/', (req, res) => {
                res.render('home',
                    {
                        layout: 'default',  //the outer html page
                        template: 'index-template', // the partial view inserted into 
                        // {{body}} in the layout - the code
                        // in here inserts values from the JSON
                        // received from the server
                        //events: body.events,
                        buildtime: new Date()
                    }); 

});





// generic error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});

// specify the port and start listening
const PORT = process.env.PORT ? process.env.PORT : 8080;
const server = app.listen(PORT, () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log(`Events app listening at http://${host}:${port}`);
});

module.exports = app;
