module.exports = {
    // 在vue-cli.3.3版本后 baseUrl被废除了，因此这边要写成 publicPath
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    lintOnSave:false
}