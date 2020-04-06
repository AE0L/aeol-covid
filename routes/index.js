const express = require('express')
const router  = express.Router()
const fs      = require('fs')
const covid   = require('../routes/covid')

router.get('/', (req, res) => {
    res.sendFile('index.html')
})

router.get('/global', (req, res) => {
    fs.readFile('./data/WORLD_COVID.json', (err, data) => {
        if (err) { throw err }

        res.json(JSON.parse(data).result)
    })
})

router.post('/country', (req, res) => {
    const { country } = req.body

    fs.readFile('./data/GLOBAL_COVID.json', (err, raw) => {
        if (err) { throw err }

        const json = JSON.parse(raw)

        res.json(json.result.filter(c => Object.keys(c)[0] === country)[0][country])
    })
})

router.post('/countries', (req, res) => {
    const { countries } = req.body

    fs.readFile('./data/GLOBAL_COVID.json', (err, raw) => {
        if (err) { throw err }

        const json = JSON.parse(raw)

        res.json(json.result.filter(c => countries.includes(Object.keys(c)[0])))
    })
})

module.exports = router