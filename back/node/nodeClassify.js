/**
 * Created by Ruslan on 9/23/2017.
 */
const { spawn } = require('child_process');

function pyPredictor(process) {
    return new Promise((resolve, reject) => {
        let process = spawn('dir');

        process.stdout.on('data', (data) => {
            resolve(data);
        });

        process.stdout.on('exit', function (code, signal) {
            reject(`child process exited with code ${code} and signal ${signal}`);
        });

        process.stderr.on('data', function (code, signal) {
            reject(`child process exited with code ${code} and signal ${signal}`);
        });
    });
}

pyPredictor(process).then((data) => {
    console.log(data);
}).catch((err) => {
    console.log(err);
});