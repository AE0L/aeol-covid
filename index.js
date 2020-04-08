const express     = require('express')
const app         = express()
const path        = require('path')
const routes      = require('./routes')
const covid       = require('./routes/covid')
const body_parser = require('body-parser')
const static_gzip = require('express-static-gzip')

const { PORT, NODE_ENV } = require('./config')

if (NODE_ENV === 'development') {
    const webpack     = require('webpack')
    const webpackDev  = require('webpack-dev-middleware')
    const config      = require('./webpack.config.js')
    const compiler    = webpack(config)

    app.use(webpackDev(compiler, { publicPath: '/' }))
}

covid.setup()

app.use(body_parser.json())
app.use('/', static_gzip(path.join(__dirname, 'dist'), {
    enableBrotli: true,
}))
app.use(routes)

app.listen(PORT, () => {
    if (NODE_ENV === 'development') {
        console.log(`App running at http://localhost:${PORT}`)
    }
})
