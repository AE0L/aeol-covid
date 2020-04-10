import { world_data        } from './js/covid-data.js'
import { el, el_text       } from './js/utils.js'
import { performance_check } from './js/utils.js'
import material_setup        from './js/material-setup.js'
import add_country           from './js/add-country.js'

async function setup() {
    material_setup()

    const covid_world_data = await world_data()
    const world_confirmed  = el('world-confirmed')
    const world_deaths     = el('world-deaths')
    const world_recovered  = el('world-recovered')

    el_text(world_confirmed, covid_world_data.confirmed.toLocaleString())
    el_text(world_deaths,    covid_world_data.deaths.toLocaleString())
    el_text(world_recovered, covid_world_data.recovered.toLocaleString())

    el('world-card').classList.remove('hide')
}

performance_check(setup)
