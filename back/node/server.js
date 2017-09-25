/**
 * Created by Ruslan on 9/23/2017.
 */
'use strict';

const https = require('https');
const PythonShell = require('python-shell');

const _PORT = 8000;
const CLASSIFIER = 'main.py';
const options = {
    scriptPath: '../python',
};

function pyPredictor() {
    return new Promise((resolve, reject) => {
        PythonShell.run(CLASSIFIER, options, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
}


https.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});

    pyPredictor().then((data) => {
        res.end(data);
    }).catch((err) => {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end(err);
    });

}).listen(_PORT, 'localhost');

console.log(`Server running. Test by curl http://localhost:${_PORT}/`);
