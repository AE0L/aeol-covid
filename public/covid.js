const cron  = require('node-cron')
const fs    = require('fs')
const fetch = require('node-fetch')

const COVID_WORLD_URL  = 'https://covidapi.info/api/v1/global'
const COVID_GLOBAL_URL = 'https://covidapi.info/api/v1/global/latest'

function fetch_world() {
    fetch(COVID_WORLD_URL)
        .then(res => res.json())
        .then(json => {
            fs.writeFile('./data/WORLD_COVID.json', JSON.stringify(json), err => {
                if (err) { console.log(err) }
            })
        })
}

function fetch_global() {
    fetch(COVID_GLOBAL_URL)
        .then(res => res.json())
        .then(json => {
            fs.writeFile('./data/GLOBAL_COVID.json', JSON.stringify(json), err => {
                if (err) { console.log(err) }
            })
        })
}

function setup() {
    cron.schedule('0 1 * * *', () => {
        fetch_world()
        fetch_global()
    })
}

module.exports = {
    setup:  setup,
}