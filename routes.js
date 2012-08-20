module.exports = function(app,nano,couchdb){
  app.get('*', function(req,res,next){
    req.session._jade = {};
    if(req.session.handle){
      req.session._jade.handle = req.session.handle;
    } else {
      req.session._jade.handle = '';
    };
    next();
  });
  app.get('/', function(req,res){
    if(req.session.handle){
      res.render('index', {_jade:req.session._jade});
    } else {
      res.render('welcome', {_jade:req.session._jade});
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

  app.get('/plot/:id*', function(req,res,next){
    console.log('bang '+req.params.id);
    next();
/*    if(_id.match(/[^0-9a-zA-Z-]/){
      res.send('bad ID',404);*/
  });

  app.get('/plot/:id', function(req,res){
    var _id = req.params.id;
    if(_id.match(/[^0-9a-zA-Z-]/)){
      res.send('bad ID',404);
    } else {
      couchdb.get(_id, function(err,body){
        if(!err){
          res.render('plot_view', {_jade:req.session._jade, data:body, 
                                   datastr:JSON.stringify(body)});
        } else if(err.error == 'not_found'){
          res.send(404);
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
    res.render('plot_edit',{_jade:req.session._jade, data:skel, datastr:skelstr});
  }); //plot_edit has to post to plot/:id/done
  
  app.post('/plot/:id/done', function(req,res){
    newplot = JSON.parse(req.body.datastr);
    newplot.author = req.session.handle;
    if(newplot.id){
      var _id=newplot.id;
      couchdb.get(_id, function(err,body){
        if(!err){ // updating doc
          var oldplot=body;
          if(oldplot.author == newplot.author){ //ok to modify
            newplot._rev=oldplot._rev;
            couchdb.insert(newplot, _id, function(err,body){
              console.log('Attempted to save something at '+_id);
              console.log('ERR:\n'+err);
              console.log('BODY:\n'+body);
              res.redirect('/plot/'+_id);
            });
          } else {
            res.send('Someone else built that.',401);
          };
        } else if(err.error=='not_found'){ // new doc
          couchdb.insert(newplot,_id, function(err,body){
            if(!err){
              res.redirect('/plot/'+_id)
            } else {
              res.send('Problem saving...',500);
            };
          });
        } else {
          res.send('Bad ID', 500);
        };
      });
    } else { // !newplot.id
      res.send(404);
    };
  });
 /*
  * app.post('/plot/:id/fork', function(req,res){
    _id = req.params.id;


    } else {
      couchdb.get(_id, function(err,body){
        if(!err){
          res.render('plot', {compass:body});
        } else {
          res.send(500);
        };
      });
    };
    
  });*/

  //app.get('/search', routes.search);
  
  app.get('/init', function(req,res){
    couchdb.insert(
    {
      id:'metal-plato',
      xname:'musicality:melodic..thrash',
      yname:'vocals:demonic..ghey',
      title:'metal',
      author:'plato',
      isAvg:false,
      isNew:true,
      forkedFrom:null,
      datapoints:
      [{name:'Metallica',x:-0.6,y:0.2},{name:'Savatage',x:0,y:0}]
    },'metal-plato');
  });
};
