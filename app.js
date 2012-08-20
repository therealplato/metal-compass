var express = require('express')
var nano = require('nano')('http://localhost:5984');
// When a user first runs this, there is no db named metal-compass
nano.db.list(function(err,body){
  found=false;
  body.forEach(function(db){
    console.log(db);
    if(db.name =='metal-compass'){found == true};
  });
  if(!found){
    nano.db.create('metal-compass', function(err,body){
      if(err){throw new Error('can\' create metal-compass db');};
    });
  };
  var couchdb = nano.use('metal-compass');
});

//I need to have couchdb defined by this point, or throw an exception
var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname);
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

// (because I pass the couchdb object to further code here)
require('./routes.js')(app,nano,couchdb);  // we immediately call the exported fn

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
