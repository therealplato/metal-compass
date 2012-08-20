
/**
 * Module dependencies.
 */

var express = require('express')
var nano = require('nano')('http://localhost:5984');
var couchdb = nano.use('metal-compass');
var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view options', {layout:false});
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'yourasdf secret here' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});
// Routes

require('./routes.js')(nano,couchdb);  // we immediately call the exported fn

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
