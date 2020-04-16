/** @format */

const cron = require('node-cron')
const fs = require('fs')
const fetch = require('node-fetch')
const { NODE_ENV } = require('../config')

const TIME_SERIES_LATEST = 'https://pomber.github.io/covid19/timeseries.json'

async function fetch_latest_covid_data() {
    const covid_data = await fetch(TIME_SERIES_LATEST)
    const covid_json = await covid_data.json()
    const entries = Object.freeze(Object.entries(covid_json))
    const countries = Object.freeze(Object.keys(covid_json))
    const latest_data = {
        date: entries[0][1][entries[0][1].length - 1].date,
        countries: countries,
        world: {
            confirmed: 0,
            deaths: 0,
            recovered: 0
        },
        result: {}
    }

    for (const country of countries) {
        const data = covid_json[country]
        const latest = d => data[data.length - 1][d]

        const confirmed = latest('confirmed')
        const deaths = latest('deaths')
        const recovered = latest('recovered')

        latest_data.world.confirmed += confirmed
        latest_data.world.deaths += deaths
        latest_data.world.recovered += recovered

        latest_data.result[country] = {
            confirmed: confirmed,
            deaths: deaths,
            recovered: recovered
        }
    }

    const latest_data_string = JSON.stringify(latest_data)

    fs.writeFile('./data/LATEST_DATA.json', latest_data_string, err => {
        if (err) throw err

        console.log('LATEST_DATA.json updated')
    })
}

function setup() {
    if (NODE_ENV !== 'development') {
        cron.schedule('30 0,2,12 * * *', () => {
            fetch_latest_covid_data()
        })

        fetch_latest_covid_data()
    }
}

module.exports = {
    setup: setup
}
