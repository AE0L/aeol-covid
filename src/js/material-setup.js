import { MDCRipple           } from '@material/ripple'
import { MDCTopAppBar        } from '@material/top-app-bar'
import { MDCIconButtonToggle } from '@material/icon-button'
import { MDCMenu             } from '@material/menu'
import { MDCList             } from '@material/list'
import { MDCTextField        } from '@material/textfield'
import { country_data        } from './covid-data.js'
import { country_list        } from './covid-data.js'
import { el                  } from './utils.js'
import { style_remove        } from './utils.js'
import { style_apply         } from './utils.js'
import { get_config          } from './covid-config.js'
import { update_config       } from './covid-config.js'
import { add_to_countries    } from './covid-config.js'
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


async function setup_search_bar(config) {
    const countries               = await country_list()
    const search_btn              = el('search-btn')
    const search_bar              = el('search-app-bar')
    const search_field            = el('search-text-field')
    const search_input            = el('search-text-field-input')
    const search_clear            = el('search-text-field-clear')
    const exit_search_btn         = el('search-exit-btn')
    const search_result_container = el('search-result-container')
    const search_result           = el('search-result-list')
    const body                    = el('body')
    const search_result_list      = new MDCList(search_result)

    new MDCTopAppBar(search_bar)
    new MDCTextField(search_field)

    // styles
    const style_hide = (...e) => e.forEach(_e => style_remove('show', _e))
    const hide_search_bar = () => style_hide(search_bar, search_result_container, search_clear)
    const body_scroll = () => style_remove('no-scroll', body)

    search_bar.style.clipPath = `circle(0% at ${search_btn.offsetLeft + 24}px 50%)`

    // fuzzy searcher
    const fuse = new Fuse(countries, { threshold: 0 })

    // virtualized list
    const virtual_list    = new Clusterize({
        scrollElem: search_result_container,
        contentElem: search_result,
        show_no_data_row: false
    })

    const list_items = []
    let   result     = []

    const select_list_item = (c) => {
        list_items.push(`
            <li class=mdc-list-item data-value=${c} role=option>
                <span class=mdc-list-item__text>${c}</span>
            </li>
        `)
    }

    countries.forEach(select_list_item)

    // event handlers
    search_input.onkeyup = function() {
        virtual_list.clear()

        const { value } = this

        search_clear.classList[value ? 'add' : 'remove']('show')

        if (value) {
            result = fuse.search(value)

            virtual_list.update(result.map(({ refIndex: i }) => list_items[i]))
        }
    }

    search_result_list.listen('MDCList:action', async ({ detail: { index }}) => {
        search_input.value = ''

        body_scroll()
        hide_search_bar()

        virtual_list.clear()

        const country_name = result[index].item

        const { confirmed, deaths, recovered } = await country_data(country_name)

        add_country(country_name, confirmed, deaths, recovered)
        config.save_country(country_name, confirmed, deaths, recovered)
    })

    search_clear.onclick = function() {
        search_input.value = ''
        search_field.focus()
        style_remove('show', search_clear)

        virtual_list.clear()
    }

    exit_search_btn.onclick = () => {
        search_input.value = ''

        body_scroll()
        hide_search_bar()
        virtual_list.clear()
    }

    search_btn.onclick = () => {
        el('body').classList.add('no-scroll')
        search_bar.style.clipPath = `circle(0% at ${search_btn.offsetLeft + 24}px 50%)`
        setTimeout(() => search_bar.classList.add('show'), 1)
        search_field.focus()

        search_result_container.classList.add('show')
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


function setup_cards(config) {
    config.countries.filter(c => c.name !== 'World').forEach(({ name, confirmed, deaths, recovered }) => {
        add_country(name, confirmed, deaths, recovered, scroll=false)
    })
}



export default async function material_setup() {
    const config = await get_config()

    setup_theme_changer(config.theme)
    setup_app_bar()
    setup_search_bar(config)
    setup_cards(config)
    setup_ripples()
}
