/*eslint indent:[1,4]*/
var Q        = require('q'),
    fs       = require('fs'),
    execSync = require('child_process').execSync,
    path     = require('path'),
    filendir = require('filendir'),
    log      = require('../utils').log;

module.exports = function (bdir) {
    var dir;

    function run(file) {

        const ignore = [
            /node_modules/,
            /lib\/new/,
            /lib\/react/,
            /webpack.config.js/
        ]

        const isMatch = ignore.some((rx) => rx.test(file.name));

        if (isMatch) {
            return;
        }

        try {
            var p = path.resolve(dir, file.vname || file.name);
            filendir.writeFileSync(p, file.contents);
            log.info('SAVING: %s', file.name);
            return file;
        } catch (e) {
            e.filename = file.name;
            throw e;
        }
    }

    function main(files) {
        var d = Q.defer();
        if (!files.map) { files = [files]; }

        try {
            fs.readdirSync(dir);
            execSync('rm -rf ' + dir);
        } catch (_) {
            log.info('…');
        }

        fs.mkdirSync(dir);
        Q.all(files.map(run)).then(d.resolve, d.reject);
        return d.promise;
    }

    //DO NOT FALLBACK BDIR DUE SAFETY REASONS
    if (!bdir) { throw new Error('No Build dir specified'); }
    dir = path.resolve(bdir);
    return main;
};
