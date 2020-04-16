/** @format */

import { MDCRipple } from '@material/ripple'
import add_country from './add-country.js'
import { get_config } from './covid-config.js'
import * as app_bar from './mdc-components/app-bar'
import * as card_menu from './mdc-components/card-menu'
import * as search_bar from './mdc-components/search-bar'
import * as theme_changer from './mdc-components/theme-changer'

function setup_ripples() {
    ;[].map.call(document.querySelectorAll('.ripple'), e => {
        const ripple = new MDCRipple(e)

        ripple.unbounded = true
    })
}

function setup_saved_countries(config) {
    config.countries.forEach(({ name, confirmed, deaths, recovered }) => {
        if (name === 'World') return

        add_country(name, confirmed, deaths, recovered, (scroll = false))
    })

    {
        ;[].map.call(document.querySelectorAll('.card__menu'), card_menu.attach)
    }
}

export default async function material_setup() {
    const config = await get_config()

    theme_changer.initialize(config)
    app_bar.initialize()
    search_bar.initialize(config)

    setup_saved_countries(config)
    setup_ripples()
}
