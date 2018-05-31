/*jslint node:true*/
module.exports = function (files) {
  'use strict';
  const log = require('../utils').log;
  const imagemin = require('imagemin');
  const imageminJpegtran = require('imagemin-jpegtran');
  const imageminPngquant = require('imagemin-pngquant');
  const imageminSvgo = require('imagemin-svgo');

  const run = (file) => {
    const originalSize = file.contents.length;
    return imagemin.buffer(file.contents, {
      plugins: [
        imageminJpegtran(),
        imageminPngquant({quality: '65-80'}),
        imageminSvgo({plugins: [{removeViewBox: false}]})
      ]
    }).then((compressedFile) => {
      file.contents = compressedFile;
      const compressedSize = compressedFile.length;
      const compression = Math.round((compressedSize / originalSize) * 100);
      log.info('[%s] compressed to %s% of original', file.name, compression);
      return file;
    }).catch((e) =>{
      log.error('[%s] ERROR on compression, skipping', file.name);
    });
  }

  const main = async () => {
    if (!files.map) { files = [files]; }
    const compressed = await files.map(run);
    return compressed;
  }

  return main();
};
