/**
 * Gulp Packages.
 */

// General.
const gulp        = require('gulp');
const fs          = require('fs');
const del         = require('del');
const lazypipe    = require('lazypipe');
const plumber     = require('gulp-plumber');
const flatten     = require('gulp-flatten');
const tap         = require('gulp-tap');
const rename      = require('gulp-rename');
const header      = require('gulp-header');
const footer      = require('gulp-footer');
const fileinclude = require('gulp-file-include');
const ignore      = require('gulp-ignore');
const browser     = require('browser-sync').create();
const gutil       = require('gulp-util');
const argv        = require('minimist')(process.argv);
const prompt      = require('gulp-prompt');
const gulpif      = require('gulp-if');
const package     = require('./package.json');

// Scripts and tests.
const jshint      = require('gulp-jshint');
const stylish     = require('jshint-stylish');
const concat      = require('gulp-concat');
const uglify      = require('gulp-uglify');

// Styles.
const sass        = require('gulp-sass');
const prefix      = require('gulp-autoprefixer');
const minify      = require('gulp-cssnano');
const bourbon     = require('node-bourbon');
const stylefmt    = require('gulp-stylefmt');
const postcss     = require('gulp-postcss');
const sorting     = require('postcss-sorting');

// Media.
const imagemin    = require('gulp-imagemin');


/**
 * Config to project.
 */

const config = {
  proxy: 'localhost:81/olist',
  port: 3000,
  tunner: true
}

/**
 * Paths to project folders.
 */

const paths = {
  scripts: {
    input: 'assets/src/js/*.js',
    output: 'assets/js/'
  },
  styles: {
    input: 'assets/src/scss/**/*.{scss,sass}',
    output: 'assets/css/',
  },
  images: {
    input: 'assets/src/images/**/*',
    output: 'assets/images/'
  },
  fonts: {
    input: ['assets/src/fonts/**/*','assets/src/fonts/*'],
    output: 'assets/fonts/'
  },
  dist: {
    input:'**',
    ignore: ['dist', '*.zip', '*.json', 'doc',  'node_modules/**', 'node_modules', 'assets/components/**', 'assets/components', 'assets/src/**', 'assets/src', 'bower.json' , 'gulpfile.js', 'package.json', 'README.md'],
    output: 'dist/'
  }
};


/**
 * Template for banner to add to file headers.
 */

const banner = {
  full :
    '/*!\n' +
    ' * <%= package.name %> v<%= package.version %> <<%= package.homepage %>>\n'+
    ' * <%= package.title %> : <%= package.description %>\n' +
    ' * (c) ' + new Date().getFullYear() + ' <%= package.author.name %> <<%= package.author.url %>>\n' +
    ' * MIT License\n' +
    ' * <%= package.repository.url %>\n' +
    ' */\n\n',
  min :
    '/*!\n' +
    ' * <%= package.name %> v<%= package.version %> <<%= package.homepage %>>\n'+
    ' * <%= package.title %> : <%= package.description %>\n' +
    ' * (c) ' + new Date().getFullYear() + ' <%= package.author.name %> <<%= package.author.url %>>\n' +
    ' * MIT License\n' +
    ' * <%= package.repository.url %>\n' +
    ' */\n'
};


/**
 * Gulp Taks.
 */

// Lint, minify, and concatenate scripts.
gulp.task('build:scripts', function() {
  var jsTasks = lazypipe()
    .pipe(header, banner.full, { package : package })
    .pipe(gulp.dest, paths.scripts.output)
    .pipe(rename, { suffix: '.min' })
    .pipe(uglify)
    .pipe(header, banner.min, { package : package })
    .pipe(gulp.dest, paths.scripts.output);

  return gulp.src(paths.scripts.input)
    .pipe(plumber())
    .pipe(fileinclude({
      prefix: '//=',
      basepath: '@file'
    }))
    .pipe(tap(function (file, t) {
      if ( file.isDirectory() ) {
        var name = file.relative + '.js';
        return gulp.src(file.path + '/*.js')
          .pipe(concat(name))
          .pipe(jsTasks());
      }
    }))
    .pipe(jsTasks());
});

/// Process, lint, and minify Sass files.
gulp.task('build:styles', function() {
  return gulp.src(paths.styles.input)
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'expanded',
      sourceComments: false,
      includePaths: bourbon.includePaths
    }).on('error', function(err) {
        console.error(err.message);
        browser.notify(err.message, 3000); // Display error in the browser
        this.emit('end'); // Prevent gulp from catching the error and exiting the watch process
    }))
    .pipe(flatten())
    .pipe(prefix({
      browsers: ['last 2 version', '> 5%'],
      cascade: true,
      remove: true
    }))
    .pipe(postcss([
      sorting({
        "order": ["custom-properties", "dollar-variables", "declarations", "rules", "at-rules"],
        "properties-order": [
          "position",
          "z-index",
          "top",
          "right",
          "bottom",
          "left",
          "display",
          "visibility",
          "float",
          "flex-direction",
          "flex-order",
          "flex-pack",
          "flex-align",
          "-webkit-box-sizing",
          "-moz-box-sizing",
          "box-sizing",
          "width",
          "min-width",
          "max-width",
          "height",
          "min-height",
          "max-height",
          "padding",
          "padding-top",
          "padding-right",
          "padding-bottom",
          "padding-left",
          "margin",
          "margin-top",
          "margin-right",
          "margin-bottom",
          "margin-left",
          "clear",
          "overflow",
          "overflow-x",
          "overflow-y",
          "-ms-overflow-x",
          "-ms-overflow-y",
          "clip",
          "zoom",
          "font",
          "font-family",
          "font-size",
          "font-weight",
          "font-style",
          "font-variant",
          "font-size-adjust",
          "font-stretch",
          "font-effect",
          "font-emphasize",
          "font-emphasize-position",
          "font-emphasize-style",
          "font-smooth",
          "line-height",
          "table-layout",
          "empty-cells",
          "caption-side",
          "border-spacing",
          "border-collapse",
          "list-style",
          "list-style-position",
          "list-style-type",
          "list-style-image",
          "content",
          "quotes",
          "counter-reset",
          "counter-increment",
          "resize",
          "cursor",
          "-webkit-user-select",
          "-moz-user-select",
          "-ms-user-select",
          "user-select",
          "nav-index",
          "nav-up",
          "nav-right",
          "nav-down",
          "nav-left",
          "-webkit-transition",
          "-moz-transition",
          "-ms-transition",
          "-o-transition",
          "transition",
          "-webkit-transition-delay",
          "-moz-transition-delay",
          "-ms-transition-delay",
          "-o-transition-delay",
          "transition-delay",
          "-webkit-transition-timing-function",
          "-moz-transition-timing-function",
          "-ms-transition-timing-function",
          "-o-transition-timing-function",
          "transition-timing-function",
          "-webkit-transition-duration",
          "-moz-transition-duration",
          "-ms-transition-duration",
          "-o-transition-duration",
          "transition-duration",
          "-webkit-transition-property",
          "-moz-transition-property",
          "-ms-transition-property",
          "-o-transition-property",
          "transition-property",
          "-webkit-transform",
          "-moz-transform",
          "-ms-transform",
          "-o-transform",
          "transform",
          "-webkit-transform-origin",
          "-moz-transform-origin",
          "-ms-transform-origin",
          "-o-transform-origin",
          "transform-origin",
          "-webkit-animation",
          "-moz-animation",
          "-ms-animation",
          "-o-animation",
          "animation",
          "-webkit-animation-name",
          "-moz-animation-name",
          "-ms-animation-name",
          "-o-animation-name",
          "animation-name",
          "-webkit-animation-duration",
          "-moz-animation-duration",
          "-ms-animation-duration",
          "-o-animation-duration",
          "animation-duration",
          "-webkit-animation-play-state",
          "-moz-animation-play-state",
          "-ms-animation-play-state",
          "-o-animation-play-state",
          "animation-play-state",
          "-webkit-animation-timing-function",
          "-moz-animation-timing-function",
          "-ms-animation-timing-function",
          "-o-animation-timing-function",
          "animation-timing-function",
          "-webkit-animation-delay",
          "-moz-animation-delay",
          "-ms-animation-delay",
          "-o-animation-delay",
          "animation-delay",
          "-webkit-animation-iteration-count",
          "-moz-animation-iteration-count",
          "-ms-animation-iteration-count",
          "-o-animation-iteration-count",
          "animation-iteration-count",
          "-webkit-animation-direction",
          "-moz-animation-direction",
          "-ms-animation-direction",
          "-o-animation-direction",
          "animation-direction",
          "text-align",
          "-webkit-text-align-last",
          "-moz-text-align-last",
          "-ms-text-align-last",
          "text-align-last",
          "vertical-align",
          "white-space",
          "text-decoration",
          "text-emphasis",
          "text-emphasis-color",
          "text-emphasis-style",
          "text-emphasis-position",
          "text-indent",
          "-ms-text-justify",
          "text-justify",
          "letter-spacing",
          "word-spacing",
          "-ms-writing-mode",
          "text-outline",
          "text-transform",
          "text-wrap",
          "text-overflow",
          "-ms-text-overflow",
          "text-overflow-ellipsis",
          "text-overflow-mode",
          "-ms-word-wrap",
          "word-wrap",
          "word-break",
          "-ms-word-break",
          "-moz-tab-size",
          "-o-tab-size",
          "tab-size",
          "-webkit-hyphens",
          "-moz-hyphens",
          "hyphens",
          "pointer-events",
          "opacity",
          "filter:progid:DXImageTransform.Microsoft.Alpha(Opacity",
          "-ms-filter:\\'progid:DXImageTransform.Microsoft.Alpha",
          "-ms-interpolation-mode",
          "color",
          "border",
          "border-width",
          "border-style",
          "border-color",
          "border-top",
          "border-top-width",
          "border-top-style",
          "border-top-color",
          "border-right",
          "border-right-width",
          "border-right-style",
          "border-right-color",
          "border-bottom",
          "border-bottom-width",
          "border-bottom-style",
          "border-bottom-color",
          "border-left",
          "border-left-width",
          "border-left-style",
          "border-left-color",
          "-webkit-border-radius",
          "-moz-border-radius",
          "border-radius",
          "-webkit-border-top-left-radius",
          "-moz-border-radius-topleft",
          "border-top-left-radius",
          "-webkit-border-top-right-radius",
          "-moz-border-radius-topright",
          "border-top-right-radius",
          "-webkit-border-bottom-right-radius",
          "-moz-border-radius-bottomright",
          "border-bottom-right-radius",
          "-webkit-border-bottom-left-radius",
          "-moz-border-radius-bottomleft",
          "border-bottom-left-radius",
          "-webkit-border-image",
          "-moz-border-image",
          "-o-border-image",
          "border-image",
          "-webkit-border-image-source",
          "-moz-border-image-source",
          "-o-border-image-source",
          "border-image-source",
          "-webkit-border-image-slice",
          "-moz-border-image-slice",
          "-o-border-image-slice",
          "border-image-slice",
          "-webkit-border-image-width",
          "-moz-border-image-width",
          "-o-border-image-width",
          "border-image-width",
          "-webkit-border-image-outset",
          "-moz-border-image-outset",
          "-o-border-image-outset",
          "border-image-outset",
          "-webkit-border-image-repeat",
          "-moz-border-image-repeat",
          "-o-border-image-repeat",
          "border-image-repeat",
          "outline",
          "outline-width",
          "outline-style",
          "outline-color",
          "outline-offset",
          "background",
          "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader",
          "background-color",
          "background-image",
          "background-repeat",
          "background-attachment",
          "background-position",
          "background-position-x",
          "-ms-background-position-x",
          "background-position-y",
          "-ms-background-position-y",
          "-webkit-background-clip",
          "-moz-background-clip",
          "background-clip",
          "background-origin",
          "-webkit-background-size",
          "-o-background-size",
          "-moz-background-size",
          "background-size",
          "box-decoration-break",
          "-webkit-box-shadow",
          "-moz-box-shadow",
          "box-shadow",
          "filter:progid:DXImageTransform.Microsoft.gradient",
          "-ms-filter:\\'progid:DXImageTransform.Microsoft.gradient",
          "text-shadow"
        ]
      })
    ]))
    .pipe(stylefmt())
    .pipe(gulp.dest(paths.styles.output))
    .pipe(header(banner.full, { package : package }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minify({
      zindex: false,
      discardComments: {
        removeAll: true
      }
    }))
    .pipe(header(banner.min, { package : package }))
    .pipe(gulp.dest(paths.styles.output))
    .pipe(browser.stream());
});


// Copy image files into output folder.
gulp.task('build:images', function() {
  return gulp.src(paths.images.input)
    .pipe(imagemin())
    .pipe(plumber())
    .pipe(gulp.dest(paths.images.output));
});

// Copy fonts files into output folder.
gulp.task('build:fonts', function() {
  return gulp.src(paths.fonts.input)
    .pipe(plumber())
    .pipe(gulp.dest(paths.fonts.output));
});

// Lint scripts.
gulp.task('lint:scripts', function () {
  return gulp.src(paths.scripts.input)
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// Remove pre-existing content from scripts output directory.
gulp.task('clean:scripts', function () {
  return del.sync(paths.scripts.output);
});

// Remove pre-existing content from styles output directory.
gulp.task('clean:styles', function () {
  return del.sync(paths.styles.output);
});

// Remove pre-existing content from images output directory.
gulp.task('clean:images', function () {
  return del.sync(paths.images.output);
});

// Remove pre-existing content from fonts output directory.
gulp.task('clean:fonts', function () {
  return del.sync(paths.fonts.output);
});

// Remove dist folder.
gulp.task('clean:dist', function () {
  return del.sync(paths.dist.output);
});

// Generate dist files.
gulp.task('copy:dist', function() {
  return gulp.src(paths.dist.input)
    .pipe(ignore.exclude(paths.dist.ignore))
    .pipe(plumber())
    .pipe(gulp.dest(paths.dist.output));
});


// Starts a BrowerSync instance.
gulp.task('serve', function(){
  browser.init({
        server: {
            baseDir: "./",
        }
    });
  //browser.init({proxy: config.proxy, port: config.port, notify: false});
});
// Watch files for changes.
gulp.task('watch', function() {
  gulp.watch(paths.styles.input, ['styles', browser.reload]);
  gulp.watch(paths.scripts.input, ['scripts', browser.reload]);
  gulp.watch(['*.php','{inc,template-parts,core}/**/*.php',' *.html']).on("change", browser.reload);
  // protip: stop old version of gulp watch from running when you modify the gulpfile
  gulp.watch("gulpfile.js").on("change", () => process.exit(0));
});

// Custom


/**
 * Task Runners.
 */

// Compile all files (default).
gulp.task('default', [
  'scripts',
  'styles',
  'images',
  'fonts'
]);

// Compile, init serve and watch files.
gulp.task('start', [
  'default',
  'serve',
  'watch'
]);

// Compile, init serve and watch files for dev.
gulp.task('dev', [
  'serve',
  'watch'
]);

// Generate dist.
gulp.task('dist', [
  'clean:dist',
  'copy:dist'
]);

// Compile scripts files.
gulp.task('scripts', [
  'clean:scripts',
  'lint:scripts',
  'build:scripts'
]);

// Compile styles files.
gulp.task('styles', [
  //'clean:styles',
  'build:styles'
]);

// Compile images files.
gulp.task('images', [
  'build:images'
]);

// Compile fonts files.
gulp.task('fonts', [
  'clean:fonts',
  'build:fonts'
]);

function throwError(taskName, msg) {
  throw new gutil.PluginError({
    plugin: taskName,
    message: msg
  });
}


