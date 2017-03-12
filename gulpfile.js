const gulp = require('gulp')

const browserify = require('browserify')
const envify = require('envify/custom')
const source = require('vinyl-source-stream')

const sass = require('gulp-sass')
const cssnano = require('gulp-cssnano')
const rename = require('gulp-rename')

const paths = {
  jsx: {
    source: './src/app/index.jsx',
    watch: ['./src/app/**/*.js*'],
    destination: './app/',
    name: 'app.js'
  },
  sass: {
    source: './src/sass/style.scss',
    watch: ['./src/sass/**/*.scss'],
    destination: './app/',
    name: 'style.css'
  },
  fonts: {
    source: [ './bower_components/photon/fonts/*.woff', './bower_components/cryptocoins/fonts/*.woff' ],
    destination: './app/fonts/'
  },
  files: {
    source: [ './src/package.json', './src/index.html', './src/main.js', './src/*.png' ],
    destination: './app/'
  }
}

gulp.task('copy-fonts', () => gulp.src(paths.fonts.source).pipe(gulp.dest(paths.fonts.destination)))
gulp.task('copy-files', () => gulp.src(paths.files.source).pipe(gulp.dest(paths.files.destination)))

gulp.task('jsx', () => {
  return browserify({
    entries: paths.jsx.source,
    browserField: false,
    builtins: false,
    commondir: false,
    insertGlobalVars: {
      process: undefined,
      global: undefined,
      'Buffer.isBuffer': undefined,
      Buffer: undefined
    }
  })
  .transform('babelify')
  .bundle()
  .pipe(source(paths.jsx.name))
  .pipe(gulp.dest(paths.jsx.destination))
})

gulp.task('jsx:build', () => {
  return browserify({
    entries: paths.jsx.source,
    browserField: false,
    builtins: false,
    commondir: false,
    insertGlobalVars: {
      process: undefined,
      global: undefined,
      'Buffer.isBuffer': undefined,
      Buffer: undefined
    }
  })
  .transform('babelify')
  .transform(envify({ NODE_ENV: 'production' }))
  .transform({ global: true }, 'uglifyify')
  .bundle()
  .pipe(source(paths.jsx.name))
  .pipe(gulp.dest(paths.jsx.destination))
})

gulp.task('sass', () => {
  return gulp
  .src(paths.sass.source)
  .pipe(sass())
  .pipe(rename(paths.sass.name))
  .pipe(gulp.dest(paths.sass.destination))
})

gulp.task('sass:build', () => {
  return gulp
  .src(paths.sass.source)
  .pipe(sass())
  .pipe(cssnano())
  .pipe(rename(paths.sass.name))
  .pipe(gulp.dest(paths.sass.destination))
})

gulp.task('jsx:watch', () => gulp.watch(paths.jsx.watch, ['jsx']))
gulp.task('sass:watch', () => gulp.watch(paths.sass.watch, ['sass']))

gulp.task('setup', ['copy-resources', 'build'])
gulp.task('copy-resources', ['copy-fonts', 'copy-files'])
gulp.task('watch', ['jsx:watch', 'sass:watch'])
gulp.task('build', ['jsx:build', 'sass:build'])
gulp.task('default', ['jsx', 'sass', 'watch'])
