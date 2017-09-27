/**
 * Created by Ruslan on 9/23/2017.
 */
'use strict';

const {spawn} = require('child_process');
const path = require('path');
const config = require('./config.js');
const express = require('express');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const http = require('http');
let debug = require('debug')('untitled:server');

let app = express();
let USR_ACC = 0;
let titanic = require('./routes/titanic');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', config.PORT);

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger('dev'));
app.use('/', titanic);

// let server = http.createServer(app);


let server = app.listen(config.PORT, function(){
    console.log(`listening on http://localhost:${config.PORT}/titanic`);
});

const io = require('socket.io')(server);

server.on('error', onError);
server.on('listening', onListening);

io.of('titanic').addListener('connection', function(socket){
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

app.get('/socket.io/', function(req, res) {
    let url = require('url');
    let url_parts = url.parse(request.url, true);
    let query = url_parts.query;
    let string  = '/titanic/socket.io/' + query;
    console.log(string);
    res.redirect(string);
});

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

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

module.exports = app;
