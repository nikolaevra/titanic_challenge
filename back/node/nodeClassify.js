/**
 * Created by Ruslan on 9/23/2017.
 */
const CLASSIFIER = 'main.py';

let PythonShell = require('python-shell');

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

pyPredictor().then((data) => {
    console.log(data);
}).catch((err) => {
    console.log(err);
});