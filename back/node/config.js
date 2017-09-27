exports.DIR_ARR = __dirname.split('/');
exports.PARENT = exports.DIR_ARR.slice(0, exports.DIR_ARR.length - 1).join('/');
exports.SCRIPT = exports.PARENT + '/python/main.py';
exports.SAVE = exports.PARENT + '/python/save.p';
exports.GETACCURACY = [exports.SCRIPT, exports.SAVE, 'accuracy'];
exports.CLASSIFY = [exports.SCRIPT, exports.SAVE, 'classify', JSON.stringify([1, 1, 1, 20, 1, 0, 200])];
exports.PORT = 8080;
