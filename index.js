const express     = require('express')
const app         = express()
const path        = require('path')
const routes      = require('./routes')
const covid       = require('./routes/covid')
const body_parser = require('body-parser')
const static_gzip = require('express-static-gzip')
const compression = require('compression')

const { PORT, NODE_ENV } = require('./config')

if (NODE_ENV === 'development') {
    var webpack  = require('webpack');
    var config   = require('./webpack.config.js');
    var compiler = webpack(config);

    app.use(require("webpack-dev-middleware")(compiler, {
        noInfo: true, publicPath: config.output.publicPath
    }));

    app.use(require('webpack-hot-middleware')(compiler));
}

covid.setup()

app.use(body_parser.json())

app.use(compression({ filter: (req, res) => {
    if (req.headers['x-no-compression']) {
        return false
    }

    return compression.filter(req, res)
}}))

app.use('/', static_gzip(path.join(__dirname, 'dist'), {
    enableBrotli: true,
}))

app.use(routes)

app.listen(PORT, () => {
    if (NODE_ENV === 'development') {
        console.log(`App running at http://localhost:${PORT}`)
    }
})
