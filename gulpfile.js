const gulp = require('gulp')

const browserify = require('browserify')
const envify = require('envify/custom')
const source = require('vinyl-source-stream')

const sass = require('gulp-sass')
const cssnano = require('gulp-cssnano')
const rename = require('gulp-rename')

const config = {
  jsx: {
    source: './src/app/index.jsx',
    watch: [ './src/app/**/*.js*' ],
    destination: './app/',
    name: 'app.js'
  },
  sass: {
    source: './src/sass/style.scss',
    watch: [ './src/sass/**/*.scss' ],
    destination: './app/',
    name: 'style.css'
  },
  resources: {
    fonts: {
      source: [ './bower_components/photon/fonts/*.woff', './bower_components/cryptocoins/fonts/*.woff' ],
      destination: './app/fonts/'
    },
    icons: {
      source: [ './src/icons/**/*.png' ],
      destination: './app/icons/'
    },
    files: {
      source: [ './src/package.json', './src/index.html', './src/main.js' ],
      destination: './app/'
    }
  }
}

gulp.task('copy-icons', () => gulp.src(config.resources.icons.source).pipe(gulp.dest(config.resources.icons.destination)))
gulp.task('copy-fonts', () => gulp.src(config.resources.fonts.source).pipe(gulp.dest(config.resources.fonts.destination)))
gulp.task('copy-files', () => gulp.src(config.resources.files.source).pipe(gulp.dest(config.resources.files.destination)))

gulp.task('jsx', () => {
  return browserify({
    entries: config.jsx.source,
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
  .pipe(source(config.jsx.name))
  .pipe(gulp.dest(config.jsx.destination))
})

gulp.task('jsx:build', () => {
  return browserify({
    entries: config.jsx.source,
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
  .pipe(source(config.jsx.name))
  .pipe(gulp.dest(config.jsx.destination))
})

gulp.task('sass', () => {
  return gulp
  .src(config.sass.source)
  .pipe(sass())
  .pipe(rename(config.sass.name))
  .pipe(gulp.dest(config.sass.destination))
})

gulp.task('sass:build', () => {
  return gulp
  .src(config.sass.source)
  .pipe(sass())
  .pipe(cssnano())
  .pipe(rename(config.sass.name))
  .pipe(gulp.dest(config.sass.destination))
})

gulp.task('jsx:watch', () => gulp.watch(config.jsx.watch, [ 'jsx' ]))
gulp.task('sass:watch', () => gulp.watch(config.sass.watch, [ 'sass' ]))

gulp.task('setup', [ 'copy-resources', 'build' ])
gulp.task('copy-resources', [ 'copy-fonts', 'copy-files', 'copy-icons' ])
gulp.task('watch', [ 'jsx:watch', 'sass:watch' ])
gulp.task('build', [ 'jsx:build', 'sass:build' ])
gulp.task('default', [ 'jsx', 'sass', 'watch' ])
