module.exports = {
  src: 'src', // 源文件根目录
  dist: 'dist', // 打包文件根目录
  tmp: '.tmp', // 临时文件跟目录
  public: 'public', // 静态文件
  // paths里的配置基于源文件根目录
  paths: {
    script: 'assets/script/**/*.js',
    style: 'assets/style/**/*.scss',
    font: 'assets/fonts/**',
    image: 'assets/images/**',
    public: '**'
  }
}