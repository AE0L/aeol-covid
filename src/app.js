/** @format */

import { init_config } from './js/covid-config.js'
import { get_world_data, initialize_covid_data } from './js/covid-data.js'
import material_setup from './js/material-setup.js'
import { el, el_text } from './js/utils.js'
import * as pwa from './js/pwa'

async function setup() {
    await initialize_covid_data()
    const config_initialized = await init_config()

    if (!config_initialized) {
        console.warn(`Can't setup configuration, changes will not be saved.`)
    }

    pwa.initialize()

    const covid_world_data = await get_world_data()
    const world_confirmed = el('world-confirmed')
    const world_deaths = el('world-deaths')
    const world_recovered = el('world-recovered')

    el_text(world_confirmed, covid_world_data.confirmed.toLocaleString())
    el_text(world_deaths, covid_world_data.deaths.toLocaleString())
    el_text(world_recovered, covid_world_data.recovered.toLocaleString())

    el('world-card').classList.remove('hide')

    material_setup()
}

setup()
