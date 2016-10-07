var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var ejs = require('ejs')

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');

// port setup
app.set('port', process.env.PORT || 2200);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err.message);
    res.render('error', {
      
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(err.message);
  res.render('error', {
    
    message: err.message,
    error: {}
  });
});


var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

var users = {};
io.sockets.on('connection', function(socket){
  socket.on('online', function(data){
    socket.name = data.user;
    if(!users[data.user]){
      users[data.user] = data.user;
    }
    io.sockets.emit('online', {user: data.user, users: users});
  });

  socket.on('onmessage', function(data){
    var msg = data.msg;

    if(data.to == 'all'){
      socket.broadcast.emit('onmessage', data);
      return;
    }
    var clients = io.sockets.clients();
 
    for(var item in clients){
      if(data.to === item.name){
        // io.sockets.emit('onmessage', data);
      }
    }

  })
})
module.exports = app;
