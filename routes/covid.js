const cron  = require('node-cron')
const fs    = require('fs')
const fetch = require('node-fetch')

const COVID_WORLD_URL  = 'https://covidapi.info/api/v1/global'
const COVID_GLOBAL_URL = 'https://covidapi.info/api/v1/global/latest'

async function fetch_latest_covid_data() {
    const world_data   = await fetch(COVID_WORLD_URL)
    const world_json   = await world_data.json()
    const world_string = await JSON.stringify(world_json)

    fs.writeFile('./data/WORLD_COVID.json', world_string, err => {
        if (err) { console.log(err) }

        console.log('COVID-19 latest world data received...')
    })

    const global_data   = await fetch(COVID_GLOBAL_URL)
    const global_json   = await global_data.json()
    const global_string = await JSON.stringify(global_json)

    fs.writeFile('./data/GLOBAL_COVID.json', global_string, err => {
        if (err) { console.log(err) }

        console.log('COVID-19 latest global data received...')
    })
}

function setup() {
    // 0:00 AM
    cron.schedule('0 0 * * *', () => {
        console.log('Fetching 0:00 AM COVID-19 data')
        fetch_latest_covid_data()
    })

    // 8:00 AM
    cron.schedule('0 8 * * * ', () => {
        console.log('Fetching 8:00 AM COVID-19 data')
        fetch_latest_covid_data()
    })

    // 4:00 PM
    cron.schedule('0 16 * * *', () => {
        console.log('Fetching 4:00 PM COVID-19 data')
        fetch_latest_covid_data()
    })

    fetch_latest_covid_data()
}

module.exports = {
    setup:  setup,
}