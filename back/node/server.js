/**
 * Created by Ruslan on 9/23/2017.
 */
'use strict';

const {spawn} = require('child_process');
const path = require('path');
const config = require('./config.js');
const express = require('express');
let app = express();

const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);

let index = require('./routes/index');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);

let USR_ACC = 0;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', function(socket){
    USR_ACC ++;
    console.log(`num of users ${USR_ACC}`);

    socket.on('disconnect', () => {
        USR_ACC --;
        console.log(`num of users ${USR_ACC}`);
    });

    socket.on('classify', (msg) => {
        pyPredictor([config.SCRIPT, config.SAVE, 'classify', JSON.stringify(msg)]).then((data) => {
            socket.emit('classify', JSON.stringify({
                val: data.toString('utf8').slice(0, -1)
            }));
            console.log(`classified: ${data}`);
        }).catch((data) => {
            console.log(`err: ${data}`);
        })
    });

    socket.on('accuracy', () => {
        pyPredictor(config.GETACCURACY).then((data) => {
            socket.emit('accuracy', JSON.stringify({
                val: data.toString('utf8').slice(0, -1)
            }));
            console.log(`accuracy: ${data}`);
        }).catch((data) => {
            console.log(`err: ${data}`);
        })
    });
});

http.listen(config.PORT, function(){
    console.log(`listening on http://localhost:${config.PORT}`);
});

function pyPredictor(args) {
    const script = spawn('python3', args);

    return new Promise((resolve, reject) => {
        script.stdout.on('data', (data) => {
            resolve(data);
        });
        script.stderr.on('data', (data) => {
            reject(data);
        });
        script.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    });
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

/*
 http.createServer(function (req, res) {
 //res.writeHead(200, {'Content-Type': 'text/plain'});
 //res.end("test");

 if (req.method === 'POST') {
 pyPredictor(config.CLASSIFY).then((data) => {
 res.writeHead(200, {'Content-Type': 'text/plain'});
 res.end(data);
 }).catch((err) => {
 res.writeHead(500, {'Content-Type': 'text/plain'});
 res.end(err);
 });
 } else if (req.method === 'GET') {
 pyPredictor(config.GETACCURACY).then((data) => {
 res.writeHead(200, {'Content-Type': 'text/plain'});
 res.end(data);
 }).catch((err) => {
 res.writeHead(500, {'Content-Type': 'text/plain'});
 res.end(err);
 });
 } else {
 res.writeHead(500, {'Content-Type': 'text/plain'});
 res.end('Invalid API request');
 }
 }).listen(config.PORT, 'localhost');
 */
// console.log(`Server running. Test by curl http://localhost:${config.PORT}/`);
