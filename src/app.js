import { initialize_covid_data } from './js/covid-data.js'
import { get_world_data        } from './js/covid-data.js'
import { el, el_text           } from './js/utils.js'
import { performance_check     } from './js/utils.js'
import { init_config           } from './js/covid-config.js'
import { get_config            } from './js/covid-config.js'
import material_setup            from './js/material-setup.js'
import add_country               from './js/add-country.js'

async function setup() {
    await initialize_covid_data()
    
    const covid_world_data = await get_world_data()
    const world_confirmed  = el('world-confirmed')
    const world_deaths     = el('world-deaths')
    const world_recovered  = el('world-recovered')

    el_text(world_confirmed, covid_world_data.confirmed.toLocaleString())
    el_text(world_deaths,    covid_world_data.deaths.toLocaleString())
    el_text(world_recovered, covid_world_data.recovered.toLocaleString())

    el('world-card').classList.remove('hide')

    const initialized = await init_config()

    if (!initialized) {
        console.warn(`Can't setup configuration, changes will not be saved.`)
    }
    
    material_setup()
}

performance_check(setup)
