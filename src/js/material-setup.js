import { MDCRipple           } from '@material/ripple'
import { MDCTopAppBar        } from '@material/top-app-bar'
import { MDCIconButtonToggle } from '@material/icon-button'
import { MDCMenu             } from '@material/menu'
import { MDCList             } from '@material/list'
import { MDCTextField        } from '@material/textfield'
import { MDCSnackbar         } from '@material/snackbar'
import { get_country         } from './covid-data.js'
import { get_country_list    } from './covid-data.js'
import { el                  } from './utils.js'
import { style_remove        } from './utils.js'
import { style_apply         } from './utils.js'
import { remove_child        } from './utils.js'
import { get_config          } from './covid-config.js'
import { update_config       } from './covid-config.js'
import { add_to_countries    } from './covid-config.js'
import initialize_search_bar   from './mdc-components/search-bar'
import Clusterize              from 'clusterize.js'
import Fuse                    from 'fuse.js'
import add_country             from './add-country.js'
import change_theme            from './theme-changer.js'

let action_snackbar = null

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

function clear_children(el) {
    while (el.lastChild) {
        el.removeChild(el.lastChild)
    }
}

function setup_ripples() {
    [].map.call(document.querySelectorAll('.ripple'), (e) => {
        const ripple = new MDCRipple(e)

        ripple.unbounded = true
    })
}

let context_menu;
let selected_card;

function setup_cards(config) {
    config.countries.forEach(({ name, confirmed, deaths, recovered }) => {
        if (name === 'World') return

        add_country(name, confirmed, deaths, recovered, scroll=false)
    });

    context_menu = new MDCMenu(el('context-menu'))
    context_menu.setFixedPosition(true)

    { [].map.call(document.querySelectorAll('.card__menu'), attach_card_menu) }

    context_menu.listen('MDCMenu:selected', (evt) => {
        const { country } = selected_card.dataset
        const card = el(`${country}-card`)

        config.remove_country(country)
        card.classList.add('remove')
        card.onanimationend = () => remove_child('card-container', card)
    })
}

function setup_snackbar() {
    action_snackbar = new MDCSnackbar(el('action-snackbar'))
}

function disabled_list_item(evt) {
    evt.stopPropagation()
}

export function attach_card_menu(e) {
    e.onclick = () => {
        if (e.dataset.country === 'world') {
            context_menu.setEnabled(0, false)
            context_menu.getOptionByIndex(0).addEventListener('click', disabled_list_item)
        } else {
            context_menu.setEnabled(0, true)
            context_menu.getOptionByIndex(0).removeEventListener('click', disabled_list_item)
        }

        context_menu.setAnchorElement(e)
        context_menu.open = true
        selected_card = e
    }
}

export default async function material_setup() {
    const config = await get_config()

    setup_theme_changer(config.theme)
    setup_app_bar()
    initialize_search_bar(config)
    setup_cards(config)
    setup_snackbar()
    setup_ripples()
}
