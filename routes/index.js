const express = require('express')
const router  = express.Router()
const fs      = require('fs')
const covid   = require('../data/LATEST_DATA.json')

router.get('/', (req, res) => {
    res.sendFile('index.html')
})

router.get('/global', (req, res) => {
    res.json(covid.world)
})

router.get('/latest-date', (req, res) => {
    res.json(covid.date)
})

router.post('/country', (req, res) => {
    const { country } = req.body

    if (covid.countries.includes(country)) {
        res.json(covid.result[country])
    } else {
        res.status(400).send({
            message: `Invalid country, ${country}`,
        })
    }
})

router.post('/countries', (req, res) => {
    const { countries } = req.body

    const result = []

    for (const country of countries) {
        if (covid.includes(country)) {
            result.push({
                country:   country,
                confirmed: covid.result[country].confirmed,
                deaths:    covid.result[country].deaths,
                recovered: covid.result[country].recovered
            })
        } else {
            res.status(400).send({
                message: `Invalid country, ${country}`
            })
        }
    }

    res.json(result)
})

router.get('/country-list', (req, res) => {
    res.json(covid.countries)
})

module.exports = router