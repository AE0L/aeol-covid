import { MDCRipple } from '@material/ripple'
import { MDCTopAppBar } from '@material/top-app-bar'
import { MDCIconButtonToggle } from '@material/icon-button'
import { MDCMenu } from '@material/menu'
import { MDCDialog } from '@material/dialog'
import { MDCSelect } from '@material/select'
import add_country from './add-country.js'
import change_theme from './js/theme-changer.js'
import covid from './covid-data.js'

const e     = (i) => document.getElementById(i)
const CACHE = { theme: 'light' }

function setup_app_bar() {
    const app_bar = e('top-app-bar')
    const elem    = document.documentElement

    CACHE['top-app-bar'] = new MDCTopAppBar(app_bar)

    document.onscroll = function() {
        if (elem.scrollTop > 0) {
            app_bar.classList.replace('docked', 'scrolled')
        } else {
            app_bar.classList.replace('scrolled', 'docked')
        }
    }
}


function setup_theme_changer() {
    const theme_change = new MDCIconButtonToggle(e('theme-change'))
    CACHE['theme-change-toggle'] = theme_change

    theme_change.listen('MDCIconButtonToggle:change', ({ detail: { isOn }}) => {
        change_theme(isOn ? 'dark' : 'light')
    })
}


function setup_add_fab() {
    const button = e('add-fab')
    const dialog = CACHE['add-dialog']

    CACHE['add-fab-ripple'] = new MDCRipple(button)

    button.onclick = () => {
        dialog.open()
    }
}


async function setup_add_dialog() {
    const dialog         = e('add-dialog')
    const add_dialog     = new MDCDialog(dialog)
    const add_button     = e('dialog-add-button')
    const add_select     = e('add-dialog-select')
    const country_select = new MDCSelect(add_select)
    const select_menu    = e('add-dialog-select-menu')

    CACHE['add-dialog']        = add_dialog
    CACHE['add-dialog-select'] = country_select

    const countries = await covid.country_list()

    countries.forEach(country => {
        const template = `
            <li class="mdc-list-item" data-value="${country}" role="option">
              <span class="mdc-list-item__text">${country}</span>
            </li>
        `

        select_menu.innerHTML += template
    })

    add_dialog.listen('MDCDialog:opened', () => {
        add_dialog.layout()
        add_button.focus()
    })

    add_dialog.listen('MDCDialog:closing', async ({ detail: { action }}) => {
        if (action === 'add') {
            const country = country_select.value
            const { confirmed, deaths, recovered } = await covid.country(country)

            add_country(country, confirmed, deaths, recovered)
        }
    })
}


export default async function material_setup() {
    setup_theme_changer()
    setup_app_bar()
    setup_add_dialog()
    setup_add_fab()


    // ICON BUTTONS
    Array.from(document.querySelectorAll('.mdc-icon-button')).forEach(btn => {
        const ripple = new MDCRipple(btn)

        ripple.unbounded = true
    })

    // MENUS
    CACHE['menus'] = []

    Array.from(document.querySelectorAll('.mdc-card > .mdc-menu')).forEach(el => {
        const button = e(`button-${el.id}`)
        const menu = new MDCMenu(el)
        console.log(button)

        menu.setAnchorElement(button)

        CACHE['menus'][el.id] = {
            button: button,
            menu: menu
        }

        button.onclick = () => {
            menu.open = true
        }
    })
}
