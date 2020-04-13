import { MDCRipple           } from '@material/ripple'
import { MDCTopAppBar        } from '@material/top-app-bar'
import { MDCIconButtonToggle } from '@material/icon-button'
import { MDCMenu             } from '@material/menu'
import { MDCList             } from '@material/list'
import { MDCTextField        } from '@material/textfield'
import { get_country         } from './covid-data.js'
import { get_country_list    } from './covid-data.js'
import { el                  } from './utils'
import { style_remove        } from './utils'
import { style_apply         } from './utils'
import { remove_child        } from './utils'
import { get_config          } from './covid-config.js'
import { update_config       } from './covid-config.js'
import { add_to_countries    } from './covid-config.js'
import * as search_bar from './mdc-components/search-bar'
import * as card_menu from './mdc-components/card-menu'
import * as snackbar from './mdc-components/snackbar'
import Clusterize              from 'clusterize.js'
import Fuse                    from 'fuse.js'
import add_country             from './add-country.js'
import change_theme            from './theme-changer.js'

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

async function setup_theme_changer(config_theme) {
    const change_btn   = el('theme-change')
    const theme_change = new MDCIconButtonToggle(change_btn)

    change_theme(config_theme)
    theme_change.on = config_theme === 'dark'

    theme_change.listen('MDCIconButtonToggle:change', ({ detail: { isOn }}) => {
        const new_theme = isOn ? 'dark' : 'light'
        change_theme(new_theme)
        update_config({ theme: new_theme })
    })
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

    setup_theme_changer(config.theme)
    setup_app_bar()
    search_bar.initialize(config)
    card_menu.initialize()
    snackbar.initialize()
    setup_cards(config)
    setup_ripples()
}

