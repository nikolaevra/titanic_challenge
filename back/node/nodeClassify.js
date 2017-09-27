/**
 * Created by Ruslan on 9/23/2017.
 * This is a simplified version of invoking python scripts to ease the testing and debugging process.
 */

const {spawn} = require('child_process');
const dir_arr = __dirname.split('/');
const par = dir_arr.slice(0, dir_arr.length - 1).join('/');
const scr = par + '/python/main.py';
const save = par + '/python/save.p';
const get_accuracy = [scr, save, 'accuracy'];
let classify = [scr, save, 'classify', JSON.stringify([1, 0, 1, 20, 1, 0, 200])];

// 1, 3, 4, 5, 6, 8
// Pclass,Sex,Age,SibSp,Parch,Fare

function pyPredictor(args) {
    // console.log(args);
    const script = spawn('python3', args);

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

pyPredictor(classify).then((data) => {
    console.log(data);
}).catch((err) => {
    console.log(err);
});