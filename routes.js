module.exports = function(nano,couchdb){
  app.get('/', function(req,res){
    if(req.session.handle){
      res.render('index');
    } else {
      res.render('welcome');
      //serve welcome msg, request handle
    };
  });
  app.post('/handle', function(req,res){
    _nick = req.query['handle'];
    if(!_nick || _nick.match(/[^0-9a-zA-Z]/)){
      res.send('Nick can\'t be blank and may only include '+
        'uppercase, lowercase, numerals', 400)
    } else {
      req.session.handle = _nick;
      res.redirect('/');
    };
  });

  app.get('/plot/:id', function(req,res){
    _id = req.params.id;
    if(_id.match(/[^0-9a-zA-Z]/){
      res.send('bad ID',404);
    } else {
      couchdb.get(_id, function(err,body){
        if(!err){
          res.render('plot', {compass:body});
        } else {
          res.send(500);
        };
      });
    };
  });
  app.get('/plot/new', function(req,res){
    var skel = {
      id:'',
      xname:'',
      yname:'',
      title:'',
      author:'',
      isAvg:false,
      isNew:true,
      forkedFrom:null,
      datapoints:[]
    };
    var skelstr=JSON.stringify(skel);
    res.render('plot_edit',{data:skel, datastr:skelstr});
  });
  
  app.post('/plot/done', function(req,res{
    newplot = JSON.parse(req.body.datastr);
    newplot.author = req.session.handle;
    if(newplot.id){
      _id=newplot.id;
      couchdb.get(_id, function(err,body){
// http://stackoverflow.com/questions/135448/how-do-i-check-to-see-if-an-object-has-an-attribute-in-javascript
        if(!err){ 
          oldplot=body;
          if(oldplot.author == newplot.author){ //ok to modify
            newplot._rev=oldplot._rev;
            couchdb.insert(newplot, _id, function(err,body){
              console.log('ERR:\n'+err);
              console.log('BODY:\n'+body);
            });
          } else {
            res.send('You didn\'t build that.',401);
          };
        } else {
          res.send('Bad ID', 500)
    if( req.user ==

  });
  app.post('/plot/:id/fork', function(req,res){
    _id = req.params.id;
    if(_id.match(/[^0-9a-zA-Z]/){
      res.send('bad ID',404);
    } else {
      couchdb.get(_id, function(err,body){
        if(!err){
          res.render('plot', {compass:body});
        } else {
          res.send(500);
        };
      });
    };
    
  });
  app.get('/search', routes.search);
};
