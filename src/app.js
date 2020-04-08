import covid from './covid-data.js'
import material_setup from './material-setup.js'
import add_country from './add-country.js'

const e = (i) => document.getElementById(i)

async function setup() {
    const world_data = await covid.world()
    // const ph_data    = await covid.country('Philippines')

    e('world-confirmed').innerText = world_data.confirmed.toLocaleString()
    e('world-deaths').innerText    = world_data.deaths.toLocaleString()
    e('world-recovered').innerText = world_data.recovered.toLocaleString()

    e('world-data-container').classList.remove('hide')

    // add_country('Philippines', ph_data.confirmed, ph_data.deaths, ph_data.recovered)
}

material_setup()
setup()
