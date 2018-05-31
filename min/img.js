/*jslint node:true*/
module.exports = function (files) {
    'use strict';
    var Q = require('q'),
        log = require('../utils').log;

    const imagemin = require('imagemin');
    const imageminJpegtran = require('imagemin-jpegtran');
    const imageminPngquant = require('imagemin-pngquant');



    function run(file) {
        var df = Q.defer(),
            // imagemin = new Imagemin(),
            originalSize = file.contents.length;
      return imagemin.buffer(file.contents, {
        plugins: [
          imageminJpegtran(),
          imageminPngquant({quality: '65-80'})
        ]
      
      }).then((files) => {
        var compressedSize = files[0].contents.length,
          compression = 100
          - Math.ceil((compressedSize * 100) / originalSize);

        file.contents = files[0].contents;
        if (compression) {
          log.info('[%s] compressed in %s%', file.name, compression);
        }
        df.resolve(df);
        return df.promise;
      }).catch((e) =>{
        if (e) {
          log.error(e);
          log.error('[%s] ERROR on compression, skipping', file.name);
          return df.resolve(df);
        }
      });
    }

    function main() {
        var d = Q.defer();
        if (!files.map) { files = [files]; }
        Q.all(files.map(run)).then(d.resolve, d.reject);
        return d.promise;
    }

    return main();
};
