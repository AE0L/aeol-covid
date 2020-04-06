const express     = require('express')
const app         = express()
const path        = require('path')
const routes      = require('./routes')
const covid       = require('./routes/covid')
const body_parser = require('body-parser')

const {  PORT, NODE_ENV } = require('./config')

covid.setup()

app.use(body_parser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(routes)

app.listen(PORT, () => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`App running at http://localhost:${PORT}`)
    }
})
