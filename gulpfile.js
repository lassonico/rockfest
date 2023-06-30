const { src, dest, watch, parallel } = require("gulp");

const sass = require("gulp-sass")(require("sass"));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

const tercer = require('gulp-terser-js');

function css(done){
    //Identificar el archivo sass
    src('src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe( dest('build/css'));
    // compilar sass
    //almacenarlo en el disco duro
    done() // funcion asincrona que avisa a gulp que finaliza
}


function images(done) {
    const opciones = {
      optimizationLevel: 3
    };
    src('src/img/**/*.{png,jpg}')
      .pipe(imagemin(opciones))
      .pipe(dest('build/img'));
    done();
}

function imgwebp(done) {
    const options = {
      quality: 50
    };
    src('src/img/**/*.{png,jpg}')
      .pipe(webp(options))
      .pipe(dest('build/img'));
    done();
}

function imgAvif(done){
    const options = {
        quality: 50
    };
    src('src/img/**/*.{png,jpg}')
        .pipe(avif(options))
        .pipe(dest('build/img'));
    done();
}

function javascript(done){
  src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(tercer())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/js'))
  done();
}

function dev(done){
    watch('src/scss/**/*.scss', css)
    watch('src/js/**/*.js', javascript)
    done()
}

exports.css = css;
exports.js = javascript;
exports.images = images;
exports.imgwebp = imgwebp;
exports.imgAvif = imgAvif;
exports.dev = parallel(images, imgAvif, imgwebp, javascript, dev);
exports.build = parallel(images, imgAvif, imgwebp, javascript, dev);
exports.default = parallel(images, imgAvif, imgwebp, javascript, dev);