// grab our packages
const gulp   = require('gulp'),
      postcss = require('gulp-postcss'),
      sass   = require('gulp-sass'),
      cssnext = require('postcss-cssnext'), //includes autoprefixer in build
      will_change = require('postcss-will-change'), 
      sourcemaps = require('gulp-sourcemaps'),
      child = require('child_process'),
      gutil = require('gulp-util'),
      browserSync = require('browser-sync').create(),
      //
      scssFiles = '_dev/scss/**/*.scss',
      siteRoot = '_site';

// compile scss partials
gulp.task('compile-scss', function() {
  var processors = [
    will_change, //always load before cssnext(autoprefixer) so it get prefixed properly
    cssnext
  ]

  return gulp.src(scssFiles)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss(processors))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('assets/css'));
});

// launch jekyll server
gulp.task('jekyll', () => {
  const jekyll = child.spawn('jekyll', ['serve',
    '--watch',
    '--incremental',
    '--drafts'
  ]);

  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };

  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

// browswersync + files to watch for compiling
gulp.task('serve', () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });

  gulp.watch(scssFiles, ['compile-scss']);
});

// gulp
gulp.task('default', ['compile-scss', 'jekyll', 'serve']);
