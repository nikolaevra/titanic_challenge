/**
 * Created by Ruslan on 9/27/2017.
 */

let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('../views/index.html');
});

module.exports = router;
