const express = require('express')
const router  = express.Router()
const fs      = require('fs')
const covid   = require('../data/LATEST_DATA.json')

router.get('/', (req, res) => {
    res.sendFile('index.html')
})

router.get('/latest-date', (req, res) => {
    res.json(covid.date)
})

router.get('/covid-world', (req, res) => {
    res.json(covid)
})

module.exports = router