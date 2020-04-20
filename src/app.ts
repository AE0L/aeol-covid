import CovidData, { World } from './js/covid-data'
import material_setup from './js/material-setup'
import * as pwa from './js/pwa'
import { el, el_text, style_remove } from './js/utils'

async function setup() {
    await CovidData.initialize()

    pwa.initialize()

    const { confirmed, deaths, recovered }: World = CovidData.world_data

    el_text(el('world-confirmed'), confirmed.toLocaleString())
    el_text(el('world-deaths'), deaths.toLocaleString())
    el_text(el('world-recovered'), recovered.toLocaleString())

    style_remove('hide', el('world-card'))

    material_setup()
}

setup()
