const { src, dest, parallel, series, watch } = require('gulp')

const del = require('del')
const browserSync = require('browser-sync')
const es = require('event-stream')

const sass = require('gulp-sass')
const babel = require('gulp-babel')
const imagemin = require('gulp-imagemin')
const rev = require('gulp-rev')
const cssmin = require('gulp-cssmin')
const rename = require('gulp-rename')
const postcss = require('gulp-postcss')
const uglify = require('gulp-uglify')
const inject = require('gulp-inject')
const autoprefixer = require('autoprefixer')

const pageConfig = require('./page.config')

const bs = browserSync.create()

const {
  src: srcDir,
  dist: distDir,
  tmp: tmpDir,
  public: publicDir,
  paths
} = pageConfig

const style = () => {
  return src(paths.style, { base: srcDir, cwd: srcDir })
    .pipe(postcss([autoprefixer()]))  
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(rev())
    .pipe(dest(distDir))
    .pipe(rev.manifest())
    .pipe(dest(distDir))
    .pipe(bs.reload({ stream: true }))
}

const script = () => {
  return src(paths.script, { base: srcDir, cwd: srcDir })
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(uglify())
    .pipe(rev())
    .pipe(dest(distDir))
    .pipe(rev.manifest())
    .pipe(dest(distDir))
    .pipe(bs.reload({ stream: true }))
}

const image = () => {
  return src(paths.image, { base: srcDir, cwd: srcDir })
    .pipe(imagemin())
    .pipe(rev())
    .pipe(dest(distDir))
    .pipe(rev.manifest())
    .pipe(dest(distDir))
    .pipe(bs.reload({ stream: true }))
}

const font = () => {
  return src(paths.font, { base: srcDir, cwd: srcDir })
    .pipe(imagemin())
    .pipe(rev())
    .pipe(dest(distDir))
    .pipe(rev.manifest())
    .pipe(dest(distDir))
    .pipe(bs.reload({ stream: true }))
}

const extra = () => {
  return src(paths.public, { base: publicDir, cwd: publicDir })
    .pipe(dest(distDir))
    .pipe(bs.reload({ stream: true }))
}

const pages = () => {
  return src('src/pages/index.html')
    .pipe(inject(src(paths.script, { base: srcDir, cwd: srcDir, read: false })))
    .pipe(inject(src(paths.style, { base: srcDir, cwd: srcDir, read: false })))
    .pipe(dest(distDir))
}

const server = () => {
  watch(paths.script, { cwd: srcDir }, script)
  watch(paths.style, { cwd: srcDir }, style)
  watch([paths.image, paths.font], { cwd: srcDir }, bs.reload) // 开发阶段不需要重新打包
  watch([paths.public], { cwd: publicDir }, bs.reload) // 开发阶段不需要重新打包

  bs.init({
    open: true,
    notify: false,
    server: {
      baseDir: [distDir, srcDir, tmpDir],
    }
  })
}

const clear = () => {
  return del([distDir, tmpDir])
}

const compile = parallel(style, script)
const dev = series(clear, compile)
const build = series(clear, parallel(compile, font, extra), pages)

module.exports = {
  compile,
  build,
  server,
  dev
}