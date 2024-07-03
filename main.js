//Basic Breakdown of Code
//main.js
//main sets extension uses and routes to error pages, sets use for main handlebars and main supplementary views

//JS files in public
//Used to to URL routes so that JS scripts set to handlebars can get route and perform functions
//Also used select attributes in handlebars update pages for user-friendliness

//JS files outside public
//Used to form functions/sql queries to be performed when URL gets to route
//Reads URL routes and performs functions when route is reeached. This then gets context to send to appropriate handlebars pages
//These files have all CRUD functions

//views handlebars
//sets and formats supplementary handlebar pages. Similar to regular html pages, but uses eachs to fill in data in form of table rows and drop-downs
//Calls functions on click from public JS files to set a URL for other JS files to read and perform functions

//main handlebars
//default layout of every page
//sets scripts passed on what is passed in to reduce risk of same function names
//gets body from specified view page

var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({
        defaultLayout:'main',
        });

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.set('mysql', mysql);
app.use('/pokes', require('./pokes.js'));
app.use('/types', require('./types.js'));
app.use('/moves', require('./moves.js'));
app.use('/pokeMoves', require('./pokeMoves.js'));
app.use('/evolutions', require('./evolutions.js'));
app.use('/', express.static('public'));

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
