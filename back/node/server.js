/**
 * Created by Ruslan on 9/23/2017.
 */
'use strict';

const https = require('https');
const {spawn} = require('child_process');
const config = require('./config.js');

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

https.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end("test");

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

console.log(`Server running. Test by curl http://localhost:${config.PORT}/`);
