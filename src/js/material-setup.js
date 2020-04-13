import { MDCRipple           } from '@material/ripple'
import { MDCTopAppBar        } from '@material/top-app-bar'
import { el                  } from './utils'
import { style_remove        } from './utils'
import { style_apply         } from './utils'
import { get_config          } from './covid-config.js'
import * as search_bar from './mdc-components/search-bar'
import * as card_menu from './mdc-components/card-menu'
import * as snackbar from './mdc-components/snackbar'
import * as theme_changer from './mdc-components/theme-changer'
import add_country             from './add-country.js'

async function setup_app_bar() {
    const app_bar = el('top-app-bar')
    const search_bar = el('search-app-bar')

    new MDCTopAppBar(app_bar)

    let docked = true

    const toggle = (s, e) => (s ? style_remove : style_apply)('docked', e)

    const style_app_bar = (scroll) => {
        if ((scroll && !docked) || (!scroll && docked)) return

        toggle(scroll, app_bar)
        toggle(scroll, search_bar)

        docked = !docked
    }

    document.onscroll = function() { 
        style_app_bar(this.documentElement.scrollTop > 0)
    }
}

function setup_ripples() {
    [].map.call(document.querySelectorAll('.ripple'), (e) => {
        const ripple = new MDCRipple(e)

        ripple.unbounded = true
    })
}

function setup_cards(config) {
    config.countries.forEach(({ name, confirmed, deaths, recovered }) => {
        if (name === 'World') return

        add_country(name, confirmed, deaths, recovered, scroll=false)
    })

    { [].map.call(document.querySelectorAll('.card__menu'), card_menu.attach) }
}

export default async function material_setup() {
    const config = await get_config()

    theme_changer.initialize(config)
    setup_app_bar()
    search_bar.initialize(config)
    card_menu.initialize()
    snackbar.initialize()
    setup_cards(config)
    setup_ripples()
}

