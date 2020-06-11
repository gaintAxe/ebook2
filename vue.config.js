// function mock(app, url, data) {
//     app.get(url, (req, res) => {
//         res.json(data)
//     })
// }

// const homeData = require('./src/mock/bookHome')
// const shelfData = require('./src/mock/bookShelf')
// const listData = require('./src/mock/bookList')
// const flatListData = require('./src/mock/bookFlatList')

module.exports = {
    // 在vue-cli.3.3版本后 baseUrl被废除了，因此这边要写成 publicPath
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    lintOnSave: false,
    devServer: {
        // before(app) {
        //     mock(app, '/book/home', homeData)
        //     mock(app, '/book/shelf', shelfData)
        //     mock(app, '/book/list', listData)
        //     mock(app, '/book/flat-list', flatListData)
        // }
    }, configureWebpack: {
        performance: {
            hints: 'warning',
            maxAssetSize: 524288 * 100,
            maxEntrypointSize: 524288 * 100
        }
    }
    
}