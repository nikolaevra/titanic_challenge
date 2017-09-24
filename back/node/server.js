/**
 * Created by Ruslan on 9/23/2017.
 */
'use strict';

const https = require('https');
const {spawn} = require("child_process").spawn;

const _PORT = 8000;

function pyPredictor(process) {
    return new Promise((resolve, reject) => {
        process.on('data', (chunk) => {
            let textChunk = chunk.toString('utf8');
            resolve(textChunk);
        });

        process.on('close', (code) => {
            if (code !== 0) {
                reject(`ps process exited with code ${code}`);
            }
        });

        process.on('error', (code) => {
            reject(`ps process exited with code ${code}`);
        });
    });
}


https.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});

    let process = spawn('python',['../python/main.py']);

    pyPredictor(process).then((data) => {
        res.end(data);
    }).catch((err) =>{
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end(err);
    });

}).listen(_PORT, 'localhost');

console.log(`Server running at http://localhost:${_PORT}/`);
