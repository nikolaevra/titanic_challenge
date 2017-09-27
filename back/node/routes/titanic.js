/**
 * Created by Ruslan on 9/27/2017.
 */

let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('titanic');
});

module.exports = router;
