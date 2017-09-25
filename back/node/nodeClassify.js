/**
 * Created by Ruslan on 9/23/2017.
 */
const {spawn} = require('child_process');

const dir_arr = __dirname.split('/');
const par = dir_arr.slice(0, dir_arr.length - 1).join('/');
const scr = '/python/main.py';
const save = '/python/save.p';

function pyPredictor() {
    const script = spawn('python3', [par + scr, par + save, 'accuracy']);

    return new Promise((resolve, reject) => {
        script.stdout.on('data', (data) => {
            resolve(`stdout: ${data}`);
        });
        script.stderr.on('data', (data) => {
            reject(`stderr: ${data}`);
        });
        script.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    });
}

pyPredictor().then((data) => {
    console.log(data);
}).catch((err) => {
    console.log(err);
});