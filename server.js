var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ChatProvider = require('./controller/chatprovider.js').ChatProvider,
  	UserProvider = require('./controller/userprovider.js').UserProvider,
  	request = require('request'),
    util = require('util'),
    http = require('http'),
	port = process.env.PORT || 5000
;

var mongo = require('mongodb');
var BSON = mongo.BSONPure;

app.configure(function(){
  app.engine('html', require('ejs').renderFile);
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(app.routes);
  app.use(express.static(__dirname + '/public'));
  app.use(express.static(__dirname + '/views'));
  app.use('/public', express.static('public'));
  app.use('/public/zxcvbn', express.static('node_modules/zxcvbn/zxcvbn'));
});

var chatProvider = new ChatProvider(); 
var userProvider = new UserProvider();

var PATH = 'http://muty.herokuapp.com/';
PATH = 'http://localhost:' + port;

function generateFriends(v,callback) {
  if (v.length==0) callback(null,v);
  var x = 0;
  var friends = [];
  for (var i=0; i<v.length; i++) {
    userProvider.findOneId(v[i], function(error, result){
      friends.push(result);
      x++;
      if (x==v.length) callback(null, friends);
    });
  }
}

function doHash(str1,str2,callback) {
    callback(null, str1.substring(0,str1.length/2) + str2.substring(0,str2.length/2));
}

function make_hash(str1, str2, callback) {
  if (str1>str2) {
    var tmp = str1;
    str1 = str2;
    str2 = tmp;
  }
  doHash(str1,str2,function(error,str){
    if (typeof callback=="function") callback(null, str);
  });
}

app.get('/', function(req,res) {
  if (typeof req.session.user =="undefined" || !req.session.user) {
    res.redirect('/login');
  }
  else {
    var user = req.session.user;
    userProvider.findAllFriends(user.id, function(error, result) {
      generateFriends(result, function(error, friends) {
        res.render('home.html',{
          list:friends
        });
      });
    });
  }
});

app.post('/', function(req,res) {
  userProvider.insertFriend({user:req.session.user.id, friend:req.body.id}, function(error, result) {
    make_hash(req.session.user.id,req.body.id, function(error, hash) {
      res.redirect('/chat/'+hash);
    });
  });
});


app.get('/all', function(req,res) {
  if (typeof req.session.user =="undefined" || !req.session.user) {
    res.redirect('/login');
  }
  else {
    var user = req.session.user;
    userProvider.findAll(function(error, result) {
      console.dir(result);
      res.render('all.html',{
        list: result
      });
    });
  }
});

app.post('/all', function(req,res) {
  userProvider.insertFriend({user:req.session.user.id, friend:req.body.id}, function(error, result) {
    userProvider.insertFriend({user:req.body.id, friend:req.session.user.id}, function(error, result) {
      make_hash(req.session.user.id,req.body.id, function(error, hash) {
        res.redirect('/chat/'+hash);
      });
    });
  });
});

app.get('/chat/:chatHash', function(req,res) {
  if (typeof req.session.user =="undefined" || !req.session.user) {
    res.redirect('/login');
  }
  else {
    var hash = req.params.chatHash;
    chatProvider.insert(hash, function(error, result) {
      chatProvider.findOne(hash, function(error, result) {
        res.render('chat.html',{
          allchats: result,
          chatHash: result.chatHash,
          user: req.session.user
        });
      });
    });
  }
});

app.get('/login', function(req,res) {
  res.render('login.html',{
    message:""
  });
});

app.post('/login', function(req,res) {
  var user = req.body.user;
  userProvider.findOneName(user.name, function(error, result) {
    console.dir(result);
    if (!result || result.userPassword!=user.password) {
      res.render('login.html',{
        message:"The user or the password is invalid"
      });
    }
    else {
      user.id = result._id;
      req.session.user = user;
      res.redirect('/');
    }
  });
});

app.get('/signup', function(req,res) {
  res.render('signup.html',{
    message:""
  });
});

app.post('/signup', function(req,res) {
  var user = req.body.user;
  console.dir(user);
  if (user.name.length<3) {
    res.render('signup.html',{
      message:"The username is too short"
    });
  }
  else {
    if (user.password.length<4) {
      res.render('signup.html',{
        message:"The password is too short"
      });
    }
    else {
      console.dir(user);
      if (user.password!=user.confirmPassword) {
          res.render('signup.html',{
            message:"Tha passwords are different"
          });
      }
      else {
        userProvider.findOneEmail(user.email, function(error, result) {
          if (result) {
            res.render('signup.html',{
              message:"This email is in use"
            });
          }
          else {
            userProvider.insert(user, function(error, result) {
              userProvider.findOneEmail(user.email, function(error,result){
                user.id = result._id;
                req.session.user = user;
                res.redirect('/');
              });
            });
          }
        });
      }
    }
  }
});


server.listen(port);

io.sockets.on('connection', function(socket){

  console.log("--- io.sockets.on connection");

  socket.on('send message', function(data){
    console.dir(data);
    if (data.message == '');
    else {
      io.sockets.emit('new message', data);
      chatProvider.update(data, function(error, result) {
        if (error) console.log("ERROR: error al insertar mensaje.");
      });
    }
  });

});